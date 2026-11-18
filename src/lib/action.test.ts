import { describe, expect, it, vi } from 'vitest';

import { runAction, unwrapActionResult } from './action';
import { ApiError, BusinessError } from './error';

vi.mock('next/navigation', () => ({
  // Next.js 내부 에러(redirect 등)만 다시 던진다.
  unstable_rethrow: (error: unknown) => {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
  },
}));

describe('runAction', () => {
  it('성공하면 data를 담아 반환한다', async () => {
    await expect(runAction(async () => 1, '실패')).resolves.toEqual({ success: true, data: 1 });
  });

  it('실패하면 던지지 않고 메시지와 상태 코드를 반환한다', async () => {
    const result = await runAction(async () => {
      throw new ApiError(409, '{"message":"이미 존재합니다"}');
    }, '실패');

    expect(result).toEqual({ success: false, error: '이미 존재합니다', status: 409 });
  });

  it('redirect 같은 Next.js 내부 에러는 다시 던진다', async () => {
    await expect(
      runAction(async () => {
        throw new Error('NEXT_REDIRECT');
      }, '실패'),
    ).rejects.toThrow('NEXT_REDIRECT');
  });
});

describe('unwrapActionResult', () => {
  it('실패 결과는 상태 코드를 가진 BusinessError로 던진다', () => {
    expect(() => unwrapActionResult({ success: false, error: '에러', status: 400 })).toThrow(
      BusinessError,
    );

    try {
      unwrapActionResult({ success: false, error: '에러', status: 400 });
    } catch (error) {
      expect((error as BusinessError).status).toBe(400);
    }
  });

  it('성공 결과는 data를 반환한다', () => {
    expect(unwrapActionResult({ success: true, data: 'ok' })).toBe('ok');
  });
});
