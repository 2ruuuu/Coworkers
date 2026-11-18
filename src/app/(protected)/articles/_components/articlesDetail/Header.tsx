'use client';

import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { overlay } from 'overlay-kit';
import { toast } from 'react-hot-toast';

import KebabIcon from '@/assets/icons/kebab.svg?react';
import Dropdown from '@/components/dropdown/Dropdown';
import ConfirmModal from '@/components/modal/ConfirmModal';
import Profile from '@/components/profile/Profile';
import { EDIT_DELETE_OPTIONS, type EditDeleteValue } from '@/constants/listItem';
import { ROUTES } from '@/constants/routes';
import { useDeleteArticleMutation } from '@/queries/article/queries';
import { userQueries } from '@/queries/user/queries';

interface ArticleHeaderProps {
  id: string;
  title: string;
  writerId: string;
  writer: string;
  writerImage?: string | null;
  createdAt: string;
}

const ArticleHeader = ({
  id,
  title,
  writerId,
  writer,
  writerImage,
  createdAt,
}: ArticleHeaderProps) => {
  const router = useRouter();
  const { data: me } = useQuery(userQueries.me());
  const { mutateAsync: deleteArticle } = useDeleteArticleMutation();
  const isAuthor = me !== undefined && String(me.id) === writerId;

  const handleMenuSelect = (value: EditDeleteValue) => {
    if (value === 'EDIT') {
      router.push(ROUTES.editArticle(id));
      return;
    }

    overlay.open(({ isOpen, close }) => (
      <ConfirmModal
        isOpen={isOpen}
        onClose={close}
        title="게시글을 삭제하시겠어요?"
        description="삭제된 게시글은 복구할 수 없습니다."
        confirmLabel="삭제"
        loadingLabel="삭제 중..."
        onConfirm={async () => {
          await deleteArticle(id);
          toast.success('게시글을 삭제했어요.');
          router.replace(ROUTES.ARTICLES);
        }}
      />
    ));
  };

  return (
    <header className="border-border-primary mb-4 flex w-full items-start justify-between border-b pb-3">
      <div className="flex flex-col gap-2">
        <h1 className="text-text-primary text-2lg font-semibold md:text-xl">{title}</h1>
        <div className="flex items-center gap-2">
          <Profile alt={`${writer} 프로필`} size="md" src={writerImage} />
          <span className="text-text-primary md:text-md text-xs">{writer}</span>
          <div className="bg-text-default h-3 w-px" aria-hidden="true" />
          <span className="text-text-disabled md:text-md text-xs">{createdAt}</span>
        </div>
      </div>
      {isAuthor && (
        <Dropdown
          options={EDIT_DELETE_OPTIONS}
          onSelect={handleMenuSelect}
          trigger={<KebabIcon className="size-6" aria-hidden="true" />}
          triggerLabel="게시글 메뉴"
        />
      )}
    </header>
  );
};

export default ArticleHeader;
