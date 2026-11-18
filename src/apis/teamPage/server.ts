import 'server-only';

import { getGroupServer, getGroupTasksServer } from '@/apis/group/server';
import type { Task } from '@/apis/task/type';
import { getTaskListServer } from '@/apis/taskList/server';
import type { TaskList } from '@/apis/taskList/type';
import { mapWithConcurrency } from '@/utils/async';
import { addDaysToISODate } from '@/utils/date';

import type { TeamPageData } from './type';

/** 오늘 기준 앞뒤로 조회할 날짜 수 (지난 미완료 할 일과 예정된 할 일을 찾기 위함) */
const TASK_LOOKAROUND_DAYS = 7;
/** 백엔드로 동시에 보내는 요청 수 상한 */
const MAX_CONCURRENT_REQUESTS = 6;

const mergeTasksById = (...taskGroups: Task[][]) => {
  return Array.from(new Map(taskGroups.flat().map((task) => [task.id, task])).values());
};

const getLookaroundDates = (today: string) =>
  Array.from({ length: TASK_LOOKAROUND_DAYS * 2 + 1 }, (_, index) => index - TASK_LOOKAROUND_DAYS)
    .filter((offset) => offset !== 0)
    .map((offset) => addDaysToISODate(today, offset));

/**
 * API가 날짜별 조회만 지원하고, 그룹 할 일 응답에는 목록 ID가 없다.
 * 1) 날짜별 그룹 할 일로 할 일이 있는 날짜를 좁힌다.
 * 2) 반복 일정(recurringId)이 어느 목록에 속하는지 이미 알면 추가 요청 없이 해당 목록에 넣는다.
 * 3) 모르는 할 일이 있는 날짜만 목록 상세를 조회한다.
 */
const addRelatedTasksToTaskLists = async (
  groupId: number,
  taskLists: TaskList[],
  today: string,
): Promise<TaskList[]> => {
  const dates = getLookaroundDates(today);
  const tasksByDate = await mapWithConcurrency(dates, MAX_CONCURRENT_REQUESTS, async (date) => ({
    date,
    tasks: await getGroupTasksServer(groupId, date),
  }));

  const recurringIdToTaskListId = new Map<number, number>();
  const tasksByTaskListId = new Map<number, Task[]>(
    taskLists.map((taskList) => [taskList.id, taskList.tasks ?? []]),
  );

  const rememberTaskListTasks = (taskListId: number, tasks: Task[]) => {
    tasks.forEach((task) => {
      if (task.recurringId != null) recurringIdToTaskListId.set(task.recurringId, taskListId);
    });
    tasksByTaskListId.set(
      taskListId,
      mergeTasksById(tasksByTaskListId.get(taskListId) ?? [], tasks),
    );
  };

  taskLists.forEach((taskList) => rememberTaskListTasks(taskList.id, taskList.tasks ?? []));

  const datesNeedingLookup: string[] = [];

  tasksByDate.forEach(({ date, tasks }) => {
    tasks.forEach((task) => {
      const taskListId =
        task.recurringId != null ? recurringIdToTaskListId.get(task.recurringId) : undefined;

      if (taskListId === undefined) {
        if (!datesNeedingLookup.includes(date)) datesNeedingLookup.push(date);
        return;
      }

      rememberTaskListTasks(taskListId, [task]);
    });
  });

  const lookupRequests = datesNeedingLookup.flatMap((date) =>
    taskLists.map((taskList) => ({ date, taskListId: taskList.id })),
  );
  const fetchedTaskLists = await mapWithConcurrency(
    lookupRequests,
    MAX_CONCURRENT_REQUESTS,
    ({ date, taskListId }) => getTaskListServer(groupId, taskListId, date),
  );

  fetchedTaskLists.forEach((taskList) => rememberTaskListTasks(taskList.id, taskList.tasks ?? []));

  return taskLists.map((taskList) => ({
    ...taskList,
    tasks: tasksByTaskListId.get(taskList.id) ?? [],
  }));
};

export const getTeamPageDataServer = async (
  groupId: number,
  today: string,
): Promise<TeamPageData> => {
  const [group, todayTasks] = await Promise.all([
    getGroupServer(groupId),
    getGroupTasksServer(groupId, today),
  ]);
  const taskLists = await addRelatedTasksToTaskLists(groupId, group.taskLists, today);

  return {
    group: { ...group, taskLists },
    todayTasks,
  };
};
