import { ApiError } from '@/lib/error';

/** BFF 라우트 핸들러(src/app/api/proxy/[...path]/route.ts)의 경로 접두사 */
export const BFF_PREFIX = '/api/proxy';

/** 같은 출처의 Route Handler에 GET 요청을 보내 JSON을 받는다. 실패하면 ApiError를 던진다. */
export const getRouteJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, { method: 'GET', credentials: 'same-origin' });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  return response.json() as Promise<T>;
};

/**
 * 브라우저에서 인증이 필요한 백엔드 데이터를 조회한다.
 * BFF 라우트가 httpOnly 쿠키의 토큰을 붙여 백엔드로 전달한다.
 * (조회에 Server Action을 쓰면 POST로 직렬 실행되고 캐시되지 않으므로 GET 라우트를 사용한다.)
 */
export const bffGet = <T>(path: string) => getRouteJson<T>(`${BFF_PREFIX}${path}`);
