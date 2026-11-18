'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import BoardIcon from '@/assets/icons/board.svg?react';
import { ROUTES, isActivePath } from '@/constants/routes';
import { cn } from '@/utils/cn';

export default function ArticleMenu({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname() ?? '';
  const isActive = isActivePath(pathname, ROUTES.ARTICLES);

  return (
    <Link
      href={ROUTES.ARTICLES}
      aria-current={isActive ? 'page' : undefined}
      aria-label={collapsed ? '자유게시판' : undefined}
      className={cn(
        'focus-visible:ring-brand-primary mt-2 flex items-center gap-2 rounded-xl outline-none focus-visible:ring-2',
        collapsed ? 'h-10 w-10 justify-center' : 'h-14 w-full px-4',
        isActive ? 'text-brand-primary bg-brand-secondary' : 'hover:bg-background-secondary',
      )}
    >
      <BoardIcon
        className={cn('h-5 w-5', isActive ? 'text-brand-primary' : 'text-icon-primary')}
        aria-hidden="true"
      />
      {!collapsed && <span>자유게시판</span>}
    </Link>
  );
}
