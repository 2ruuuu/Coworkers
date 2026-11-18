import 'server-only';

import { ENDPOINTS } from '@/apis/endpoints';
import type {
  RequestCreateTaskRecurring,
  RequestUpdateTaskRecurring,
  ResponseTaskRecurring,
} from '@/apis/recurring/type';
import { serverFetcher } from '@/lib/serverFetcher';

import type { Task, TaskDetailPathParams, TaskListPathParams } from './type';

export const getTasksServer = async ({
  groupId,
  taskListId,
  date,
}: TaskListPathParams & { date?: string }) => {
  return serverFetcher<Task[]>(ENDPOINTS.task.list(groupId, taskListId, date));
};

export const getTaskServer = async ({ groupId, taskListId, taskId }: TaskDetailPathParams) => {
  return serverFetcher<Task>(ENDPOINTS.task.detail(groupId, taskListId, taskId));
};

export const createRecurringTaskServer = async (
  { groupId, taskListId }: TaskListPathParams,
  body: RequestCreateTaskRecurring,
) => {
  return serverFetcher<ResponseTaskRecurring>(ENDPOINTS.task.recurring(groupId, taskListId), {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const updateRecurringTaskServer = async (
  { groupId, taskListId, recurringId }: TaskListPathParams & { recurringId: number },
  body: RequestUpdateTaskRecurring,
) => {
  return serverFetcher<ResponseTaskRecurring>(
    ENDPOINTS.task.recurringDetail(groupId, taskListId, recurringId),
    { method: 'PATCH', body: JSON.stringify(body) },
  );
};

export const updateTaskServer = async (
  { groupId, taskListId, taskId }: TaskDetailPathParams,
  body: { name?: string; description?: string; done?: boolean },
) => {
  return serverFetcher<Task>(ENDPOINTS.task.detail(groupId, taskListId, taskId), {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

export const deleteTaskServer = async ({ groupId, taskListId, taskId }: TaskDetailPathParams) => {
  return serverFetcher<void>(ENDPOINTS.task.detail(groupId, taskListId, taskId), {
    method: 'DELETE',
  });
};
