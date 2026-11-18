'use client';

import { useEffect } from 'react';

import Link from 'next/link';

import StatusPage, {
  STATUS_PAGE_ACTION_CLASS,
  STATUS_PAGE_SECONDARY_ACTION_CLASS,
} from '@/components/statusPage/StatusPage';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    // 운영 환경에서는 digest로 서버 로그와 대조할 수 있다.
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code="500"
      title="서비스에 문제가 발생했습니다"
      description={
        <>
          일시적인 오류가 발생했거나 서비스 점검 중일 수 있어요.
          <br />
          잠시 후 다시 시도해 주세요.
        </>
      }
      actions={
        <>
          <button type="button" className={STATUS_PAGE_ACTION_CLASS} onClick={reset}>
            다시 시도
          </button>
          <Link href="/" className={STATUS_PAGE_SECONDARY_ACTION_CLASS}>
            홈으로 돌아가기
          </Link>
        </>
      }
    />
  );
};

export default ErrorPage;
