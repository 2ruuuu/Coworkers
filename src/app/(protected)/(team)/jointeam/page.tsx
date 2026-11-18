import { buildJoinTeamPath, readInvitationParams } from '@/utils/team/invitation';

import TeamCard from '../_components/TeamCard';
import JoinTeamForm from './_components/JoinTeamForm';

interface JoinTeamPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const JoinTeamPage = async ({ searchParams }: JoinTeamPageProps) => {
  const params = await searchParams;
  // 로그인 확인은 (protected) 레이아웃이 처리하며, 로그인 후 이 경로(초대 정보 포함)로 돌아온다.
  const invitation = readInvitationParams({
    get: (key) => {
      const value = params[key];
      return typeof value === 'string' ? value : null;
    },
  });
  const initialTeamLink = invitation ? buildJoinTeamPath(invitation) : '';

  return (
    <TeamCard>
      <JoinTeamForm key={initialTeamLink} initialTeamLink={initialTeamLink} />
    </TeamCard>
  );
};

export default JoinTeamPage;
