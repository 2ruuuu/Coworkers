import { cookies } from 'next/headers';

import 'server-only';

import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  type TokenCookieOptions,
  accessTokenCookieOptions,
  getTokenCookieOptions,
  refreshTokenCookieOptions,
} from './cookie';

type TokenCookieKey = typeof ACCESS_TOKEN_KEY | typeof REFRESH_TOKEN_KEY;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const setToken = async (key: TokenCookieKey, value: string, defaults: TokenCookieOptions) => {
  const store = await cookies();
  store.set(key, value, getTokenCookieOptions(value, defaults));
};

const getToken = async (key: TokenCookieKey) => {
  const store = await cookies();
  return store.get(key)?.value ?? null;
};

export async function setAuthTokens({ accessToken, refreshToken }: AuthTokens) {
  await setToken(ACCESS_TOKEN_KEY, accessToken, accessTokenCookieOptions);
  await setToken(REFRESH_TOKEN_KEY, refreshToken, refreshTokenCookieOptions);
}

export async function setAccessToken(accessToken: string) {
  await setToken(ACCESS_TOKEN_KEY, accessToken, accessTokenCookieOptions);
}

export async function getAccessToken() {
  return getToken(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken() {
  return getToken(REFRESH_TOKEN_KEY);
}

export async function getAuthTokens() {
  return {
    accessToken: await getToken(ACCESS_TOKEN_KEY),
    refreshToken: await getToken(REFRESH_TOKEN_KEY),
  };
}

/**
 * 로그인 세션이 유효한지 판단한다.
 * access 토큰은 짧게 만료되어도 refresh 토큰으로 갱신할 수 있으므로 refresh 토큰 기준으로 본다.
 */
export async function hasAuthSession() {
  return Boolean(await getRefreshToken());
}

export async function clearAuthTokens() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_KEY);
  store.delete(REFRESH_TOKEN_KEY);
}
