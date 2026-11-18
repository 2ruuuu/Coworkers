import { ENDPOINTS } from '@/apis/endpoints';
import publicFetcher from '@/lib/publicFetcher';

import type { MessageResponse, ResetPasswordRequest, SendPasswordResetEmailRequest } from './type';

// 비밀번호 재설정 메일 전송 (공개 API)
export const sendResetPasswordEmail = async (body: SendPasswordResetEmailRequest) => {
  const response = await publicFetcher.post<MessageResponse>(
    ENDPOINTS.user.sendResetPasswordEmail,
    body,
  );
  return response.data;
};

// 비밀번호 재설정 (공개 API)
export const resetPassword = async (body: ResetPasswordRequest) => {
  const response = await publicFetcher.patch<MessageResponse>(ENDPOINTS.user.resetPassword, body);
  return response.data;
};
