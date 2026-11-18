'use client';

import type { ArticleOrder } from '@/apis/article/type';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';

import { parseArticleListParams } from '../_constants/article';

/** 게시글 목록의 페이지/정렬/검색어를 URL 쿼리로 관리한다. (뒤로가기·공유 시에도 유지) */
export const useArticleListParams = () => {
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const params = parseArticleListParams({
    page: searchParams.get('page'),
    orderBy: searchParams.get('orderBy'),
    keyword: searchParams.get('keyword'),
  });

  return {
    params,
    setPage: (page: number) => setSearchParams({ page }),
    setOrderBy: (orderBy: ArticleOrder) => setSearchParams({ orderBy, page: 1 }),
    // 검색어 입력은 히스토리를 쌓지 않도록 replace로 반영한다.
    setKeyword: (keyword: string) =>
      setSearchParams({ keyword: keyword.trim(), page: 1 }, { replace: true }),
  };
};
