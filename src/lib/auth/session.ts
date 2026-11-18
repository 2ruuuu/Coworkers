import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import 'server-only';

import { PATHNAME_HEADER } from '@/constants/http';
import { ROUTES } from '@/constants/routes';
import { ApiError } from '@/lib/error';

/** 로그인 페이지로 보내고, 로그인 후 현재 경로로 돌아오게 한다. */
export const redirectToLogin = async (): Promise<never> => {
  const currentPath = (await headers()).get(PATHNAME_HEADER);
  const query = currentPath ? `?redirect=${encodeURIComponent(currentPath)}` : '';

  redirect(`${ROUTES.LOGIN}${query}`);
};

/**
 * 서버 컴포넌트에서 API 에러를 공통 처리한다.
 * 401(세션 만료)은 로그인 페이지로 보내고, 그 외는 다시 던져 error.tsx/not-found.tsx가 처리하게 한다.
 */
export const handleServerApiError = async (error: unknown): Promise<never> => {
  if (error instanceof ApiError && error.status === 401) {
    await redirectToLogin();
  }

  throw error;
};
