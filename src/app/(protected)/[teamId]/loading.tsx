import TeamPageSkeleton from './_components/TeamPageSkeleton';

export default function TeamPageLoading() {
  return (
    <div className="bg-background-secondary min-h-full px-4 py-6 md:px-6 xl:px-16 xl:py-15.75">
      <div className="mx-auto w-full max-w-85.75 md:max-w-155 xl:mx-0 xl:max-w-280">
        <TeamPageSkeleton />
      </div>
    </div>
  );
}
