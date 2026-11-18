import { type NextRequest, NextResponse } from 'next/server';

import { refreshAccessToken } from '@/apis/auth/refresh';
import { PATHNAME_HEADER } from '@/constants/http';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  accessTokenCookieOptions,
  getTokenCookieOptions,
} from '@/utils/auth/cookie';

/**
 * access 토큰 쿠키가 만료되어 사라졌지만 refresh 토큰이 남아 있으면
 * 페이지 렌더 전에 access 토큰을 미리 갱신한다.
 * (서버 컴포넌트는 렌더 중 쿠키를 쓸 수 없으므로 여기서 갱신해 둔다.)
 */
export async function proxy(request: NextRequest) {
  // 서버 컴포넌트(레이아웃)가 로그인 리다이렉트 후 돌아올 경로를 알 수 있도록 현재 경로를 전달한다.
  request.headers.set(PATHNAME_HEADER, `${request.nextUrl.pathname}${request.nextUrl.search}`);

  const hasAccessToken = request.cookies.has(ACCESS_TOKEN_KEY);
  const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value;

  if (hasAccessToken || !refreshToken) {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  try {
    const { accessToken } = await refreshAccessToken({ refreshToken });

    // 같은 요청에서 렌더되는 서버 컴포넌트도 새 토큰을 읽을 수 있도록 요청 쿠키에도 반영한다.
    request.cookies.set(ACCESS_TOKEN_KEY, accessToken);

    const response = NextResponse.next({ request: { headers: request.headers } });
    response.cookies.set(
      ACCESS_TOKEN_KEY,
      accessToken,
      getTokenCookieOptions(accessToken, accessTokenCookieOptions),
    );

    return response;
  } catch {
    request.cookies.delete(REFRESH_TOKEN_KEY);

    const response = NextResponse.next({ request: { headers: request.headers } });
    response.cookies.delete(REFRESH_TOKEN_KEY);

    return response;
  }
}

export const config = {
  matcher: [
    // 정적 파일, 이미지 최적화, 메타데이터 파일, OAuth 콜백은 제외한다.
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|oauth/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
};
