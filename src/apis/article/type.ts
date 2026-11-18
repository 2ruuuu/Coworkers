export type ArticleWriter = {
  id: string;
  nickname: string;
  image: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  image: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  writer: ArticleWriter;
};

export type ArticleDetail = Article & {
  isLiked: boolean;
};

export type ArticleOrder = 'recent' | 'like';

export type GetArticlesParams = {
  page: number;
  pageSize: number;
  orderBy: ArticleOrder;
  keyword?: string;
};

/** 게시글 작성/수정 요청 본문 */
export type ArticleRequest = {
  title: string;
  content: string;
  image?: string | null;
};

export type GetArticlesResponse = {
  totalCount: number;
  list: Article[];
};
