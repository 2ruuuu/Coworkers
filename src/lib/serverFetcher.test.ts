import { beforeEach, describe, expect, it, vi } from 'vitest';

import { refreshAccessToken } from '@/apis/auth/refresh';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from '@/utils/auth/token';

import { ApiError } from './error';
import { serverFetcher } from './serverFetcher';

vi.mock('@/apis/auth/refresh', () => ({ refreshAccessToken: vi.fn() }));
vi.mock('@/utils/auth/token', () => ({
  getAccessToken: vi.fn(),
  getRefreshToken: vi.fn(),
  setAccessToken: vi.fn(),
  clearAuthTokens: vi.fn(),
}));

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const fetchMock = vi.fn();

describe('serverFetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('API_BASE_URL', 'https://api.test/');
    vi.mocked(getAccessToken).mockResolvedValue('old-token');
    vi.mocked(getRefreshToken).mockResolvedValue('refresh-token');
  });

  it('access 토큰을 Bearer로 붙여 요청한다', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { ok: true }));

    await expect(serverFetcher('/user')).resolves.toEqual({ ok: true });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.test/user');
    expect(new Headers(init.headers).get('Authorization')).toBe('Bearer old-token');
  });

  it('401이면 토큰을 갱신하고 새 토큰으로 한 번 재시도한다', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, {}))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));
    vi.mocked(refreshAccessToken).mockResolvedValue({ accessToken: 'new-token' });

    await expect(serverFetcher('/user')).resolves.toEqual({ ok: true });

    expect(setAccessToken).toHaveBeenCalledWith('new-token');
    const [, retryInit] = fetchMock.mock.calls[1];
    expect(new Headers(retryInit.headers).get('Authorization')).toBe('Bearer new-token');
  });

  it('서버 컴포넌트처럼 쿠키를 쓸 수 없어도 새 토큰으로 재시도한다', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, {}))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));
    vi.mocked(refreshAccessToken).mockResolvedValue({ accessToken: 'new-token' });
    vi.mocked(setAccessToken).mockRejectedValue(new Error('Cookies can only be modified...'));

    await expect(serverFetcher('/user')).resolves.toEqual({ ok: true });
  });

  it('갱신에 실패하면 토큰을 지우고 401 ApiError를 던진다', async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, { message: '만료' }));
    vi.mocked(refreshAccessToken).mockRejectedValue(new Error('refresh failed'));

    const error = await serverFetcher('/user').catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(401);
    expect(clearAuthTokens).toHaveBeenCalled();
  });

  it('204 응답은 undefined를 반환한다', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(serverFetcher('/x', { method: 'DELETE' })).resolves.toBeUndefined();
  });
});
