'use client';

import { useState } from 'react';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { overlay } from 'overlay-kit';

import InputReply from '@/components/inputReply/InputReply';
import ConfirmModal from '@/components/modal/ConfirmModal';
import CommentItem from '@/components/reply/CommentItem';
import {
  articleQueries,
  useCreateArticleCommentMutation,
  useDeleteArticleCommentMutation,
  useUpdateArticleCommentMutation,
} from '@/queries/article/queries';
import { userQueries } from '@/queries/user/queries';
import { formatDate } from '@/utils/date';

interface CommentSectionProps {
  articleId: string;
  /** 전체 댓글 수 (불러온 댓글 수와 다를 수 있다) */
  commentCount: number;
}

const CommentSection = ({ articleId, commentCount }: CommentSectionProps) => {
  const [replyValue, setReplyValue] = useState('');
  const { data: me } = useQuery(userQueries.me());
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    articleQueries.comments(articleId),
  );
  const { mutate: createComment, isPending: isCreating } = useCreateArticleCommentMutation();
  const { mutateAsync: updateComment, isPending: isUpdating } = useUpdateArticleCommentMutation();
  const { mutateAsync: deleteComment } = useDeleteArticleCommentMutation();

  const comments = data?.pages.flatMap((page) => page.list) ?? [];

  const handleSubmit = () => {
    const content = replyValue.trim();
    if (!content || isCreating) return;

    createComment({ articleId, content }, { onSuccess: () => setReplyValue('') });
  };

  const openDeleteModal = (commentId: string) => {
    overlay.open(({ isOpen, close }) => (
      <ConfirmModal
        isOpen={isOpen}
        onClose={close}
        title="댓글을 삭제하시겠어요?"
        description="삭제된 댓글은 복구할 수 없습니다."
        confirmLabel="삭제"
        loadingLabel="삭제 중..."
        onConfirm={() => deleteComment({ articleId, commentId })}
      />
    ));
  };

  return (
    <section aria-labelledby="article-comments-title">
      <h2 id="article-comments-title" className="text-md mb-5 flex gap-1 font-semibold">
        댓글
        <span className="text-brand-primary">{commentCount}</span>
      </h2>
      <InputReply
        size="lg"
        value={replyValue}
        onChange={setReplyValue}
        onSubmit={handleSubmit}
        disabled={isCreating}
      />
      {comments.length > 0 ? (
        <ul className="divide-border-primary divide-y">
          {comments.map((comment) => (
            <li key={comment.id} className="py-2">
              <CommentItem
                size="lg"
                author={comment.writer.nickname}
                avatarSrc={comment.writer.image}
                content={comment.content}
                date={formatDate(comment.createdAt)}
                canManage={me !== undefined && String(me.id) === String(comment.writer.id)}
                isUpdating={isUpdating}
                onUpdate={(content) => updateComment({ articleId, commentId: comment.id, content })}
                onDelete={() => openDeleteModal(comment.id)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-text-disabled text-md py-4 text-center">아직 작성된 댓글이 없습니다.</p>
      )}
      {hasNextPage && (
        <button
          type="button"
          className="text-brand-primary text-md focus-visible:ring-brand-primary mx-auto mt-2 block rounded-md px-4 py-2 font-medium outline-none focus-visible:ring-2"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? '불러오는 중...' : '댓글 더보기'}
        </button>
      )}
    </section>
  );
};

export default CommentSection;
