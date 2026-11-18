import type { ReactNode } from 'react';

import Link from 'next/link';

import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

interface ArticlePageShellProps {
  children: ReactNode;
  /** 작성/수정 화면은 본문 폭을 제한한다. */
  narrow?: boolean;
}

/** 게시글 상세/작성/수정 화면의 공통 카드 + "목록으로" 링크 */
const ArticlePageShell = ({ children, narrow = false }: ArticlePageShellProps) => (
  <div className="mx-auto flex min-h-screen px-4 pt-5 md:p-20">
    <div className="min-h-screen w-full">
      <article
        className={cn(
          'bg-background-primary mx-auto flex w-full flex-col gap-4 rounded-2xl px-5 py-10 md:px-10 md:py-14',
          narrow && 'lg:max-w-[900px]',
        )}
      >
        {children}
      </article>
      <div className="mt-5 flex w-full justify-center pr-2">
        <Link href={ROUTES.ARTICLES} className="text-text-default text-lg">
          목록으로
        </Link>
      </div>
    </div>
  </div>
);

export default ArticlePageShell;
