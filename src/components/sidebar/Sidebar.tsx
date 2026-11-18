'use client';

import { useId, useState } from 'react';

import { usePathname } from 'next/navigation';

import useMediaQuery, { MEDIA_QUERY } from '@/hooks/useMediaQuery';

import MobileHeader from './MobileHeader';
import MobileSidebar from './MobileSidebar';
import SidebarView from './SidebarView';
import type { SidebarProps } from './type';

/** 사용자가 직접 접거나 편 상태. 다른 페이지로 이동하면 기본값으로 돌아간다. */
interface ToggleState {
  pathname: string;
  value: boolean;
}

const useRouteScopedToggle = (pathname: string) => {
  const [state, setState] = useState<ToggleState | null>(null);
  const value = state?.pathname === pathname ? state.value : undefined;
  const set = (next: boolean) => setState({ pathname, value: next });

  return [value, set] as const;
};

/**
 * 반응형 사이드바.
 * - 모바일(md 미만): 상단 헤더 + 드로어
 * - 태블릿: 접힌 상태가 기본, 데스크톱: 펼친 상태가 기본
 * 서버에서도 렌더되어 하이드레이션 전 레이아웃이 비지 않는다.
 */
export default function Sidebar({ groups, user }: SidebarProps) {
  const pathname = usePathname() ?? '';
  const isDesktop = useMediaQuery(MEDIA_QUERY.desktop);
  const mobileMenuId = useId();

  const [collapsedOverride, setCollapsed] = useRouteScopedToggle(pathname);
  const [mobileOpen, setMobileOpen] = useRouteScopedToggle(pathname);

  const collapsed = collapsedOverride ?? !isDesktop;
  const isMobileMenuOpen = mobileOpen ?? false;

  return (
    <>
      <div className="hidden md:block">
        <SidebarView
          collapsed={collapsed}
          groups={groups}
          user={user}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      <MobileHeader
        groups={groups}
        user={user}
        isMenuOpen={isMobileMenuOpen}
        menuId={mobileMenuId}
        onOpenMenu={() => setMobileOpen(true)}
      />
      <MobileSidebar
        id={mobileMenuId}
        isOpen={isMobileMenuOpen}
        groups={groups}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
