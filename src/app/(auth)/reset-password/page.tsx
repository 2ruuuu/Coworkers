import Link from 'next/link';

import ResetPasswordFormSection from './_components/ResetPasswordFormSection';

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const { token } = await searchParams;

  return (
    <>
      <h1 className="mb-10 text-center text-xl font-semibold">비밀번호 재설정</h1>
      {token ? (
        <ResetPasswordFormSection token={token} />
      ) : (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p role="alert" className="text-status-danger">
            유효하지 않은 비밀번호 재설정 링크입니다.
          </p>
          <Link href="/login" className="text-brand-primary underline">
            로그인으로 돌아가기
          </Link>
        </div>
      )}
    </>
  );
};

export default ResetPasswordPage;
