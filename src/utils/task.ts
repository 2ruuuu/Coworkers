import type { Task } from '@/apis/task/type';
import type { BadgeStatus } from '@/components/badgeDone/type';
import { toServiceDate } from '@/utils/date';

type TaskStatusSource = Pick<Task, 'date' | 'doneAt' | 'doneBy' | 'startDate'>;

/** 할 일 완료 여부. 화면마다 판정이 달라지지 않도록 이 함수만 사용한다. */
export const isTaskDone = (task: Pick<Task, 'doneAt' | 'doneBy'>) =>
  Boolean(task.doneAt || task.doneBy?.user);

/** 할 일의 날짜(서비스 시간대 기준 'YYYY-MM-DD'). date가 없으면 startDate를 사용한다. */
export const getTaskDate = (task: TaskStatusSource) => toServiceDate(task.date ?? task.startDate);

/** 완료 개수로 목록 배지 상태를 계산한다. 할 일이 없으면 'none'. */
export const getBadgeStatus = (doneCount: number, totalCount: number): BadgeStatus => {
  if (totalCount === 0) return 'none';
  return doneCount === totalCount ? 'done' : 'progress';
};
