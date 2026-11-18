import { getMyProfileServer } from '@/apis/user/server';

import AccountSettingForm from './_components/AccountSettingForm';

const SettingPage = async () => {
  // 프로필을 불러오지 못하면 빈 폼 대신 에러 화면(error.tsx)을 보여준다.
  const profile = await getMyProfileServer();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 p-4">
      <AccountSettingForm initialProfile={profile} />
    </div>
  );
};

export default SettingPage;
