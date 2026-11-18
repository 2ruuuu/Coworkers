import { describe, expect, it } from 'vitest';

import type { TaskFormValues } from '../_schemas/task.schema';
import { createRecurringPayload, updateRecurringPayload } from './task';

const baseValues: TaskFormValues = {
  name: '할 일',
  description: '메모',
  date: new Date(2026, 5, 15),
  time: { hour: 9, minute: 0 },
  frequency: 'ONCE',
  weekDays: [1, 3],
};

describe('recurring payload', () => {
  it('주간 반복이면 weekDays만 포함한다', () => {
    const payload = createRecurringPayload({ ...baseValues, frequency: 'WEEKLY' }, 'start');
    expect(payload).toEqual({
      name: '할 일',
      description: '메모',
      startDate: 'start',
      frequencyType: 'WEEKLY',
      weekDays: [1, 3],
    });
  });

  it('수정 요청도 반복 주기와 무관한 필드(monthDay/weekDays)를 보내지 않는다', () => {
    const payload = updateRecurringPayload({ ...baseValues, frequency: 'DAILY' }, 'start');
    expect(payload).toEqual({
      name: '할 일',
      description: '메모',
      startDate: 'start',
      frequencyType: 'DAILY',
    });
  });

  it('월간 반복이면 선택한 날짜의 일(day)을 monthDay로 보낸다', () => {
    const payload = updateRecurringPayload({ ...baseValues, frequency: 'MONTHLY' }, 'start');
    expect(payload).toMatchObject({ frequencyType: 'MONTHLY', monthDay: 15 });
    expect(payload).not.toHaveProperty('weekDays');
  });
});
