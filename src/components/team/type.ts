export type TeamCardSize = 'sm' | 'md' | 'lg';
export type TeamVariant = 'admin' | 'user';

export interface TeamMember {
  id: number | string;
  name: string;
  imageUrl?: string | null;
}

export interface TeamProps {
  name: string;
  imageUrl?: string | null;
  members?: TeamMember[];
  memberCount?: number;
  completedTaskCount?: number;
  totalTaskCount?: number;
  progressValue?: number;
  variant?: TeamVariant;
  size?: TeamCardSize;
  className?: string;
  /** 넘기면 카드 안에 설정 버튼을 보여준다. */
  onSettingsClick?: () => void;
}
