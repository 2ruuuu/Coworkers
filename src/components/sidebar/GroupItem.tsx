import Link from 'next/link';

import TeamAvatar from '@/components/teamAvatar/TeamAvatar';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

import type { SidebarGroup } from './type';

interface GroupItemProps extends SidebarGroup {
  collapsed: boolean;
  selected: boolean;
}

const GroupItem = ({ id, name, image, collapsed, selected }: GroupItemProps) => {
  return (
    <Link
      href={ROUTES.team(id)}
      aria-current={selected ? 'page' : undefined}
      // 접힌 상태에서는 팀 이름이 보이지 않으므로 링크 이름을 명시한다.
      aria-label={collapsed ? name : undefined}
      className={cn(
        'focus-visible:ring-brand-primary flex items-center overflow-hidden rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 active:scale-[0.98]',
        collapsed ? 'h-10 w-10' : 'h-14 w-full gap-2 px-4',
        selected && collapsed && 'border-brand-primary border-2',
        selected && !collapsed && 'text-brand-primary bg-brand-secondary',
        !selected && 'hover:bg-background-secondary hover:text-brand-primary',
      )}
    >
      <TeamAvatar
        name={name}
        image={image}
        sizes={collapsed ? '40px' : '28px'}
        className={cn('rounded-md', collapsed ? 'h-10 w-10' : 'h-7 w-7')}
      />
      {!collapsed && <span className="truncate">{name}</span>}
    </Link>
  );
};

export default GroupItem;
