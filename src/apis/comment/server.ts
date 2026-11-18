import 'server-only';

import { ENDPOINTS } from '@/apis/endpoints';
import { serverFetcher } from '@/lib/serverFetcher';

import type { Comment } from './type';

export const getTaskCommentsServer = async (taskId: number) => {
  return serverFetcher<Comment[]>(ENDPOINTS.taskComment.list(taskId));
};

export const createTaskCommentServer = async (taskId: number, content: string) => {
  return serverFetcher<Comment>(ENDPOINTS.taskComment.list(taskId), {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
};

export const updateTaskCommentServer = async (
  taskId: number,
  commentId: number,
  content: string,
) => {
  return serverFetcher<Comment>(ENDPOINTS.taskComment.detail(taskId, commentId), {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
};

export const deleteTaskCommentServer = async (taskId: number, commentId: number) => {
  return serverFetcher<void>(ENDPOINTS.taskComment.detail(taskId, commentId), {
    method: 'DELETE',
  });
};
