import { ConfigError } from '@/lib/error';

export const MISSING_API_BASE_URL_MESSAGE =
  'API 주소 환경 변수(NEXT_PUBLIC_API_BASE_URL)가 설정되지 않았습니다. .env.example을 참고해 .env.local을 만들고 서버를 재시작하세요.';

/**
 * 백엔드 API의 절대 URL을 만든다.
 * 서버 전용 코드는 런타임 환경 변수 `API_BASE_URL`을 우선 사용하고,
 * 없으면 빌드 시점에 주입되는 `NEXT_PUBLIC_API_BASE_URL`로 대체한다.
 */
const getApiBaseUrl = () => {
  const baseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new ConfigError(MISSING_API_BASE_URL_MESSAGE);
  }

  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
};

export const createApiUrl = (path: string) => {
  const requestPath = path.startsWith('/') ? path : `/${path}`;

  return `${getApiBaseUrl()}${requestPath}`;
};

type QueryValue = string | number | boolean | null | undefined;

/** 쿼리 파라미터를 안전하게 인코딩해 경로에 붙인다. 값이 비어 있으면 생략한다. */
export const withQuery = (path: string, query: Record<string, QueryValue>) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });

  const queryString = params.toString();

  return queryString ? `${path}?${queryString}` : path;
};
