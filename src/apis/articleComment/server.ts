import 'server-only';

import { ENDPOINTS } from '@/apis/endpoints';
import { serverFetcher } from '@/lib/serverFetcher';

import type {
  ArticleComment,
  ArticleCommentRequest,
  GetArticleCommentsParams,
  GetArticleCommentsResponse,
} from './type';

export const getArticleCommentsServer = async ({
  articleId,
  limit,
  cursor,
}: GetArticleCommentsParams) => {
  return serverFetcher<GetArticleCommentsResponse>(
    ENDPOINTS.article.comments(articleId, { limit, cursor }),
  );
};

export const createArticleCommentServer = async (
  articleId: string,
  body: ArticleCommentRequest,
) => {
  return serverFetcher<ArticleComment>(ENDPOINTS.article.createComment(articleId), {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const updateArticleCommentServer = async (
  commentId: string,
  body: ArticleCommentRequest,
) => {
  return serverFetcher<ArticleComment>(ENDPOINTS.article.comment(commentId), {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

export const deleteArticleCommentServer = async (commentId: string) => {
  return serverFetcher<void>(ENDPOINTS.article.comment(commentId), { method: 'DELETE' });
};
