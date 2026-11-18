'use server';

import { signInServer } from '@/apis/auth/server';
import type { SignInRequest } from '@/apis/auth/type';
import { type ActionResult, runAction } from '@/lib/action';
import { getPostLoginRedirectPath } from '@/lib/auth/redirect';
import { clearAuthTokens, setAuthTokens } from '@/utils/auth/token';

export const loginAction = async (
  payload: SignInRequest,
  redirectPath?: string,
): Promise<ActionResult<{ redirectPath: string }>> => {
  return runAction(async () => {
    const { accessToken, refreshToken } = await signInServer(payload);
    await setAuthTokens({ accessToken, refreshToken });

    return { redirectPath: await getPostLoginRedirectPath({ redirectPath }) };
  }, '로그인 중 오류가 발생했어요.');
};

export const logoutAction = async (): Promise<ActionResult<void>> => {
  return runAction(clearAuthTokens, '로그아웃 중 오류가 발생했어요.');
};
