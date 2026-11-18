import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { GroupDetail } from '@/apis/group/type';
import type { Task } from '@/apis/task/type';
import type { TaskList } from '@/apis/taskList/type';
import { serverFetcher } from '@/lib/serverFetcher';

import { getTeamPageDataServer } from './server';

vi.mock('@/lib/serverFetcher', () => ({
  serverFetcher: vi.fn(),
}));

const createTaskList = (id: number, tasks: Task[] = []): TaskList => ({
  id,
  name: `Task list ${id}`,
  createdAt: '2026-06-22T00:00:00.000Z',
  updatedAt: '2026-06-22T00:00:00.000Z',
  groupId: 1,
  displayIndex: id,
  tasks,
});

const createTask = (overrides: Partial<Task>): Task =>
  ({
    doneAt: null,
    doneBy: null,
    ...overrides,
  }) as Task;

describe('getTeamPageDataServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('목록을 알 수 없는 할 일이 있는 날짜만 목록 상세를 조회해 합친다', async () => {
    const overdueTask = createTask({ id: 9, recurringId: 900, date: '2026-06-21' });
    const futureTask = createTask({ id: 10, recurringId: 1000, date: '2026-06-26' });
    const group = {
      id: 1,
      name: 'Test team',
      taskLists: [createTaskList(11), createTaskList(12)],
    } as GroupDetail;

    vi.mocked(serverFetcher).mockImplementation(async (path) => {
      if (path === '/groups/1') return group as never;
      if (path === '/groups/1/tasks?date=2026-06-21') return [overdueTask] as never;
      if (path === '/groups/1/tasks?date=2026-06-26') return [futureTask] as never;
      if (path.startsWith('/groups/1/tasks?date=')) return [] as never;
      if (path === '/groups/1/task-lists/11?date=2026-06-21') {
        return createTaskList(11, [overdueTask]) as never;
      }
      if (path === '/groups/1/task-lists/11?date=2026-06-26') {
        return createTaskList(11, [futureTask]) as never;
      }
      if (path.startsWith('/groups/1/task-lists/12?date=')) return createTaskList(12) as never;

      throw new Error(`Unexpected request: ${path}`);
    });

    const result = await getTeamPageDataServer(1, '2026-06-22');

    expect(result.group.taskLists[0]?.tasks).toEqual([overdueTask, futureTask]);
    expect(result.group.taskLists[1]?.tasks).toEqual([]);
    expect(serverFetcher).toHaveBeenCalledWith('/groups/1/task-lists/11?date=2026-06-21');
    expect(serverFetcher).toHaveBeenCalledWith('/groups/1/task-lists/12?date=2026-06-26');
  });

  it('반복 일정의 목록을 이미 알면 목록 상세를 추가로 조회하지 않는다', async () => {
    const todayTask = createTask({ id: 1, recurringId: 77, date: '2026-06-22' });
    const tomorrowTask = createTask({ id: 2, recurringId: 77, date: '2026-06-23' });
    const group = {
      id: 1,
      name: 'Test team',
      taskLists: [createTaskList(11, [todayTask]), createTaskList(12)],
    } as GroupDetail;

    vi.mocked(serverFetcher).mockImplementation(async (path) => {
      if (path === '/groups/1') return group as never;
      if (path === '/groups/1/tasks?date=2026-06-22') return [todayTask] as never;
      if (path === '/groups/1/tasks?date=2026-06-23') return [tomorrowTask] as never;
      if (path.startsWith('/groups/1/tasks?date=')) return [] as never;

      throw new Error(`Unexpected request: ${path}`);
    });

    const result = await getTeamPageDataServer(1, '2026-06-22');

    expect(result.group.taskLists[0]?.tasks).toEqual([todayTask, tomorrowTask]);
    expect(result.todayTasks).toEqual([todayTask]);
    expect(
      vi.mocked(serverFetcher).mock.calls.some(([path]) => path.includes('/task-lists/')),
    ).toBe(false);
  });
});
