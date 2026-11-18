'use client';

import Link from 'next/link';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import WriteIcon from '@/assets/icons/pencil.svg?react';
import Pagination from '@/components/pagination/Pagination';
import { articleQueries } from '@/queries/article/queries';

import { ARTICLE_PAGE_SIZE } from '../_constants/article';
import { useArticleListParams } from '../_hooks/useArticleListParams';
import ArticleSearch from './ArticleSearch';
import { ArticleListSkeleton } from './ArticlesSkeleton';
import BestSection from './BestSection';
import ListSection from './ListSection';

const ArticlesClient = () => {
  const { params, setPage, setOrderBy, setKeyword } = useArticleListParams();
  const { data, isPending } = useQuery({
    ...articleQueries.list(params),
    placeholderData: keepPreviousData,
  });

  const totalPages = Math.max(1, Math.ceil((data?.totalCount ?? 0) / ARTICLE_PAGE_SIZE));
  const emptyMessage = params.keyword
    ? `'${params.keyword}'에 해당하는 결과가 없습니다.`
    : '아직 등록된 게시글이 없습니다.';

  return (
    <div className="bg-background-primary mx-auto flex min-h-screen p-0 md:p-22">
      <div className="min-h-screen w-full">
        <div className="mb-7 flex w-full flex-col gap-4 p-5 px-6 md:flex-row md:items-center md:justify-between xl:px-0">
          <h1 className="text-text-primary text-2xl font-semibold">자유게시판</h1>
          <ArticleSearch keyword={params.keyword ?? ''} onSearch={setKeyword} />
        </div>

        <BestSection />

        {isPending ? (
          <ArticleListSkeleton />
        ) : (
          <ListSection
            articles={data?.list ?? []}
            orderBy={params.orderBy}
            onOrderChange={setOrderBy}
            emptyMessage={emptyMessage}
          />
        )}

        <Pagination
          label="게시글 목록 페이지"
          currentPage={params.page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

        <Link
          href="/articles/write"
          aria-label="글쓰기"
          className="bg-brand-primary text-background-primary hover:bg-interaction-hover active:bg-interaction-pressed shadow-brand-tertiary-30 focus-visible:ring-brand-primary fixed right-10 bottom-10 inline-flex size-12 items-center justify-center rounded-full p-0 shadow-md transition-all duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:right-20 md:bottom-20"
        >
          <WriteIcon className="size-6" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default ArticlesClient;
