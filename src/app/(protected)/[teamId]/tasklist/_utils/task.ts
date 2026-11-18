import type { RequestCreateTaskRecurring, RequestUpdateTaskRecurring } from '@/apis/recurring/type';

import type { TaskFormValues } from '../_schemas/task.schema';

/** 반복 주기에 맞는 필드만 담아 반복 일정 생성 요청을 만든다. */
export const createRecurringPayload = (
  { name, description, weekDays, frequency, date }: TaskFormValues,
  startDate: string,
): RequestCreateTaskRecurring => {
  const basePayload = { name, description, startDate };

  switch (frequency) {
    case 'WEEKLY':
      return { ...basePayload, frequencyType: 'WEEKLY', weekDays: weekDays ?? [] };
    case 'MONTHLY':
      return { ...basePayload, frequencyType: 'MONTHLY', monthDay: date.getDate() };
    case 'DAILY':
      return { ...basePayload, frequencyType: 'DAILY' };
    case 'ONCE':
      return { ...basePayload, frequencyType: 'ONCE' };
  }
};

/** 반복 일정 수정 요청. 생성과 같은 규칙으로 주기에 맞는 필드만 보낸다. */
export const updateRecurringPayload = (
  formValues: TaskFormValues,
  startDate: string,
): RequestUpdateTaskRecurring => {
  return {
    ...createRecurringPayload(formValues, startDate),
    startDate,
    description: formValues.description,
  };
};
