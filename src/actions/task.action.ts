'use server';

import { z } from 'zod';

import type {
  CreateRecurringTaskParams,
  ResponseTaskRecurring,
  UpdateRecurringTaskParams,
} from '@/apis/recurring/type';
import {
  createRecurringTaskServer,
  deleteTaskServer,
  updateRecurringTaskServer,
  updateTaskServer,
} from '@/apis/task/server';
import type { Task, TaskDetailPathParams, UpdateTaskRequest } from '@/apis/task/type';
import { TASK_DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from '@/constants/limits';
import { type ActionResult, runAction } from '@/lib/action';
import { idSchema } from '@/schemas/common.schema';

const taskListPathSchema = z.object({ groupId: idSchema, taskListId: idSchema });
const taskPathSchema = taskListPathSchema.extend({ taskId: idSchema });
const recurringPathSchema = taskListPathSchema.extend({ recurringId: idSchema });

/** 백엔드는 길이를 넘으면 500을 돌려주므로 요청 전에 막는다. */
const taskTextSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '할 일 제목을 입력해 주세요.')
    .max(TASK_NAME_MAX_LENGTH, `할 일 제목은 ${TASK_NAME_MAX_LENGTH}자 이하로 입력해 주세요.`)
    .optional(),
  description: z
    .string()
    .max(
      TASK_DESCRIPTION_MAX_LENGTH,
      `할 일 메모는 ${TASK_DESCRIPTION_MAX_LENGTH}자 이하로 입력해 주세요.`,
    )
    .nullish(),
});

export const createTaskAction = async ({
  body,
  ...path
}: CreateRecurringTaskParams): Promise<ActionResult<ResponseTaskRecurring>> => {
  return runAction(() => {
    taskTextSchema.parse(body);
    return createRecurringTaskServer(taskListPathSchema.parse(path), body);
  }, '할 일을 만들지 못했습니다.');
};

export const updateRecurringTaskAction = async ({
  body,
  ...path
}: UpdateRecurringTaskParams): Promise<ActionResult<ResponseTaskRecurring>> => {
  return runAction(() => {
    taskTextSchema.parse(body);
    return updateRecurringTaskServer(recurringPathSchema.parse(path), body);
  }, '반복 설정을 수정하지 못했습니다.');
};

/** 할 일의 이름/설명/완료 여부를 수정한다. 전달된 필드만 변경된다. */
export const updateTaskAction = async ({
  name,
  description,
  done,
  ...path
}: UpdateTaskRequest): Promise<ActionResult<Task>> => {
  return runAction(() => {
    taskTextSchema.parse({ name, description });
    return updateTaskServer(taskPathSchema.parse(path), { name, description, done });
  }, '할 일을 수정하지 못했습니다.');
};

export const deleteTaskAction = async (path: TaskDetailPathParams): Promise<ActionResult<void>> => {
  return runAction(
    () => deleteTaskServer(taskPathSchema.parse(path)),
    '할 일을 삭제하지 못했습니다.',
  );
};
