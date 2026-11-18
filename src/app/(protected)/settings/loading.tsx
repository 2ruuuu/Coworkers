import Skeleton from '@/components/skeleton/Skeleton';

export default function SettingsLoading() {
  return (
    <div
      role="status"
      aria-label="계정 설정을 불러오는 중"
      className="flex min-h-screen flex-col items-center justify-center p-4"
    >
      <div className="bg-background-primary w-full max-w-[780px] space-y-6 rounded-2xl p-8 md:p-12">
        <Skeleton className="h-6 w-28 rounded-md" />
        <Skeleton className="mx-auto size-25 rounded-4xl" />
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
