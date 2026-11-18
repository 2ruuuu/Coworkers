import { type NextRequest, NextResponse } from 'next/server';

import { signInWithOAuthServer } from '@/apis/auth/server';
import {
  OAUTH_REDIRECT_COOKIE,
  OAUTH_STATE_COOKIE,
  isValidOAuthState,
  oauthCookieOptions,
} from '@/lib/auth/oauthState';
import { getPostLoginRedirectPath } from '@/lib/auth/redirect';
import { setAuthTokens } from '@/utils/auth/token';
import { getSiteUrl } from '@/utils/url';

const clearOAuthCookies = (response: NextResponse) => {
  response.cookies.delete({ name: OAUTH_STATE_COOKIE, path: oauthCookieOptions.path });
  response.cookies.delete({ name: OAUTH_REDIRECT_COOKIE, path: oauthCookieOptions.path });
  return response;
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const siteUrl = getSiteUrl(request);
  const redirectUri = process.env.KAKAO_REDIRECT_URI;

  const failureRedirect = (reason?: string) =>
    clearOAuthCookies(
      NextResponse.redirect(new URL(reason ? `/login?error=${reason}` : '/login', siteUrl)),
    );

  if (error || !code || !redirectUri) {
    return failureRedirect();
  }

  // 시작할 때 발급한 state와 다르면 다른 사이트가 유도한 로그인(login CSRF)으로 보고 거절한다.
  if (
    !isValidOAuthState(searchParams.get('state'), request.cookies.get(OAUTH_STATE_COOKIE)?.value)
  ) {
    return failureRedirect('oauth_failed');
  }

  try {
    const { accessToken, refreshToken } = await signInWithOAuthServer('KAKAO', {
      token: code,
      redirectUri,
    });

    await setAuthTokens({ accessToken, refreshToken });

    const postLoginRedirectPath = await getPostLoginRedirectPath({
      redirectPath: request.cookies.get(OAUTH_REDIRECT_COOKIE)?.value,
    });

    return clearOAuthCookies(NextResponse.redirect(new URL(postLoginRedirectPath, siteUrl)));
  } catch {
    return failureRedirect('oauth_failed');
  }
}
