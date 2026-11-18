import Skeleton from '@/components/skeleton/Skeleton';

import TeamCard from '../../_components/TeamCard';

export default function EditTeamLoading() {
  return (
    <TeamCard>
      <div role="status" aria-label="팀 정보를 불러오는 중" className="flex flex-col gap-8">
        <Skeleton className="h-7 w-32 rounded-md" />
        <Skeleton className="mx-auto size-16 rounded-[20px]" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </TeamCard>
  );
}
