import { notFound } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getTeamPageDataServer } from '@/apis/teamPage/server';
import { handleServerApiError } from '@/lib/auth/session';
import { ApiError } from '@/lib/error';
import { getQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/queries/queryKeys';
import { parsePositiveId } from '@/schemas/common.schema';
import { getServiceDate } from '@/utils/date';

import TeamPageClient from './_components/TeamPageClient';

interface TeamPageProps {
  params: Promise<{ teamId: string }>;
}

export default async function TeamPage({ params }: TeamPageProps) {
  const groupId = parsePositiveId((await params).teamId);

  if (!groupId) {
    notFound();
  }

  // 서버 시간대(UTC)와 상관없이 서비스 기준(서울) 오늘 날짜를 사용한다.
  const today = getServiceDate();
  const queryClient = getQueryClient();

  try {
    queryClient.setQueryData(
      queryKeys.teamPage.detail(groupId, today),
      await getTeamPageDataServer(groupId, today),
    );
  } catch (error) {
    // 존재하지 않거나 접근 권한이 없는 팀
    if (error instanceof ApiError && [403, 404].includes(error.status)) {
      notFound();
    }
    await handleServerApiError(error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeamPageClient groupId={groupId} today={today} />
    </HydrationBoundary>
  );
}
