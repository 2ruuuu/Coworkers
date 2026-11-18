import 'server-only';

import { refreshAccessToken } from '@/apis/auth/refresh';
import { createApiUrl } from '@/lib/apiUrl';
import { ApiError } from '@/lib/error';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from '@/utils/auth/token';

const isFormDataBody = (body: RequestInit['body']) => {
  return typeof FormData !== 'undefined' && body instanceof FormData;
};

const createServerHeaders = (
  optionsHeaders: HeadersInit | undefined,
  body: RequestInit['body'],
  accessToken: string | null,
) => {
  const headers = new Headers(optionsHeaders);

  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (body != null && !isFormDataBody(body) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return headers;
};

/**
 * 응답 본문을 파싱한다.
 * 204는 undefined, JSON은 객체, 그 외(예: 초대 링크 문자열)는 텍스트로 반환한다.
 * 백엔드 응답은 런타임 검증 없이 호출부가 지정한 타입 T로 취급한다.
 */
const parseResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('Content-Type');
  const data: unknown = contentType?.includes('application/json')
    ? await response.json()
    : await response.text();

  return data as T;
};

/**
 * 서버 컴포넌트 렌더 중에는 쿠키를 수정할 수 없으므로(Next.js 제약),
 * 쿠키 쓰기 실패는 무시한다. 쿠키 갱신은 proxy.ts가 담당한다.
 */
const ignoreCookieWriteError = async (write: () => Promise<void>) => {
  try {
    await write();
  } catch {
    // RSC 렌더 중에는 cookies().set/delete가 예외를 던진다.
  }
};

const refreshSession = async (): Promise<string | null> => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const { accessToken } = await refreshAccessToken({ refreshToken });
    await ignoreCookieWriteError(() => setAccessToken(accessToken));
    return accessToken;
  } catch {
    await ignoreCookieWriteError(clearAuthTokens);
    return null;
  }
};

const request = (path: string, options: RequestInit, accessToken: string | null) => {
  return fetch(createApiUrl(path), {
    ...options,
    headers: createServerHeaders(options.headers, options.body, accessToken),
    cache: options.cache ?? 'no-store',
  });
};

/**
 * 인증 쿠키를 붙여 백엔드 API를 호출한다. (서버 전용)
 * - 401이면 refresh 토큰으로 한 번 갱신 후 재시도한다.
 * - 실패 응답은 status를 가진 ApiError로 던진다.
 */
export const serverFetcher = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  let response = await request(path, options, await getAccessToken());

  if (response.status === 401) {
    const refreshedAccessToken = await refreshSession();

    if (refreshedAccessToken) {
      response = await request(path, options, refreshedAccessToken);
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  return parseResponse<T>(response);
};
