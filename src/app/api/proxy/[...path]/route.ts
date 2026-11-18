import { type NextRequest, NextResponse } from 'next/server';

import { ApiError } from '@/lib/error';
import { serverFetcher } from '@/lib/serverFetcher';

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

const isSafeSegment = (segment: string) => segment !== '..' && segment !== '.' && segment !== '';

/**
 * 인증이 필요한 GET 요청을 백엔드로 전달하는 BFF 라우트. (읽기 전용)
 * 경로는 항상 백엔드 API 기본 URL 아래로만 조합되므로 외부 호스트로 토큰이 나가지 않는다.
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;

  if (!path.every(isSafeSegment)) {
    return NextResponse.json({ message: '잘못된 요청 경로입니다.' }, { status: 400 });
  }

  const apiPath = `/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`;

  try {
    const data = await serverFetcher<unknown>(apiPath);
    return NextResponse.json(data ?? null);
  } catch (error) {
    if (error instanceof ApiError) {
      return new NextResponse(error.body, {
        status: error.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json({ message: '요청을 처리하지 못했어요.' }, { status: 500 });
  }
}
