import type { ArticleWriter } from '@/apis/article/type';

export type ArticleComment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  writer: ArticleWriter;
};

export type GetArticleCommentsParams = {
  articleId: string;
  limit: number;
  cursor?: number | null;
};

export type ArticleCommentRequest = {
  content: string;
};

export type GetArticleCommentsResponse = {
  nextCursor: number | null;
  list: ArticleComment[];
};
