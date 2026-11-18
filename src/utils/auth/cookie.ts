const isProd = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/',
};

export const ACCESS_TOKEN_KEY = 'coworkers:accessToken';
export const REFRESH_TOKEN_KEY = 'coworkers:refreshToken';

/** JWT의 exp를 읽지 못할 때 사용하는 기본 만료 시간 */
const DEFAULT_ACCESS_TOKEN_MAX_AGE = 60 * 60;
const DEFAULT_REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 14;

export const accessTokenCookieOptions = {
  ...baseCookieOptions,
  maxAge: DEFAULT_ACCESS_TOKEN_MAX_AGE,
};

export const refreshTokenCookieOptions = {
  ...baseCookieOptions,
  maxAge: DEFAULT_REFRESH_TOKEN_MAX_AGE,
};

export type TokenCookieOptions = typeof accessTokenCookieOptions;

/** JWT payload의 exp(초)를 읽어 남은 유효 시간(초)을 반환한다. 읽을 수 없으면 null */
export const getJwtMaxAge = (token: string, now = Date.now()): number | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(json) as { exp?: unknown };

    if (typeof exp !== 'number') return null;

    const maxAge = Math.floor(exp - now / 1000);
    return maxAge > 0 ? maxAge : null;
  } catch {
    return null;
  }
};

/** 토큰 만료 시간(JWT exp)에 맞춘 쿠키 옵션. exp를 읽지 못하면 기본값을 사용한다. */
export const getTokenCookieOptions = (
  token: string,
  defaults: TokenCookieOptions,
): TokenCookieOptions => {
  const maxAge = getJwtMaxAge(token);
  return maxAge ? { ...defaults, maxAge } : defaults;
};
