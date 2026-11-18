import { cn } from '@/utils/cn';

import MemberPreview from './MemberPreview';
import SettingsButton from './SettingsButton';
import { TEAM_CARD_BASE_CLASS } from './constants';
import type { TeamCardSize, TeamMember } from './type';

const CARD_SIZE_CLASS: Record<TeamCardSize, string> = {
  lg: 'h-16 w-280 max-w-full rounded-xl px-6',
  md: 'h-16 w-155 max-w-full rounded-xl px-6',
  sm: 'h-14 w-93.75 max-w-full rounded-none px-5',
};

interface UserTeamCardProps {
  name: string;
  members?: TeamMember[];
  memberCount?: number;
  size: TeamCardSize;
  className?: string;
  onSettingsClick?: () => void;
}

/** 팀 이름과 멤버만 보여주는 간단한 팀 카드 (일반 멤버용) */
const UserTeamCard = ({
  name,
  members,
  memberCount,
  size,
  className,
  onSettingsClick,
}: UserTeamCardProps) => (
  <section
    className={cn(
      TEAM_CARD_BASE_CLASS,
      'flex items-center justify-between',
      CARD_SIZE_CLASS[size],
      className,
    )}
  >
    <div className="flex min-w-0 items-center gap-3">
      <h2 className="text-text-primary text-md truncate font-semibold">{name}</h2>
      <MemberPreview members={members} memberCount={memberCount} />
    </div>

    {onSettingsClick && <SettingsButton onClick={onSettingsClick} />}
  </section>
);

export default UserTeamCard;
