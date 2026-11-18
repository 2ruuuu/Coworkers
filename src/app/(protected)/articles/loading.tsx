import { ArticleListSkeleton, BestArticlesSkeleton } from './_components/ArticlesSkeleton';

export default function ArticlesLoading() {
  return (
    <div className="bg-background-primary mx-auto min-h-screen p-0 md:p-22">
      <BestArticlesSkeleton />
      <ArticleListSkeleton />
    </div>
  );
}
