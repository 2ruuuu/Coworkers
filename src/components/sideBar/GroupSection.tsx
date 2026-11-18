'use client';

import { usePathname } from 'next/navigation';

import { ROUTES, isActivePath } from '@/constants/routes';
import { cn } from '@/utils/cn';

import GroupItem from './GroupItem';
import type { SidebarGroup } from './type';

interface GroupSectionProps {
  groups: SidebarGroup[];
  collapsed: boolean;
}

export default function GroupSection({ groups, collapsed }: GroupSectionProps) {
  const pathname = usePathname() ?? '';

  return (
    <ul
      aria-label="내 팀 목록"
      className={cn('flex flex-col gap-2 md:gap-4', collapsed ? 'items-center' : 'items-stretch')}
    >
      {groups.map((group) => (
        <li key={group.id}>
          <GroupItem
            {...group}
            selected={isActivePath(pathname, ROUTES.team(group.id))}
            collapsed={collapsed}
          />
        </li>
      ))}
    </ul>
  );
}
