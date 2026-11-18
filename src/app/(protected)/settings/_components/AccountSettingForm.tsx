'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import type { Profile } from '@/apis/user/type';
import { type AccountSettingsFormValues, accountSettingsSchema } from '@/schemas/auth.schema';

import { useAccountSettingsSave } from '../_hooks/useAccountSettingsSave';
import DeleteAccountSection from './DeleteAccountSection';
import PasswordChangeForm from './PasswordChangeForm';
import ProfileUpdateForm from './ProfileUpdateForm';
import SettingSaveBar from './SettingSaveBar';

type AccountSettingFormProps = {
  initialProfile: Profile;
};

const AccountSettingForm = ({ initialProfile }: AccountSettingFormProps) => {
  const form = useForm<AccountSettingsFormValues>({
    resolver: zodResolver(accountSettingsSchema),
    mode: 'onChange',
    defaultValues: {
      nickname: initialProfile.nickname,
      image: initialProfile.image ?? '',
      imageFile: null,
      password: '',
      passwordConfirmation: '',
    },
  });

  const { handleSave, isSaving, hasChanges } = useAccountSettingsSave(form);

  return (
    <FormProvider {...form}>
      <section className="bg-background-primary w-full max-w-[780px] rounded-2xl p-8 md:p-12">
        <h1 className="text-xl font-semibold">계정 설정</h1>
        <ProfileUpdateForm email={initialProfile.email} />
        <PasswordChangeForm />
        <DeleteAccountSection />
      </section>

      {hasChanges && (
        <div className="w-full max-w-[780px]">
          <SettingSaveBar
            description="변경사항이 있습니다."
            buttonText={isSaving ? '저장 중' : '저장하기'}
            disabled={isSaving}
            onSave={handleSave}
          />
        </div>
      )}
    </FormProvider>
  );
};

export default AccountSettingForm;
