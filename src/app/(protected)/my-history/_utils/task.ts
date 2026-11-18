import type { TaskHistory } from '@/apis/user/type';
import { toServiceDate } from '@/utils/date';

/**
 * 완료한 할 일을 날짜(서비스 시간대 기준 'YYYY-MM-DD')별로 묶는다.
 * 날짜는 오래된 순, 같은 날짜 안에서는 displayIndex 순으로 정렬한다.
 */
export const groupDoneTasksByDate = (tasks: TaskHistory[]): [string, TaskHistory[]][] => {
  const groupedTasks = Object.groupBy(tasks, (task) => toServiceDate(task.date) ?? '');

  return Object.entries(groupedTasks)
    .filter((entry): entry is [string, TaskHistory[]] => Boolean(entry[0] && entry[1]))
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, items]) => [date, [...items].sort((a, b) => a.displayIndex - b.displayIndex)]);
};
