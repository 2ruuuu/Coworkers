import Profile from '@/components/profile/Profile';
import { cn } from '@/utils/cn';

import type { TeamMember } from './type';

const MAX_VISIBLE_MEMBERS = 3;

interface MemberPreviewProps {
  members?: TeamMember[];
  memberCount?: number;
}

/** 멤버 아바타 최대 3개와 전체 인원 수 */
const MemberPreview = ({ members = [], memberCount }: MemberPreviewProps) => {
  const visibleMembers = members.slice(0, MAX_VISIBLE_MEMBERS);
  const totalMemberCount = memberCount ?? members.length;

  if (totalMemberCount <= 0) {
    return null;
  }

  return (
    <div className="border-border-primary bg-background-inverse/90 shadow-background-primary/5 hover:border-brand-primary/20 hover:bg-background-inverse flex h-8 shrink-0 items-center rounded-lg border px-2 shadow-sm transition-colors duration-200">
      <span className="sr-only">팀 멤버 {totalMemberCount}명</span>

      {visibleMembers.map((member) => (
        <div key={member.id} className="-ml-1 first:ml-0" aria-hidden="true">
          <Profile
            src={member.imageUrl}
            size="sm"
            alt=""
            className="border-background-inverse size-5 rounded-full border"
          />
        </div>
      ))}

      <span
        className={cn(
          'border-background-inverse bg-background-inverse text-text-default flex h-5 min-w-5 items-center justify-center rounded-full border px-1 text-[10px] font-medium',
          visibleMembers.length > 0 && 'ml-1',
        )}
        aria-hidden="true"
      >
        {totalMemberCount}
      </span>
    </div>
  );
};

export default MemberPreview;
