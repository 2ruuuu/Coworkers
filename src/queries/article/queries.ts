import {
  infiniteQueryOptions,
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  createArticleAction,
  createArticleCommentAction,
  deleteArticleAction,
  deleteArticleCommentAction,
  likeArticleAction,
  unlikeArticleAction,
  updateArticleAction,
  updateArticleCommentAction,
} from '@/actions/article.action';
import { getArticles } from '@/apis/article';
import type { ArticleRequest, GetArticlesParams } from '@/apis/article/type';
import { getArticleComments } from '@/apis/articleComment';
import { unwrapActionResult } from '@/lib/action';
import { queryKeys } from '@/queries/queryKeys';
import { useActionMutation } from '@/queries/useActionMutation';

export const ARTICLE_COMMENTS_PAGE_SIZE = 10;

export const articleQueries = {
  list: (params: GetArticlesParams) =>
    queryOptions({
      queryKey: queryKeys.article.list(params),
      queryFn: () => getArticles(params),
    }),
  best: (pageSize: number) =>
    queryOptions({
      queryKey: queryKeys.article.best(pageSize),
      queryFn: () => getArticles({ page: 1, pageSize, orderBy: 'like' }),
    }),
  comments: (articleId: string) =>
    infiniteQueryOptions({
      queryKey: queryKeys.article.comments(articleId),
      queryFn: ({ pageParam }) =>
        getArticleComments({ articleId, limit: ARTICLE_COMMENTS_PAGE_SIZE, cursor: pageParam }),
      initialPageParam: null as number | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }),
};

const useInvalidateArticles = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.article.all });
};

export const useCreateArticleMutation = () => {
  const invalidate = useInvalidateArticles();

  return useActionMutation(createArticleAction, {
    onSuccess: invalidate,
    meta: { errorMessage: '게시글을 등록하지 못했어요.' },
  });
};

export const useUpdateArticleMutation = () => {
  const invalidate = useInvalidateArticles();

  return useMutation({
    mutationFn: async ({ articleId, body }: { articleId: string; body: ArticleRequest }) =>
      unwrapActionResult(await updateArticleAction(articleId, body)),
    onSuccess: invalidate,
    meta: { errorMessage: '게시글을 수정하지 못했어요.' },
  });
};

export const useDeleteArticleMutation = () => {
  const invalidate = useInvalidateArticles();

  return useActionMutation(deleteArticleAction, {
    onSuccess: invalidate,
    meta: { errorMessage: '게시글을 삭제하지 못했어요.' },
  });
};

export const useToggleArticleLikeMutation = () => {
  const invalidate = useInvalidateArticles();

  return useMutation({
    mutationFn: async ({ articleId, isLiked }: { articleId: string; isLiked: boolean }) =>
      unwrapActionResult(
        await (isLiked ? unlikeArticleAction(articleId) : likeArticleAction(articleId)),
      ),
    onSuccess: invalidate,
    meta: { errorMessage: '좋아요를 처리하지 못했어요.' },
  });
};

interface ArticleCommentVariables {
  articleId: string;
}

const useInvalidateArticleComments = () => {
  const queryClient = useQueryClient();

  return ({ articleId }: ArticleCommentVariables) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.article.comments(articleId) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.article.lists() }),
    ]);
};

export const useCreateArticleCommentMutation = () => {
  const invalidate = useInvalidateArticleComments();

  return useMutation({
    mutationFn: async ({ articleId, content }: ArticleCommentVariables & { content: string }) =>
      unwrapActionResult(await createArticleCommentAction(articleId, { content })),
    onSuccess: (_data, variables) => invalidate(variables),
    meta: { errorMessage: '댓글을 작성하지 못했어요.' },
  });
};

export const useUpdateArticleCommentMutation = () => {
  const invalidate = useInvalidateArticleComments();

  return useMutation({
    mutationFn: async ({
      articleId,
      commentId,
      content,
    }: ArticleCommentVariables & { commentId: string; content: string }) =>
      unwrapActionResult(await updateArticleCommentAction(articleId, commentId, { content })),
    onSuccess: (_data, variables) => invalidate(variables),
    meta: { errorMessage: '댓글을 수정하지 못했어요.' },
  });
};

export const useDeleteArticleCommentMutation = () => {
  const invalidate = useInvalidateArticleComments();

  return useMutation({
    mutationFn: async ({ articleId, commentId }: ArticleCommentVariables & { commentId: string }) =>
      unwrapActionResult(await deleteArticleCommentAction(articleId, commentId)),
    onSuccess: (_data, variables) => invalidate(variables),
    meta: { errorMessage: '댓글을 삭제하지 못했어요.' },
  });
};
