'use client';

import type { Article, ArticleOrder } from '@/apis/article/type';
import DropdownSelect from '@/components/dropdown/DropdownSelect';

import { ARTICLE_ORDER_OPTIONS } from '../_constants/article';
import ArticleCard from './Card';

interface ListSectionProps {
  articles: Article[];
  orderBy: ArticleOrder;
  onOrderChange: (value: ArticleOrder) => void;
  emptyMessage: string;
}

const ListSection = ({ articles, orderBy, onOrderChange, emptyMessage }: ListSectionProps) => {
  return (
    <section aria-labelledby="all-articles-title" className="flex flex-col gap-5 p-7 xl:p-0">
      <div className="flex flex-row justify-between">
        <h2 id="all-articles-title" className="text-text-primary text-2xl font-semibold">
          전체 게시글
        </h2>
        <DropdownSelect
          label="정렬 기준"
          options={ARTICLE_ORDER_OPTIONS}
          value={orderBy}
          onChange={onOrderChange}
        />
      </div>
      {articles.length === 0 ? (
        <p className="text-text-default flex min-h-40 items-center justify-center text-center">
          {emptyMessage}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {articles.map((article) => (
            <li key={article.id}>
              <ArticleCard article={article} variant="normal" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ListSection;
