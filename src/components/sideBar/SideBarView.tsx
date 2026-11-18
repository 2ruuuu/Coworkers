import Link from 'next/link';

import FoldLeftIcon from '@/assets/icons/fold_left.svg?react';
import FoldRightIcon from '@/assets/icons/fold_right.svg?react';
import LogoLarge from '@/assets/icons/logo_large.svg?react';
import LogoSmall from '@/assets/icons/logo_small.svg?react';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

import AddGroupButton from './AddGroupButton';
import ArticleMenu from './ArticleMenu';
import GroupSection from './GroupSection';
import SidebarFooter from './SidebarFooter';
import type { SidebarProps } from './type';

interface SidebarViewProps extends SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

/** 태블릿/데스크톱용 사이드바 */
export default function SidebarView({
  collapsed,
  groups,
  user,
  onToggleCollapse,
}: SidebarViewProps) {
  const logoHref = groups.length > 0 ? ROUTES.team(groups[0].id) : ROUTES.HOME;

  return (
    <aside
      aria-label="사이드바"
      className={cn(
        'bg-background-primary border-border-primary sticky top-0 z-30 flex h-screen shrink-0 flex-col overflow-visible border-r py-6 transition-[width] duration-300',
        collapsed ? 'w-18 justify-center px-2' : 'w-68 px-4',
      )}
    >
      <div className="flex h-full flex-col">
        <Link
          href={logoHref}
          aria-label="Coworkers 홈으로 이동"
          className={cn(
            'flex h-8 w-full items-center',
            collapsed ? 'justify-center' : 'justify-start',
          )}
        >
          {collapsed ? (
            <LogoSmall className="block h-8 w-8 shrink-0" aria-hidden="true" />
          ) : (
            <LogoLarge className="block w-36 shrink-0" aria-hidden="true" />
          )}
        </Link>

        <button
          type="button"
          className={cn(
            'focus-visible:ring-brand-primary absolute top-6 z-40 flex items-center justify-center transition-transform outline-none focus-visible:ring-2 active:scale-95',
            collapsed
              ? 'border-brand-secondary bg-background-inverse -right-4 h-8 w-8 rounded-full border pl-1'
              : 'right-4 h-6 w-6',
          )}
          aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
          aria-expanded={!collapsed}
          onClick={onToggleCollapse}
        >
          {collapsed ? (
            <FoldRightIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <FoldLeftIcon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>

        <nav aria-label="주요 메뉴" className="flex w-full flex-1 flex-col gap-2 pt-6">
          <div className={cn('flex w-full flex-col', collapsed ? 'items-center' : 'items-stretch')}>
            <div className={cn('border-border-primary border-b pb-2', !collapsed && 'w-full')}>
              <GroupSection collapsed={collapsed} groups={groups} />
              {!collapsed && <AddGroupButton />}
            </div>
            <ArticleMenu collapsed={collapsed} />
          </div>
        </nav>

        <SidebarFooter collapsed={collapsed} user={user} />
      </div>
    </aside>
  );
}
