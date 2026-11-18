import { ENDPOINTS } from '@/apis/endpoints';
import publicFetcher from '@/lib/publicFetcher';

import type { GetArticlesParams, GetArticlesResponse } from './type';

// 게시글 목록 조회 (공개 API)
export const getArticles = async (params: GetArticlesParams) => {
  const response = await publicFetcher.get<GetArticlesResponse>(ENDPOINTS.article.list, {
    params,
  });
  return response.data;
};
