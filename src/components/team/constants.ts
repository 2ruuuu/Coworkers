export const TEAM_LABELS = {
  progress: '오늘의 진행 상황',
  totalTask: '오늘의 할 일',
  completedTask: '완료',
  settings: '팀 설정',
} as const;

export const TEAM_CARD_BASE_CLASS =
  'bg-background-inverse shadow-xl shadow-background-primary/10 ring-1 ring-border-primary/40 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-brand-primary/10 hover:ring-brand-primary/20';

/** 진행률(0~100). progressValue가 있으면 우선 사용하고, 없으면 완료/전체로 계산한다. */
export const getProgressPercent = (
  completedTaskCount: number,
  totalTaskCount: number,
  progressValue?: number,
) => {
  const percent =
    typeof progressValue === 'number'
      ? progressValue
      : totalTaskCount > 0
        ? Math.round((completedTaskCount / totalTaskCount) * 100)
        : 0;

  return Math.min(Math.max(percent, 0), 100);
};
