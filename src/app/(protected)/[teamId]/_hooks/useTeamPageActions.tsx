'use client';

import { useRouter } from 'next/navigation';

import { overlay } from 'overlay-kit';
import { toast } from 'react-hot-toast';

import type { Group } from '@/apis/user/type';
import ConfirmModal from '@/components/modal/ConfirmModal';
import TaskListNameModal from '@/components/taskList/TaskListNameModal';
import { ROUTES } from '@/constants/routes';
import { useDeleteTeamMemberMutation, useDeleteTeamMutation } from '@/queries/team/queries';

import InviteMemberModal from '../_components/modals/InviteMemberModal';
import type { TeamPageMember } from '../type';

interface UseTeamPageActionsParams {
  groupId: number;
  teamName: string;
  myGroups: Group[];
}

/** 팀 페이지의 모달 기반 동작(초대, 팀 수정/삭제, 멤버 내보내기, 목록 생성) */
export const useTeamPageActions = ({ groupId, teamName, myGroups }: UseTeamPageActionsParams) => {
  const router = useRouter();
  const { mutateAsync: deleteTeam } = useDeleteTeamMutation();
  const { mutateAsync: deleteTeamMember } = useDeleteTeamMemberMutation();

  const openInviteModal = () => {
    overlay.open(({ isOpen, close }) => (
      <InviteMemberModal isOpen={isOpen} groupId={groupId} onClose={close} />
    ));
  };

  const goToEditTeam = () => {
    router.push(ROUTES.editTeam(groupId));
  };

  const openDeleteTeamModal = () => {
    overlay.open(({ isOpen, close }) => (
      <ConfirmModal
        isOpen={isOpen}
        onClose={close}
        title="팀 삭제"
        description={`${teamName} 팀을 삭제하시겠어요?\n삭제한 팀은 다시 복구할 수 없습니다.`}
        confirmLabel="삭제하기"
        loadingLabel="삭제 중"
        onConfirm={async () => {
          await deleteTeam(groupId);
          toast.success('팀을 삭제했습니다.');

          const nextGroupId = myGroups.find((group) => group.id !== groupId)?.id;
          router.push(nextGroupId ? ROUTES.team(nextGroupId) : ROUTES.NO_TEAM);
        }}
      />
    ));
  };

  const openRemoveMemberModal = (member: TeamPageMember) => {
    overlay.open(({ isOpen, close }) => (
      <ConfirmModal
        isOpen={isOpen}
        onClose={close}
        title="멤버 내보내기"
        description={`${member.name}님을 팀에서 내보내시겠어요?\n내보낸 멤버는 초대 링크로 다시 참여할 수 있습니다.`}
        confirmLabel="내보내기"
        loadingLabel="내보내는 중"
        onConfirm={async () => {
          await deleteTeamMember({ groupId, memberUserId: member.id });
          toast.success(`${member.name}님을 팀에서 내보냈습니다.`);
        }}
      />
    ));
  };

  const openCreateTaskListModal = () => {
    overlay.open(({ isOpen, close }) => (
      <TaskListNameModal mode="create" isOpen={isOpen} onClose={close} groupId={groupId} />
    ));
  };

  return {
    openInviteModal,
    goToEditTeam,
    openDeleteTeamModal,
    openRemoveMemberModal,
    openCreateTaskListModal,
  };
};
