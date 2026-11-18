'use client';

import { useQuery } from '@tanstack/react-query';

import Sidebar from '@/components/sidebar/Sidebar';
import { userQueries } from '@/queries/user/queries';

/** 로그인한 사용자 화면의 공통 레이아웃 (사이드바 + 본문) */
export default function AppShell({ children }: { children: React.ReactNode }) {
  // 서버 레이아웃에서 미리 채운 캐시를 사용하므로 첫 렌더부터 데이터가 있다.
  const { data: groups = [] } = useQuery(userQueries.groups());
  const { data: user } = useQuery(userQueries.me());

  return (
    <div className="bg-background-secondary flex min-h-screen">
      <Sidebar groups={groups} user={user} />
      <main className="min-w-0 flex-1 pt-16 md:pt-0">{children}</main>
    </div>
  );
}
