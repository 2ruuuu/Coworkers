import AdminTeamCard from './AdminTeamCard';
import UserTeamCard from './UserTeamCard';
import { getProgressPercent } from './constants';
import type { TeamProps } from './type';

const Team = ({
  name,
  imageUrl,
  members,
  memberCount,
  completedTaskCount = 0,
  totalTaskCount = 0,
  progressValue,
  variant = 'admin',
  size = 'lg',
  className,
  onSettingsClick,
}: TeamProps) => {
  if (variant === 'user') {
    return (
      <UserTeamCard
        name={name}
        members={members}
        memberCount={memberCount}
        size={size}
        className={className}
        onSettingsClick={onSettingsClick}
      />
    );
  }

  return (
    <AdminTeamCard
      name={name}
      imageUrl={imageUrl}
      members={members}
      memberCount={memberCount}
      completedTaskCount={completedTaskCount}
      totalTaskCount={totalTaskCount}
      progressPercent={getProgressPercent(completedTaskCount, totalTaskCount, progressValue)}
      size={size}
      className={className}
      onSettingsClick={onSettingsClick}
    />
  );
};

export default Team;
