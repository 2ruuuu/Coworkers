import { queryOptions, useQueryClient } from '@tanstack/react-query';

import {
  createTaskCommentAction,
  deleteTaskCommentAction,
  updateTaskCommentAction,
} from '@/actions/taskComment.action';
import type { Comment } from '@/apis/comment/type';
import { ENDPOINTS } from '@/apis/endpoints';
import { bffGet } from '@/lib/bffFetcher';
import { queryKeys } from '@/queries/queryKeys';
import { useActionMutation } from '@/queries/useActionMutation';

export const taskCommentQueries = {
  list: (taskId: number) =>
    queryOptions({
      queryKey: queryKeys.taskComment.list(taskId),
      queryFn: () => bffGet<Comment[]>(ENDPOINTS.taskComment.list(taskId)),
    }),
};

/**
 * 댓글이 바뀌면 댓글 목록과 함께 할 일 상세/목록(commentCount 포함)도 갱신한다.
 */
const useInvalidateTaskComments = () => {
  const queryClient = useQueryClient();

  return (taskId: number) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.taskComment.list(taskId) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.task.detail(taskId) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.task.lists() }),
    ]);
};

export const useCreateTaskCommentMutation = () => {
  const invalidate = useInvalidateTaskComments();

  return useActionMutation(createTaskCommentAction, {
    onSuccess: (_data, { taskId }) => invalidate(taskId),
    meta: { errorMessage: '댓글을 작성하지 못했습니다.' },
  });
};

export const useUpdateTaskCommentMutation = () => {
  const invalidate = useInvalidateTaskComments();

  return useActionMutation(updateTaskCommentAction, {
    onSuccess: (_data, { taskId }) => invalidate(taskId),
    meta: { errorMessage: '댓글을 수정하지 못했습니다.' },
  });
};

export const useDeleteTaskCommentMutation = () => {
  const invalidate = useInvalidateTaskComments();

  return useActionMutation(deleteTaskCommentAction, {
    onSuccess: (_data, { taskId }) => invalidate(taskId),
    meta: { errorMessage: '댓글을 삭제하지 못했습니다.' },
  });
};
