import type { User } from '@/apis/user/type';
import SettingsIcon from '@/assets/icons/setting.svg?react';
import Profile from '@/components/profile/Profile';
import { cn } from '@/utils/cn';

import ProfileMenu from './ProfileMenu';

interface SidebarFooterProps {
  collapsed: boolean;
  user: User | undefined;
}

export default function SidebarFooter({ collapsed, user }: SidebarFooterProps) {
  if (!user) {
    return <div className="border-border-primary h-16 border-t" aria-hidden="true" />;
  }

  return (
    <div
      className={cn(
        'border-border-primary relative flex w-full items-center border-t pt-6',
        collapsed ? 'justify-center' : 'justify-between',
      )}
    >
      <div className="flex min-w-0 flex-row items-center gap-3">
        <Profile src={user.image} size="lg" alt={`${user.nickname} 프로필 이미지`} />
        {!collapsed && <span className="truncate">{user.nickname}</span>}
      </div>

      {!collapsed && (
        <ProfileMenu
          placement="top"
          trigger={<SettingsIcon className="h-6 w-6" aria-hidden="true" />}
        />
      )}
    </div>
  );
}
