import { ENDPOINTS } from '@/apis/endpoints';
import publicFetcher from '@/lib/publicFetcher';

import type { GetArticleCommentsParams, GetArticleCommentsResponse } from './type';

// 게시글 댓글 목록 조회 (공개 API, 커서 기반)
export const getArticleComments = async ({
  articleId,
  limit,
  cursor,
}: GetArticleCommentsParams) => {
  const response = await publicFetcher.get<GetArticleCommentsResponse>(
    ENDPOINTS.article.comments(articleId, { limit, cursor }),
  );
  return response.data;
};
