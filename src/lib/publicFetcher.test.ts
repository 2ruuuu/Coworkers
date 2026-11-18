import { afterEach, describe, expect, it, vi } from 'vitest';

describe('publicFetcher', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('API 주소가 없으면 요청을 보내지 않고 ConfigError를 던진다', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '');
    vi.resetModules();
    // 환경 변수를 읽는 시점이 import 시점이므로 모듈을 새로 불러온다.
    const { default: publicFetcher } = await import('./publicFetcher');
    const { ConfigError } = await import('./error');

    await expect(publicFetcher.get('/articles')).rejects.toBeInstanceOf(ConfigError);
  });
});
