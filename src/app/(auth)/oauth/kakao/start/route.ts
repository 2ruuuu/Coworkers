import { type NextRequest, NextResponse } from 'next/server';

import {
  OAUTH_REDIRECT_COOKIE,
  OAUTH_STATE_COOKIE,
  createOAuthState,
  oauthCookieOptions,
} from '@/lib/auth/oauthState';
import { getSafeRedirectPath } from '@/lib/auth/redirect';
import { getSiteUrl } from '@/utils/url';

export async function GET(request: NextRequest) {
  const kakaoApiKey = process.env.KAKAO_REST_API_KEY;
  const kakaoRedirectUri = process.env.KAKAO_REDIRECT_URI;
  const redirectPath = getSafeRedirectPath(request.nextUrl.searchParams.get('redirect'));
  const siteUrl = getSiteUrl(request);

  if (!kakaoApiKey || !kakaoRedirectUri) {
    return NextResponse.redirect(new URL('/login?error=config_error', siteUrl));
  }

  const state = createOAuthState();
  const params = new URLSearchParams({
    client_id: kakaoApiKey,
    redirect_uri: kakaoRedirectUri,
    response_type: 'code',
    state,
  });

  const response = NextResponse.redirect(
    `https://kauth.kakao.com/oauth/authorize?${params.toString()}`,
  );

  // state는 CSRF 검증용 nonce로만 쓰고, 로그인 후 이동할 경로는 별도 쿠키에 보관한다.
  response.cookies.set(OAUTH_STATE_COOKIE, state, oauthCookieOptions);

  if (redirectPath) {
    response.cookies.set(OAUTH_REDIRECT_COOKIE, redirectPath, oauthCookieOptions);
  } else {
    response.cookies.delete({ name: OAUTH_REDIRECT_COOKIE, path: oauthCookieOptions.path });
  }

  return response;
}
