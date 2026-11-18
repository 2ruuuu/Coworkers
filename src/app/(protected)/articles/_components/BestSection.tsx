'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';
import ArrowRightIcon from '@/assets/icons/arrow_right.svg?react';
import useMediaQuery, { MEDIA_QUERY } from '@/hooks/useMediaQuery';
import { articleQueries } from '@/queries/article/queries';

import { BEST_ARTICLE_COUNT } from '../_constants/article';
import { BestArticlesSkeleton } from './ArticlesSkeleton';
import ArticleCard from './Card';
import PageIndicator from './PageIndicator';

const ARROW_BUTTON_CLASS =
  'border-border-primary bg-background-primary hover:bg-background-tertiary hover:text-text-primary focus-visible:ring-brand-primary flex h-8 w-8 items-center justify-center gap-1 rounded-full border outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50';

/** 좋아요가 많은 게시글을 화면 크기에 맞춰 1~3개씩 넘겨 본다. */
const BestSection = () => {
  const { data, isPending } = useQuery(articleQueries.best(BEST_ARTICLE_COUNT));
  const isDesktop = useMediaQuery(MEDIA_QUERY.desktop);
  const isTablet = useMediaQuery(MEDIA_QUERY.tablet);
  const [page, setPage] = useState(1);

  if (isPending) return <BestArticlesSkeleton />;

  const articles = data?.list ?? [];
  const itemsPerPage = isDesktop ? 3 : isTablet ? 2 : 1;
  const totalPages = Math.max(1, Math.ceil(articles.length / itemsPerPage));
  // 화면이 넓어져 페이지 수가 줄어도 범위를 벗어나지 않게 한다.
  const currentPage = Math.min(page, totalPages);
  const visibleArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <section
      aria-labelledby="best-articles-title"
      className="bg-background-secondary mb-10 flex w-full flex-col items-center gap-6 px-6 py-10 md:rounded-2xl"
    >
      <h2 id="best-articles-title" className="text-text-primary text-xl font-semibold">
        베스트 게시글
      </h2>
      <ul className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleArticles.map((article) => (
          <li key={article.id}>
            <ArticleCard article={article} variant="best" />
          </li>
        ))}
      </ul>
      <nav
        aria-label="베스트 게시글 페이지"
        className="relative flex w-full flex-col items-center gap-4"
      >
        <PageIndicator currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        <div className="absolute right-0 -bottom-3 flex flex-row items-center gap-1">
          <button
            type="button"
            aria-label="이전 베스트 게시글"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            className={ARROW_BUTTON_CLASS}
          >
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="다음 베스트 게시글"
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
            className={ARROW_BUTTON_CLASS}
          >
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </section>
  );
};

export default BestSection;
