import { type UseFormReturn, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import type { UpdateProfileRequest } from '@/apis/user/type';
import { getErrorMessage } from '@/lib/error';
import {
  useChangePasswordMutation,
  useUpdateMyProfileMutation,
  useUploadImageMutation,
} from '@/queries/user/queries';
import type { AccountSettingsFormValues } from '@/schemas/auth.schema';

/** 계정 설정 폼의 변경 여부를 계산하고, 프로필/비밀번호 저장을 처리한다. */
export const useAccountSettingsSave = (form: UseFormReturn<AccountSettingsFormValues>) => {
  const { control, handleSubmit, reset, formState } = form;
  const updateProfileMutation = useUpdateMyProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();
  const uploadImageMutation = useUploadImageMutation();

  const [password, passwordConfirmation] = useWatch({
    control,
    name: ['password', 'passwordConfirmation'],
  });

  const isNicknameChanged = Boolean(formState.dirtyFields.nickname);
  const isImageChanged = Boolean(formState.dirtyFields.image);
  const hasPasswordValue = Boolean(password || passwordConfirmation);
  const hasChanges = isNicknameChanged || isImageChanged || hasPasswordValue;

  const isSaving =
    uploadImageMutation.isPending ||
    updateProfileMutation.isPending ||
    changePasswordMutation.isPending;

  const saveProfile = async ({ nickname, image, imageFile }: AccountSettingsFormValues) => {
    const savedImage = imageFile ? await uploadImageMutation.mutateAsync(imageFile) : image;
    const payload: UpdateProfileRequest = {};

    if (isNicknameChanged) payload.nickname = nickname;
    if (isImageChanged) payload.image = savedImage;

    await updateProfileMutation.mutateAsync(payload);

    return savedImage;
  };

  const handleSave = handleSubmit(async (values) => {
    try {
      const savedImage =
        isNicknameChanged || isImageChanged ? await saveProfile(values) : values.image;

      if (hasPasswordValue) {
        await changePasswordMutation.mutateAsync({
          password: values.password,
          passwordConfirmation: values.passwordConfirmation,
        });
      }

      reset({
        nickname: values.nickname,
        image: savedImage,
        imageFile: null,
        password: '',
        passwordConfirmation: '',
      });

      toast.success('계정 설정이 저장되었어요.');
    } catch (error) {
      toast.error(getErrorMessage(error, '계정 설정 저장 중 오류가 발생했어요.'));
    }
  });

  return { handleSave, isSaving, hasChanges };
};
