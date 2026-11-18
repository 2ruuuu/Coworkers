import 'server-only';

import { ENDPOINTS } from '@/apis/endpoints';
import { serverFetcher } from '@/lib/serverFetcher';

import type { TaskList, TaskListSummary } from './type';

export const getTaskListServer = async (groupId: number, taskListId: number, date?: string) => {
  return serverFetcher<TaskList>(ENDPOINTS.taskList.detail(groupId, taskListId, date));
};

export const createTaskListServer = async (groupId: number, name: string) => {
  return serverFetcher<TaskListSummary>(ENDPOINTS.taskList.root(groupId), {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
};

export const updateTaskListNameServer = async (
  groupId: number,
  taskListId: number,
  name: string,
) => {
  return serverFetcher<TaskListSummary>(ENDPOINTS.taskList.detail(groupId, taskListId), {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
};

export const deleteTaskListServer = async (groupId: number, taskListId: number) => {
  return serverFetcher<void>(ENDPOINTS.taskList.detail(groupId, taskListId), {
    method: 'DELETE',
  });
};
