import { notFound } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getArticleDetailServer } from '@/apis/article/server';
import { getArticleCommentsServer } from '@/apis/articleComment/server';
import { handleServerApiError } from '@/lib/auth/session';
import { ApiError } from '@/lib/error';
import { getQueryClient } from '@/lib/queryClient';
import { ARTICLE_COMMENTS_PAGE_SIZE } from '@/queries/article/queries';
import { queryKeys } from '@/queries/queryKeys';
import { stringIdSchema } from '@/schemas/common.schema';
import { formatDate } from '@/utils/date';

import ArticlePageShell from '../_components/ArticlePageShell';
import CommentSection from '../_components/articlesDetail/CommentSection';
import ArticleContent from '../_components/articlesDetail/Content';
import ArticleHeader from '../_components/articlesDetail/Header';
import LikeButton from '../_components/articlesDetail/LikeButton';

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>;
}

const ArticleDetailPage = async ({ params }: ArticleDetailPageProps) => {
  const parsedId = stringIdSchema.safeParse((await params).id);

  if (!parsedId.success) {
    notFound();
  }

  const articleId = parsedId.data;

  // 게시글과 첫 댓글 페이지를 동시에 불러온다.
  const [article, firstCommentsPage] = await Promise.all([
    getArticleDetailServer(articleId),
    getArticleCommentsServer({ articleId, limit: ARTICLE_COMMENTS_PAGE_SIZE }),
  ]).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    return handleServerApiError(error);
  });

  const queryClient = getQueryClient();
  queryClient.setQueryData(queryKeys.article.comments(articleId), {
    pages: [firstCommentsPage],
    pageParams: [null],
  });

  return (
    <ArticlePageShell>
      <ArticleHeader
        id={articleId}
        title={article.title}
        writerId={String(article.writer.id)}
        writer={article.writer.nickname}
        writerImage={article.writer.image}
        createdAt={formatDate(article.createdAt)}
      />
      <ArticleContent content={article.content} image={article.image} />
      <LikeButton
        articleId={articleId}
        initialIsLiked={article.isLiked}
        initialLikeCount={article.likeCount}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CommentSection articleId={articleId} commentCount={article.commentCount} />
      </HydrationBoundary>
    </ArticlePageShell>
  );
};

export default ArticleDetailPage;
