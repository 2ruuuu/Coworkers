import Image from 'next/image';
import Link from 'next/link';

import type { Article } from '@/apis/article/type';
import BestIcon from '@/assets/icons/best.svg?react';
import HeartEmptyIcon from '@/assets/icons/heart_empty.svg?react';
import HeartFillIcon from '@/assets/icons/heart_fill.svg?react';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/date';
import { isAllowedImageUrl } from '@/utils/isAllowedImageUrl';

interface ArticleCardProps {
  article: Article & { isLiked?: boolean };
  variant: 'best' | 'normal';
}

const ArticleCard = ({ article, variant }: ArticleCardProps) => {
  const isBest = variant === 'best';
  const { id, title, content, image, writer, createdAt, isLiked, likeCount } = article;

  return (
    <Link
      href={ROUTES.article(String(id))}
      className={cn(
        'border-border-primary bg-background-primary hover:shadow-brand-tertiary-20 focus-visible:ring-brand-primary flex flex-col gap-4 rounded-2xl border px-6 py-4 transition-all duration-200 outline-none hover:-translate-y-1 hover:shadow-md focus-visible:ring-2',
        isBest ? 'min-h-[208px]' : 'min-h-[160px]',
      )}
    >
      {isBest && (
        <span className="bg-background-secondary text-brand-primary flex w-18 flex-row items-center justify-center gap-1 rounded-full py-1.5 text-sm font-semibold">
          <BestIcon className="h-6 w-4" aria-hidden="true" />
          인기
        </span>
      )}
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div className="flex flex-row items-center gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <h3 className="text-text-primary text-2lg--line-height-24 line-clamp-1 font-semibold">
              {title}
            </h3>
            <p className="text-text-disabled text-md--line-height-17 line-clamp-2 font-normal">
              {content}
            </p>
          </div>
          {isAllowedImageUrl(image) && (
            <Image
              src={image}
              alt=""
              width={60}
              height={60}
              className="h-15 w-15 rounded-md object-cover"
            />
          )}
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-text-primary text-md">{writer.nickname}</span>
            <div className="bg-text-default h-3 w-px" aria-hidden="true" />
            <time dateTime={createdAt} className="text-text-disabled text-md">
              {formatDate(createdAt)}
            </time>
          </div>
          <span
            className={cn(
              'text-md flex flex-row items-center gap-1 font-normal',
              isLiked ? 'text-brand-primary' : 'text-text-disabled',
            )}
          >
            {isLiked ? (
              <HeartFillIcon className="h-6 w-4" aria-hidden="true" />
            ) : (
              <HeartEmptyIcon className="h-6 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">좋아요</span>
            {likeCount}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
