import { type QueryClient, queryOptions, useQueryClient } from '@tanstack/react-query';

import {
  createTaskAction,
  deleteTaskAction,
  updateRecurringTaskAction,
  updateTaskAction,
} from '@/actions/task.action';
import { ENDPOINTS } from '@/apis/endpoints';
import type { Task, TaskDetailPathParams, TaskListPathParams } from '@/apis/task/type';
import { bffGet } from '@/lib/bffFetcher';
import { queryKeys } from '@/queries/queryKeys';
import { useActionMutation } from '@/queries/useActionMutation';

export const taskQueries = {
  list: ({ groupId, taskListId, date }: TaskListPathParams & { date: string }) =>
    queryOptions({
      queryKey: queryKeys.task.list(groupId, taskListId, date),
      queryFn: () => bffGet<Task[]>(ENDPOINTS.task.list(groupId, taskListId, date)),
    }),
  detail: ({ groupId, taskListId, taskId }: TaskDetailPathParams) =>
    queryOptions({
      queryKey: queryKeys.task.detail(taskId),
      queryFn: () => bffGet<Task>(ENDPOINTS.task.detail(groupId, taskListId, taskId)),
    }),
};

/**
 * 할 일이 바뀌면 목록의 할 일, 상세, 그룹 상세, 팀 페이지를 갱신한다.
 *
 * 할 일 목록을 먼저 다시 받은 뒤 나머지를 갱신한다.
 * 백엔드는 반복 일정의 그날 할 일을 조회 시점에 만들어 두는데, 할 일 목록과 그룹 상세를
 * 동시에 조회하면 같은 할 일이 두 개 생기는 경쟁 상태가 있다. 그러면 목록이 수정하지 않은
 * 쪽을 보여 줘 "수정이 반영되지 않는" 것처럼 보이므로 두 조회가 겹치지 않게 한다.
 */
export const invalidateTaskQueries = async (
  queryClient: QueryClient,
  { groupId, taskListId, taskId }: TaskListPathParams & { taskId?: number },
) => {
  await queryClient.invalidateQueries({ queryKey: queryKeys.task.listOf(groupId, taskListId) });

  await Promise.all([
    taskId !== undefined
      ? queryClient.invalidateQueries({ queryKey: queryKeys.task.detail(taskId) })
      : undefined,
    queryClient.invalidateQueries({ queryKey: queryKeys.group.detail(groupId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.teamPage.group(groupId) }),
  ]);
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useActionMutation(createTaskAction, {
    onSuccess: (_data, variables) => invalidateTaskQueries(queryClient, variables),
    meta: { errorMessage: '할 일을 만들지 못했습니다.' },
  });
};

export const useUpdateRecurringTaskMutation = () => {
  const queryClient = useQueryClient();

  return useActionMutation(updateRecurringTaskAction, {
    onSuccess: (_data, variables) => invalidateTaskQueries(queryClient, variables),
    meta: { errorMessage: '반복 설정을 수정하지 못했습니다.' },
  });
};

/** 이름/설명/완료 여부 수정에 모두 사용한다. */
export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useActionMutation(updateTaskAction, {
    onSuccess: (_data, variables) => invalidateTaskQueries(queryClient, variables),
    meta: { errorMessage: '할 일을 수정하지 못했습니다.' },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useActionMutation(deleteTaskAction, {
    onSuccess: (_data, variables) => invalidateTaskQueries(queryClient, variables),
    meta: { errorMessage: '할 일을 삭제하지 못했습니다.' },
  });
};
