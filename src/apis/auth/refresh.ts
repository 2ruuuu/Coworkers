import { createApiUrl } from '@/lib/apiUrl';
import { ApiError } from '@/lib/error';

import type { RefreshTokenRequest, RefreshTokenResponse } from './type';

/**
 * serverFetcher를 거치지 않는다. (401 → refresh → 401 무한 재시도를 막기 위함)
 * proxy.ts에서도 사용하므로 next/headers 등 요청 컨텍스트에 의존하지 않는다.
 */
export const refreshAccessToken = async (
  body: RefreshTokenRequest,
): Promise<RefreshTokenResponse> => {
  const response = await fetch(createApiUrl('/auth/refresh-token'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  return response.json() as Promise<RefreshTokenResponse>;
};
