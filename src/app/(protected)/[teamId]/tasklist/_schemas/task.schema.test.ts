import { describe, expect, it } from 'vitest';

import { TASK_DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from '@/constants/limits';

import { taskSchema } from './task.schema';

const validValues = {
  name: '할 일',
  date: new Date('2026-11-18T00:00:00.000Z'),
  time: { hour: 9, minute: 0 },
  frequency: 'ONCE' as const,
  description: '',
};

describe('taskSchema', () => {
  it('제목은 최대 길이까지 허용한다', () => {
    const result = taskSchema.safeParse({ ...validValues, name: 'a'.repeat(TASK_NAME_MAX_LENGTH) });

    expect(result.success).toBe(true);
  });

  it('제목이 최대 길이를 넘으면 안내 문구와 함께 실패한다', () => {
    const result = taskSchema.safeParse({
      ...validValues,
      name: 'a'.repeat(TASK_NAME_MAX_LENGTH + 1),
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toContain(`${TASK_NAME_MAX_LENGTH}자`);
  });

  it('메모가 최대 길이를 넘으면 실패한다', () => {
    const result = taskSchema.safeParse({
      ...validValues,
      description: 'a'.repeat(TASK_DESCRIPTION_MAX_LENGTH + 1),
    });

    expect(result.success).toBe(false);
  });
});
