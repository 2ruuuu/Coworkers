import type { TaskStatusSection } from '../type';

export const TASK_STATUS_SECTIONS: TaskStatusSection[] = [
  { status: 'today', label: '오늘' },
  { status: 'scheduled', label: '예정됨' },
  { status: 'done', label: '완료' },
];
