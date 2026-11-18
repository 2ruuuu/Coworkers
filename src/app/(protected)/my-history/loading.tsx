import Skeleton from '@/components/skeleton/Skeleton';

export default function MyHistoryLoading() {
  return (
    <div
      role="status"
      aria-label="마이 히스토리를 불러오는 중"
      className="bg-background-secondary px-4 py-6 md:px-6 xl:px-25 xl:py-10"
    >
      <Skeleton className="mb-6 h-6 w-32 rounded-md" />
      <div className="bg-background-primary flex flex-col gap-3 rounded-2xl p-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
