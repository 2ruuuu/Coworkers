import SettingsIcon from '@/assets/icons/setting.svg?react';
import Dropdown from '@/components/dropdown/Dropdown';
import type { DropdownOption } from '@/components/dropdown/type';
import Team from '@/components/team/Team';
import type { TeamCardSize, TeamMember } from '@/components/team/type';
import { cn } from '@/utils/cn';

import type { TeamPageRole } from '../../type';

type TeamMenuValue = 'EDIT' | 'DELETE';

const TEAM_MENU_OPTIONS: DropdownOption<TeamMenuValue>[] = [
  { label: '수정하기', value: 'EDIT' },
  { label: '삭제하기', value: 'DELETE' },
];

interface TeamPageHeaderProps {
  name: string;
  imageUrl: string | null;
  role: TeamPageRole;
  size: TeamCardSize;
  members: TeamMember[];
  completedTaskCount: number;
  totalTaskCount: number;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const TeamPageHeader = ({
  name,
  imageUrl,
  role,
  size,
  members,
  completedTaskCount,
  totalTaskCount,
  onEditClick,
  onDeleteClick,
}: TeamPageHeaderProps) => {
  const isAdmin = role === 'ADMIN';
  const isAdminLayout = isAdmin || size === 'lg';

  const handleMenuSelect = (value: TeamMenuValue) => {
    if (value === 'EDIT') onEditClick();
    else onDeleteClick();
  };

  return (
    <div className="relative">
      <Team
        name={name}
        imageUrl={imageUrl}
        members={members}
        memberCount={members.length}
        completedTaskCount={completedTaskCount}
        totalTaskCount={totalTaskCount}
        variant={isAdminLayout ? 'admin' : 'user'}
        size={size}
        className={cn(
          'w-full',
          isAdminLayout
            ? 'min-h-37.75 gap-4 rounded-xl p-5 md:min-h-37.75 xl:min-h-59.75 xl:gap-6 xl:rounded-[20px] xl:p-8 xl:[&_[role=progressbar]]:w-[calc(100%-32px)]'
            : 'h-14 rounded-xl px-4 md:h-16 xl:h-16 xl:px-6',
        )}
      />

      {isAdmin && (
        <Dropdown
          options={TEAM_MENU_OPTIONS}
          onSelect={handleMenuSelect}
          trigger={<SettingsIcon className="size-6" aria-hidden="true" />}
          triggerLabel="팀 설정"
          triggerClassName="hover:bg-background-secondary hover:text-brand-primary text-icon-primary size-7 transition-all duration-200 active:scale-95"
          className="absolute top-5 right-5 z-10 xl:top-auto xl:right-6 xl:bottom-12.5"
        />
      )}
    </div>
  );
};

export default TeamPageHeader;
