import { describe, expect, it, vi } from 'vitest';

import { getSafeRedirectPath } from './redirect';

vi.mock('@/apis/user/server', () => ({ getMyGroupsServer: vi.fn() }));

describe('getSafeRedirectPath (open redirect 방지)', () => {
  it('사이트 내부 경로만 허용한다', () => {
    expect(getSafeRedirectPath('/jointeam?token=abc')).toBe('/jointeam?token=abc');
    expect(getSafeRedirectPath('/1/tasklist')).toBe('/1/tasklist');
  });

  it('외부 주소와 우회 패턴은 거절한다', () => {
    expect(getSafeRedirectPath('https://evil.com')).toBeUndefined();
    expect(getSafeRedirectPath('//evil.com')).toBeUndefined();
    expect(getSafeRedirectPath('/\\evil.com')).toBeUndefined();
    expect(getSafeRedirectPath('')).toBeUndefined();
    expect(getSafeRedirectPath(null)).toBeUndefined();
  });
});
