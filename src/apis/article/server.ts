import 'server-only';

import { ENDPOINTS } from '@/apis/endpoints';
import { withQuery } from '@/lib/apiUrl';
import { serverFetcher } from '@/lib/serverFetcher';

import type { ArticleDetail, ArticleRequest, GetArticlesParams, GetArticlesResponse } from './type';

export const getArticleDetailServer = async (articleId: string) => {
  return serverFetcher<ArticleDetail>(ENDPOINTS.article.detail(articleId));
};

export const createArticleServer = async (body: ArticleRequest) => {
  return serverFetcher<ArticleDetail>(ENDPOINTS.article.list, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const updateArticleServer = async (articleId: string, body: ArticleRequest) => {
  return serverFetcher<ArticleDetail>(ENDPOINTS.article.detail(articleId), {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

export const deleteArticleServer = async (articleId: string) => {
  return serverFetcher<void>(ENDPOINTS.article.detail(articleId), { method: 'DELETE' });
};

export const likeArticleServer = async (articleId: string) => {
  return serverFetcher<ArticleDetail>(ENDPOINTS.article.like(articleId), { method: 'POST' });
};

export const unlikeArticleServer = async (articleId: string) => {
  return serverFetcher<ArticleDetail>(ENDPOINTS.article.like(articleId), { method: 'DELETE' });
};

export const getArticlesServer = async (params: GetArticlesParams) => {
  return serverFetcher<GetArticlesResponse>(
    withQuery(ENDPOINTS.article.list, {
      page: params.page,
      pageSize: params.pageSize,
      orderBy: params.orderBy,
      keyword: params.keyword,
    }),
  );
};
