import ProgressBar from '@/components/progressBar/ProgressBar';
import TeamAvatar from '@/components/teamAvatar/TeamAvatar';
import { cn } from '@/utils/cn';

import MemberPreview from './MemberPreview';
import SettingsButton from './SettingsButton';
import { TEAM_CARD_BASE_CLASS, TEAM_LABELS } from './constants';
import type { TeamCardSize, TeamMember } from './type';

const CARD_SIZE_CLASS: Record<TeamCardSize, string> = {
  lg: 'w-280 max-w-full min-h-59.75 gap-6 rounded-[20px] p-8',
  md: 'w-155 max-w-full min-h-59.75 gap-6 rounded-[20px] p-6',
  sm: 'w-93.75 max-w-full min-h-49 gap-4 rounded-none p-6',
};

const IMAGE_SIZE_CLASS: Record<TeamCardSize, string> = {
  lg: 'size-9',
  md: 'size-8',
  sm: 'size-6',
};

interface AdminTeamCardProps {
  name: string;
  imageUrl?: string | null;
  members?: TeamMember[];
  memberCount?: number;
  completedTaskCount: number;
  totalTaskCount: number;
  progressPercent: number;
  size: TeamCardSize;
  className?: string;
  onSettingsClick?: () => void;
}

/** 진행률/오늘의 할 일 통계를 보여주는 큰 팀 카드 */
const AdminTeamCard = ({
  name,
  imageUrl,
  members,
  memberCount,
  completedTaskCount,
  totalTaskCount,
  progressPercent,
  size,
  className,
  onSettingsClick,
}: AdminTeamCardProps) => (
  <section className={cn(TEAM_CARD_BASE_CLASS, 'flex flex-col', CARD_SIZE_CLASS[size], className)}>
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <TeamAvatar
          name={name}
          image={imageUrl}
          sizes="36px"
          className={cn('ring-background-primary/70 rounded-md ring-1', IMAGE_SIZE_CLASS[size])}
        />
        <h2 className="text-text-primary text-md truncate font-semibold">{name}</h2>
        {size !== 'lg' && <MemberPreview members={members} memberCount={memberCount} />}
      </div>

      {onSettingsClick && <SettingsButton onClick={onSettingsClick} />}
    </div>

    <dl className="grid grid-cols-[1fr_auto_auto] items-end gap-4">
      <div>
        <dt className="text-text-disabled text-xs font-medium">{TEAM_LABELS.progress}</dt>
        <dd className="text-brand-primary mt-1 text-2xl font-semibold">{progressPercent}%</dd>
      </div>

      <div className="text-right">
        <dt className="text-text-disabled text-xs font-medium">{TEAM_LABELS.totalTask}</dt>
        <dd className="text-text-default mt-1 text-2xl font-semibold">{totalTaskCount}</dd>
      </div>

      <div className="text-right">
        <dt className="text-text-disabled text-xs font-medium">{TEAM_LABELS.completedTask}</dt>
        <dd className="text-brand-primary mt-1 text-2xl font-semibold">{completedTaskCount}</dd>
      </div>
    </dl>

    <ProgressBar value={progressPercent} size={size} label={`${name} ${TEAM_LABELS.progress}`} />
  </section>
);

export default AdminTeamCard;
