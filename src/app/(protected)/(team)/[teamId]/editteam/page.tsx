import { notFound } from 'next/navigation';

import { getGroupServer } from '@/apis/group/server';
import { handleServerApiError } from '@/lib/auth/session';
import { ApiError } from '@/lib/error';
import { parsePositiveId } from '@/schemas/common.schema';

import TeamCard from '../../_components/TeamCard';
import TeamForm from '../../_components/TeamForm';

interface EditTeamPageProps {
  params: Promise<{ teamId: string }>;
}

const getGroupOrNotFound = async (groupId: number) => {
  try {
    return await getGroupServer(groupId);
  } catch (error) {
    if (error instanceof ApiError && [403, 404].includes(error.status)) {
      notFound();
    }
    return handleServerApiError(error);
  }
};

const EditTeamPage = async ({ params }: EditTeamPageProps) => {
  const groupId = parsePositiveId((await params).teamId);

  if (!groupId) {
    notFound();
  }

  const group = await getGroupOrNotFound(groupId);

  return (
    <TeamCard>
      <TeamForm
        key={groupId}
        mode="edit"
        groupId={groupId}
        initialName={group.name}
        initialImageUrl={group.image}
      />
    </TeamCard>
  );
};

export default EditTeamPage;
