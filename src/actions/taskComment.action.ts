'use server';

import { z } from 'zod';

import {
  createTaskCommentServer,
  deleteTaskCommentServer,
  updateTaskCommentServer,
} from '@/apis/comment/server';
import type {
  Comment,
  CommentDetailPathParams,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '@/apis/comment/type';
import { TASK_COMMENT_MAX_LENGTH } from '@/constants/limits';
import { type ActionResult, runAction } from '@/lib/action';
import { idSchema } from '@/schemas/common.schema';

const contentSchema = z
  .string()
  .trim()
  .min(1, '댓글 내용을 입력해주세요.')
  .max(TASK_COMMENT_MAX_LENGTH, `댓글은 ${TASK_COMMENT_MAX_LENGTH}자 이하로 입력해주세요.`);
const createSchema = z.object({ taskId: idSchema, content: contentSchema });
const deleteSchema = z.object({ taskId: idSchema, commentId: idSchema });
const updateSchema = deleteSchema.extend({ content: contentSchema });

export const createTaskCommentAction = async (
  payload: CreateCommentRequest,
): Promise<ActionResult<Comment>> => {
  return runAction(() => {
    const { taskId, content } = createSchema.parse(payload);
    return createTaskCommentServer(taskId, content);
  }, '댓글을 작성하지 못했습니다.');
};

export const updateTaskCommentAction = async (
  payload: UpdateCommentRequest,
): Promise<ActionResult<Comment>> => {
  return runAction(() => {
    const { taskId, commentId, content } = updateSchema.parse(payload);
    return updateTaskCommentServer(taskId, commentId, content);
  }, '댓글을 수정하지 못했습니다.');
};

export const deleteTaskCommentAction = async (
  payload: CommentDetailPathParams,
): Promise<ActionResult<void>> => {
  return runAction(() => {
    const { taskId, commentId } = deleteSchema.parse(payload);
    return deleteTaskCommentServer(taskId, commentId);
  }, '댓글을 삭제하지 못했습니다.');
};
