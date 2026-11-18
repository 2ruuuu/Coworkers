import type { UserSummary } from '@/apis/user/type';

export interface CommentPathParams {
  taskId: number;
}

export interface CommentDetailPathParams extends CommentPathParams {
  commentId: number;
}

export interface CreateCommentRequest extends CommentPathParams {
  content: string;
}

export interface UpdateCommentRequest extends CommentDetailPathParams {
  content: string;
}

export interface Comment {
  user: UserSummary;
  userId: number;
  taskId: number;
  updatedAt: string;
  createdAt: string;
  content: string;
  id: number;
}
