import { z } from 'zod';

import { TASK_DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from '@/constants/limits';

export const taskSchema = z.object({
  name: z
    .string()
    .min(1, '할 일 제목을 입력해 주세요')
    .max(TASK_NAME_MAX_LENGTH, `할 일 제목은 ${TASK_NAME_MAX_LENGTH}자 이하로 입력해 주세요`),
  date: z.date(),
  time: z.object({
    hour: z.number(),
    minute: z.number(),
  }),
  frequency: z.enum(['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY']),
  description: z
    .string()
    .max(
      TASK_DESCRIPTION_MAX_LENGTH,
      `할 일 메모는 ${TASK_DESCRIPTION_MAX_LENGTH}자 이하로 입력해 주세요`,
    )
    .optional(),
  weekDays: z.array(z.number().min(0).max(6)).optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
