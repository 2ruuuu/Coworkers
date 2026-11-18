import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getArticlesServer } from '@/apis/article/server';
import { getQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/queries/queryKeys';

import ArticlesClient from './_components/ArticlesClient';
import { BEST_ARTICLE_COUNT, parseArticleListParams } from './_constants/article';

interface ArticlesPageProps {
  searchParams: Promise<{ page?: string; orderBy?: string; keyword?: string }>;
}

const ArticlesPage = async ({ searchParams }: ArticlesPageProps) => {
  const params = parseArticleListParams(await searchParams);
  const queryClient = getQueryClient();

  // 첫 화면에 필요한 목록과 베스트 게시글을 서버에서 미리 불러온다. (실패하면 클라이언트가 다시 요청)
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.article.list(params),
      queryFn: () => getArticlesServer(params),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.article.best(BEST_ARTICLE_COUNT),
      queryFn: () => getArticlesServer({ page: 1, pageSize: BEST_ARTICLE_COUNT, orderBy: 'like' }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArticlesClient />
    </HydrationBoundary>
  );
};

export default ArticlesPage;
