import SocialAuthSection from '@/components/socialAuthSection/SocialAuthSection';

import SignupFormSection from './_components/SignupFormSection';

const SignupPage = () => {
  return (
    <>
      <h1 className="mb-10 text-center text-xl font-semibold">회원가입</h1>
      <SignupFormSection />
      <SocialAuthSection label="간편 회원가입하기" />
    </>
  );
};

export default SignupPage;
