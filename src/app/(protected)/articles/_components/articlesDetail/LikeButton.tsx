'use client';

import { useState } from 'react';

import HeartEmptyIcon from '@/assets/icons/heart_empty.svg?react';
import HeartFillIcon from '@/assets/icons/heart_fill.svg?react';
import { useToggleArticleLikeMutation } from '@/queries/article/queries';
import { cn } from '@/utils/cn';

interface LikeButtonProps {
  articleId: string;
  initialIsLiked: boolean;
  initialLikeCount: number;
}

const formatLikeCount = (count: number) => (count > 999 ? '999+' : String(count));

/** 누르는 즉시 화면에 반영하고(낙관적 업데이트), 실패하면 되돌린다. */
const LikeButton = ({ articleId, initialIsLiked, initialLikeCount }: LikeButtonProps) => {
  const [like, setLike] = useState({ isLiked: initialIsLiked, count: initialLikeCount });
  const { mutate, isPending } = useToggleArticleLikeMutation();

  const handleClick = () => {
    if (isPending) return;

    const previous = like;
    setLike({
      isLiked: !previous.isLiked,
      count: Math.max(0, previous.count + (previous.isLiked ? -1 : 1)),
    });
    mutate({ articleId, isLiked: previous.isLiked }, { onError: () => setLike(previous) });
  };

  return (
    <div className="flex w-full justify-end px-4">
      <button
        type="button"
        disabled={isPending}
        aria-pressed={like.isLiked}
        aria-label={`좋아요 ${like.count}개`}
        className={cn(
          'text-md focus-visible:ring-brand-primary flex flex-row items-center gap-1 rounded-md font-normal outline-none focus-visible:ring-2',
          like.isLiked ? 'text-brand-primary' : 'text-text-disabled',
          isPending && 'cursor-not-allowed opacity-50',
        )}
        onClick={handleClick}
      >
        {like.isLiked ? (
          <HeartFillIcon className="h-6 w-4" aria-hidden="true" />
        ) : (
          <HeartEmptyIcon className="h-6 w-4" aria-hidden="true" />
        )}
        <span aria-hidden="true">{formatLikeCount(like.count)}</span>
      </button>
    </div>
  );
};

export default LikeButton;
