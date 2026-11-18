import { describe, expect, it } from 'vitest';

import type { TaskHistory } from '@/apis/user/type';

import { groupDoneTasksByDate } from './task';

const createHistory = (id: number, date: string, displayIndex = 0) =>
  ({ id, date, displayIndex, name: `task-${id}` }) as TaskHistory;

describe('groupDoneTasksByDate', () => {
  it('날짜를 오래된 순으로 정렬해 묶는다', () => {
    const result = groupDoneTasksByDate([
      createHistory(1, '2026-06-03'),
      createHistory(2, '2026-06-01'),
      createHistory(3, '2026-06-02'),
    ]);

    expect(result.map(([date]) => date)).toEqual(['2026-06-01', '2026-06-02', '2026-06-03']);
  });

  it('같은 날짜 안에서는 displayIndex 순으로 정렬한다', () => {
    const [[, items]] = groupDoneTasksByDate([
      createHistory(1, '2026-06-01', 2),
      createHistory(2, '2026-06-01', 0),
    ]);

    expect(items.map((task) => task.id)).toEqual([2, 1]);
  });

  it('시각이 포함된 날짜는 서울 기준 날짜로 묶는다', () => {
    const [[date]] = groupDoneTasksByDate([createHistory(1, '2026-06-01T16:00:00.000Z')]);
    expect(date).toBe('2026-06-02');
  });
});
