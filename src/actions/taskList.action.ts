'use server';

import { z } from 'zod';

import {
  createTaskListServer,
  deleteTaskListServer,
  updateTaskListNameServer,
} from '@/apis/taskList/server';
import type {
  CreateTaskListParams,
  DeleteTaskListParams,
  TaskListSummary,
  UpdateTaskListNameParams,
} from '@/apis/taskList/type';
import { type ActionResult, runAction } from '@/lib/action';
import { idSchema } from '@/schemas/common.schema';
import { taskListNameSchema } from '@/schemas/team.schema';

const createSchema = z.object({ groupId: idSchema, name: taskListNameSchema });
const updateSchema = createSchema.extend({ taskListId: idSchema });
const deleteSchema = z.object({ groupId: idSchema, taskListId: idSchema });

export const createTaskListAction = async (
  payload: CreateTaskListParams,
): Promise<ActionResult<TaskListSummary>> => {
  return runAction(() => {
    const { groupId, name } = createSchema.parse(payload);
    return createTaskListServer(groupId, name);
  }, '할 일 목록을 생성하지 못했습니다.');
};

export const updateTaskListNameAction = async (
  payload: UpdateTaskListNameParams,
): Promise<ActionResult<TaskListSummary>> => {
  return runAction(() => {
    const { groupId, taskListId, name } = updateSchema.parse(payload);
    return updateTaskListNameServer(groupId, taskListId, name);
  }, '할 일 목록 이름을 수정하지 못했습니다.');
};

export const deleteTaskListAction = async (
  payload: DeleteTaskListParams,
): Promise<ActionResult<void>> => {
  return runAction(() => {
    const { groupId, taskListId } = deleteSchema.parse(payload);
    return deleteTaskListServer(groupId, taskListId);
  }, '할 일 목록을 삭제하지 못했습니다.');
};
