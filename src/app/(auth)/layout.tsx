import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

/** 로그인/회원가입/비밀번호 재설정 화면의 공통 카드 레이아웃 */
const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="bg-background-secondary grid min-h-screen place-items-center p-4">
      <section className="bg-background-primary w-full max-w-[550px] rounded-2xl p-8 md:p-18">
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
