import { randomBytes, timingSafeEqual } from 'node:crypto';
import 'server-only';

/** OAuth state(CSRF 방지 nonce)를 보관하는 쿠키 */
export const OAUTH_STATE_COOKIE = 'coworkers:oauthState';
export const OAUTH_REDIRECT_COOKIE = 'coworkers:oauthRedirect';

export const oauthCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/oauth',
  maxAge: 60 * 10,
};

export const createOAuthState = () => randomBytes(16).toString('hex');

/** 콜백으로 돌아온 state가 시작할 때 쿠키에 저장한 값과 같은지 확인한다. */
export const isValidOAuthState = (received: string | null, expected: string | undefined) => {
  if (!received || !expected || received.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(received), Buffer.from(expected));
};
