import { useMutation, useQueryClient } from '@tanstack/react-query';

import { loginAction, logoutAction } from '@/actions/auth.action';
import { signUp } from '@/apis/auth';
import type { AuthResponse, SignInRequest, SignUpRequest } from '@/apis/auth/type';
import { resetPassword, sendResetPasswordEmail } from '@/apis/user';
import type {
  MessageResponse,
  ResetPasswordRequest,
  SendPasswordResetEmailRequest,
} from '@/apis/user/type';
import { unwrapActionResult } from '@/lib/action';

type LoginMutationVariables = SignInRequest & { redirectPath?: string };

/** 폼에서 에러를 직접 표시하므로 전역 에러 토스트는 끈다. */
const formMutationMeta = { silentError: true };

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ redirectPath: string }, Error, LoginMutationVariables>({
    mutationFn: async ({ redirectPath, ...data }) =>
      unwrapActionResult(await loginAction(data, redirectPath)),
    // 다른 계정의 캐시가 남지 않도록 로그인 직후 캐시를 비운다.
    onSuccess: () => queryClient.clear(),
    retry: false,
    meta: formMutationMeta,
  });
};

/** 로그아웃 후 이전 사용자의 데이터가 보이지 않도록 쿼리 캐시를 모두 비운다. */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => unwrapActionResult(await logoutAction()),
    onSuccess: () => queryClient.clear(),
    retry: false,
    meta: { errorMessage: '로그아웃 중 오류가 발생했어요.' },
  });
};

export const useSignupMutation = () => {
  return useMutation<AuthResponse, Error, SignUpRequest>({
    mutationFn: signUp,
    retry: false,
    meta: formMutationMeta,
  });
};

export const useSendResetPasswordEmailMutation = () => {
  return useMutation<MessageResponse, Error, SendPasswordResetEmailRequest>({
    mutationFn: sendResetPasswordEmail,
    retry: false,
    meta: formMutationMeta,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation<MessageResponse, Error, ResetPasswordRequest>({
    mutationFn: resetPassword,
    retry: false,
    meta: formMutationMeta,
  });
};
