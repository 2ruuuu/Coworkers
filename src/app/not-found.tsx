import Link from 'next/link';

import StatusPage, { STATUS_PAGE_ACTION_CLASS } from '@/components/statusPage/StatusPage';

const NotFoundPage = () => {
  return (
    <StatusPage
      code="404"
      title="페이지를 찾을 수 없습니다"
      description="주소가 잘못되었거나, 요청하신 페이지가 이동 또는 삭제되었어요."
      actions={
        <Link href="/" className={STATUS_PAGE_ACTION_CLASS}>
          홈으로 돌아가기
        </Link>
      }
    />
  );
};

export default NotFoundPage;
