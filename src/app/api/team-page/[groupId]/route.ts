import { type NextRequest, NextResponse } from 'next/server';

import { getTeamPageDataServer } from '@/apis/teamPage/server';
import { ApiError, getErrorMessage } from '@/lib/error';
import { isoDateSchema, parsePositiveId } from '@/schemas/common.schema';

interface RouteContext {
  params: Promise<{ groupId: string }>;
}

/** 팀 페이지 데이터(여러 API를 조합)를 클라이언트 재조회용으로 제공한다. */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const groupId = parsePositiveId((await params).groupId);
  const date = isoDateSchema.safeParse(request.nextUrl.searchParams.get('date'));

  if (!groupId || !date.success) {
    return NextResponse.json({ message: '잘못된 요청입니다.' }, { status: 400 });
  }

  try {
    return NextResponse.json(await getTeamPageDataServer(groupId, date.data));
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    return NextResponse.json(
      { message: getErrorMessage(error, '팀 페이지 정보를 불러오지 못했습니다.') },
      { status },
    );
  }
}
