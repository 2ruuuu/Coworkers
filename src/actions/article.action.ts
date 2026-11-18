'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import {
  createArticleServer,
  deleteArticleServer,
  likeArticleServer,
  unlikeArticleServer,
  updateArticleServer,
} from '@/apis/article/server';
import type { ArticleDetail, ArticleRequest } from '@/apis/article/type';
import {
  createArticleCommentServer,
  deleteArticleCommentServer,
  updateArticleCommentServer,
} from '@/apis/articleComment/server';
import type { ArticleComment } from '@/apis/articleComment/type';
import { type ActionResult, runAction } from '@/lib/action';
import { stringIdSchema } from '@/schemas/common.schema';

const articleBodySchema = z.object({
  title: z.string().trim().min(1, '제목을 입력해주세요.'),
  content: z.string().trim().min(1, '내용을 입력해주세요.'),
  image: z.string().nullable().optional(),
});

const commentContentSchema = z.object({
  content: z.string().trim().min(1, '댓글 내용을 입력해주세요.'),
});

const ARTICLES_PATH = '/articles';
const articlePath = (articleId: string) => `${ARTICLES_PATH}/${articleId}`;

export const createArticleAction = async (
  body: ArticleRequest,
): Promise<ActionResult<ArticleDetail>> => {
  return runAction(async () => {
    const article = await createArticleServer(articleBodySchema.parse(body));
    revalidatePath(ARTICLES_PATH);
    return article;
  }, '게시글을 등록하지 못했어요.');
};

export const updateArticleAction = async (
  articleId: string,
  body: ArticleRequest,
): Promise<ActionResult<ArticleDetail>> => {
  return runAction(async () => {
    const id = stringIdSchema.parse(articleId);
    const article = await updateArticleServer(id, articleBodySchema.parse(body));
    revalidatePath(articlePath(id));
    return article;
  }, '게시글을 수정하지 못했어요.');
};

export const deleteArticleAction = async (articleId: string): Promise<ActionResult<void>> => {
  return runAction(async () => {
    await deleteArticleServer(stringIdSchema.parse(articleId));
    revalidatePath(ARTICLES_PATH);
  }, '게시글을 삭제하지 못했어요.');
};

export const likeArticleAction = async (
  articleId: string,
): Promise<ActionResult<ArticleDetail>> => {
  return runAction(
    () => likeArticleServer(stringIdSchema.parse(articleId)),
    '좋아요를 누르지 못했어요.',
  );
};

export const unlikeArticleAction = async (
  articleId: string,
): Promise<ActionResult<ArticleDetail>> => {
  return runAction(
    () => unlikeArticleServer(stringIdSchema.parse(articleId)),
    '좋아요를 취소하지 못했어요.',
  );
};

export const createArticleCommentAction = async (
  articleId: string,
  body: { content: string },
): Promise<ActionResult<ArticleComment>> => {
  return runAction(async () => {
    const id = stringIdSchema.parse(articleId);
    const comment = await createArticleCommentServer(id, commentContentSchema.parse(body));
    revalidatePath(articlePath(id));
    return comment;
  }, '댓글을 작성하지 못했어요.');
};

export const updateArticleCommentAction = async (
  articleId: string,
  commentId: string,
  body: { content: string },
): Promise<ActionResult<ArticleComment>> => {
  return runAction(async () => {
    const comment = await updateArticleCommentServer(
      stringIdSchema.parse(commentId),
      commentContentSchema.parse(body),
    );
    revalidatePath(articlePath(stringIdSchema.parse(articleId)));
    return comment;
  }, '댓글을 수정하지 못했어요.');
};

export const deleteArticleCommentAction = async (
  articleId: string,
  commentId: string,
): Promise<ActionResult<void>> => {
  return runAction(async () => {
    await deleteArticleCommentServer(stringIdSchema.parse(commentId));
    revalidatePath(articlePath(stringIdSchema.parse(articleId)));
  }, '댓글을 삭제하지 못했어요.');
};
