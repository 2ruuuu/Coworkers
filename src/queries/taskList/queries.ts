import { type QueryClient, useQueryClient } from '@tanstack/react-query';

import {
  createTaskListAction,
  deleteTaskListAction,
  updateTaskListNameAction,
} from '@/actions/taskList.action';
import { queryKeys } from '@/queries/queryKeys';
import { useActionMutation } from '@/queries/useActionMutation';

/** 목록이 바뀌면 그 목록을 포함하는 그룹 상세와 팀 페이지를 갱신한다. */
const invalidateTaskListOwners = (queryClient: QueryClient, groupId: number) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.group.detail(groupId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.teamPage.group(groupId) }),
  ]);

export const useCreateTaskListMutation = () => {
  const queryClient = useQueryClient();

  return useActionMutation(createTaskListAction, {
    onSuccess: (_data, { groupId }) => invalidateTaskListOwners(queryClient, groupId),
    meta: { errorMessage: '할 일 목록을 생성하지 못했습니다.' },
  });
};

export const useUpdateTaskListMutation = () => {
  const queryClient = useQueryClient();

  return useActionMutation(updateTaskListNameAction, {
    onSuccess: (_data, { groupId }) => invalidateTaskListOwners(queryClient, groupId),
    meta: { errorMessage: '할 일 목록 이름을 수정하지 못했습니다.' },
  });
};

export const useDeleteTaskListMutation = () => {
  const queryClient = useQueryClient();

  return useActionMutation(deleteTaskListAction, {
    onSuccess: (_data, { groupId }) => invalidateTaskListOwners(queryClient, groupId),
    meta: { errorMessage: '할 일 목록을 삭제하지 못했습니다.' },
  });
};
