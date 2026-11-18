import KebabIcon from '@/assets/icons/kebab.svg?react';
import Dropdown from '@/components/dropdown/Dropdown';
import type { DropdownOption } from '@/components/dropdown/type';
import Profile from '@/components/profile/Profile';

import type { TeamPageMember } from '../../type';

const MEMBER_MENU_OPTIONS: DropdownOption<'REMOVE'>[] = [
  { value: 'REMOVE', label: '멤버 내보내기' },
];

interface MemberItemProps {
  member: TeamPageMember;
  canManage: boolean;
  onRemove: (member: TeamPageMember) => void;
}

const MemberItem = ({ member, canManage, onRemove }: MemberItemProps) => {
  const isAdmin = member.role === 'ADMIN';
  const canRemove = canManage && !isAdmin;

  return (
    <li className="flex min-w-0 items-center gap-3">
      <Profile src={member.imageUrl} size="md" alt={`${member.name} 프로필`} />

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="text-text-primary truncate text-sm font-semibold">{member.name}</p>
          {isAdmin && (
            <span className="bg-brand-secondary text-brand-primary shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold">
              관리자
            </span>
          )}
        </div>
        <p className="text-text-default truncate text-xs">{member.email}</p>
      </div>

      {canRemove && (
        <Dropdown
          options={MEMBER_MENU_OPTIONS}
          size="sm"
          onSelect={() => onRemove(member)}
          trigger={<KebabIcon className="size-4" aria-hidden="true" />}
          triggerLabel={`${member.name} 멤버 메뉴 열기`}
          triggerClassName="text-icon-primary hover:bg-background-secondary hover:text-brand-primary size-6 rounded transition-colors active:scale-95"
          className="shrink-0"
        />
      )}
    </li>
  );
};

export default MemberItem;
