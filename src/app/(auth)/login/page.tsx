import Link from 'next/link';

import AlertIcon from '@/assets/icons/alert.svg?react';
import SocialAuthSection from '@/components/socialAuthSection/SocialAuthSection';
import { getSafeRedirectPath } from '@/lib/auth/redirect';
import { JOIN_TEAM_PATH } from '@/utils/team/invitation';

import LoginFormSection from './_components/LoginFormSection';

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: '간편 로그인에 실패했어요. 다시 시도해주세요.',
  config_error: '간편 로그인을 사용할 수 없어요. 잠시 후 다시 시도해주세요.',
};

const SignupPromptSection = () => {
  return (
    <div className="text-md m-7 flex justify-center gap-2">
      <span>아직 계정이 없으신가요?</span>
      <Link href="/signup" className="text-brand-primary underline">
        가입하기
      </Link>
    </div>
  );
};

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string;
    error?: string;
  }>;
}

const isTeamInvitationPath = (redirectPath?: string) => {
  if (!redirectPath) {
    return false;
  }

  try {
    const redirectUrl = new URL(redirectPath, 'http://localhost');

    return redirectUrl.pathname === JOIN_TEAM_PATH && redirectUrl.searchParams.has('token');
  } catch {
    return false;
  }
};

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const { redirect, error } = await searchParams;
  const postLoginRedirectPath = getSafeRedirectPath(redirect);
  const isTeamInvitation = isTeamInvitationPath(postLoginRedirectPath);
  const errorMessage = error ? LOGIN_ERROR_MESSAGES[error] : undefined;

  return (
    <>
      <h1 className={`${isTeamInvitation ? 'mb-8' : 'mb-12'} text-center text-xl font-semibold`}>
        로그인
      </h1>
      {errorMessage && (
        <p
          role="alert"
          className="text-status-danger bg-background-secondary mb-6 rounded-lg px-4 py-3 text-sm"
        >
          {errorMessage}
        </p>
      )}
      {isTeamInvitation && (
        <aside
          role="status"
          className="bg-brand-secondary text-brand-primary mb-8 flex items-start gap-3 rounded-lg px-4 py-3"
        >
          <AlertIcon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <strong className="text-sm font-semibold">팀 초대를 받으셨어요</strong>
            <p className="text-text-default text-sm leading-5">
              로그인하면 초대받은 팀 참여 화면으로 이동합니다.
            </p>
          </div>
        </aside>
      )}
      <LoginFormSection postLoginRedirectPath={postLoginRedirectPath} />
      <SignupPromptSection />
      <SocialAuthSection label="간편 로그인하기" redirectPath={postLoginRedirectPath} />
    </>
  );
};

export default LoginPage;
