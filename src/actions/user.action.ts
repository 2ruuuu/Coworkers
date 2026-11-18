'use server';

import { uploadImageIfFile } from '@/apis/image/server';
import {
  changePasswordServer,
  deleteMyAccountServer,
  updateMyProfileServer,
} from '@/apis/user/server';
import type {
  ChangePasswordRequest,
  MessageResponse,
  UpdateProfileRequest,
} from '@/apis/user/type';
import { type ActionResult, runAction } from '@/lib/action';
import { BusinessError } from '@/lib/error';
import { clearAuthTokens } from '@/utils/auth/token';

export const updateMyProfileAction = async (
  payload: UpdateProfileRequest,
): Promise<ActionResult<MessageResponse>> => {
  return runAction(() => updateMyProfileServer(payload), '프로필 정보를 수정하지 못했어요.');
};

export const changePasswordAction = async (
  payload: ChangePasswordRequest,
): Promise<ActionResult<MessageResponse>> => {
  return runAction(() => changePasswordServer(payload), '비밀번호를 변경하지 못했어요.');
};

/** FormData의 image 필드를 업로드하고 이미지 URL을 반환한다. */
export const uploadImageAction = async (formData: FormData): Promise<ActionResult<string>> => {
  return runAction(async () => {
    const url = await uploadImageIfFile(formData.get('image'));

    if (!url) {
      throw new BusinessError('업로드할 이미지가 없어요.');
    }

    return url;
  }, '이미지를 업로드하지 못했어요.');
};

export const deleteMyAccountAction = async (): Promise<ActionResult<MessageResponse>> => {
  return runAction(async () => {
    const result = await deleteMyAccountServer();
    await clearAuthTokens();
    return result;
  }, '회원 탈퇴에 실패했어요.');
};
