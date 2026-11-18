import type { ArticleOrder } from '@/apis/article/type';
import type { DropdownOption } from '@/components/dropdown/type';

export const ARTICLE_PAGE_SIZE = 10;
/** 베스트 게시글은 한 화면에 1~3개씩 넘겨 보므로 필요한 만큼만 불러온다. */
export const BEST_ARTICLE_COUNT = 12;
export const SEARCH_DEBOUNCE_MS = 500;

export const ARTICLE_ORDER_OPTIONS: DropdownOption<ArticleOrder>[] = [
  { label: '최신순', value: 'recent' },
  { label: '좋아요 많은순', value: 'like' },
];

/** URL 쿼리를 게시글 목록 요청 파라미터로 바꾼다. (서버 페이지와 클라이언트가 같은 규칙을 쓴다) */
export const parseArticleListParams = (query: {
  page?: string | null;
  orderBy?: string | null;
  keyword?: string | null;
}) => {
  const page = Number(query.page);

  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    orderBy: (query.orderBy === 'like' ? 'like' : 'recent') as ArticleOrder,
    keyword: query.keyword?.trim() || undefined,
    pageSize: ARTICLE_PAGE_SIZE,
  };
};
