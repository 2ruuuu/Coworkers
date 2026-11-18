import type { ReactNode } from 'react';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getMyGroupsServer, getMyProfileServer } from '@/apis/user/server';
import { handleServerApiError, redirectToLogin } from '@/lib/auth/session';
import { getQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/queries/queryKeys';
import { hasAuthSession } from '@/utils/auth/token';

import AppShell from './_components/AppShell';

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  if (!(await hasAuthSession())) {
    await redirectToLogin();
  }

  // 사이드바에 필요한 사용자/팀 목록을 서버에서 미리 불러와 클라이언트 캐시에 채운다.
  const queryClient = getQueryClient();
  const [profile, groups] = await Promise.all([getMyProfileServer(), getMyGroupsServer()]).catch(
    handleServerApiError,
  );

  queryClient.setQueryData(queryKeys.user.me(), profile);
  queryClient.setQueryData(queryKeys.user.groups(), groups);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppShell>{children}</AppShell>
    </HydrationBoundary>
  );
};

export default ProtectedLayout;
