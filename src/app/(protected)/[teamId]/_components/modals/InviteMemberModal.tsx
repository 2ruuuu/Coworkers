'use client';

import { toast } from 'react-hot-toast';

import Modal from '@/components/modal/Modal';
import { useTeamInvitationMutation } from '@/queries/team/queries';
import { createJoinTeamLink } from '@/utils/team/invitation';

interface InviteMemberModalProps {
  isOpen: boolean;
  groupId: number;
  onClose: () => void;
}

const InviteMemberModal = ({ isOpen, groupId, onClose }: InviteMemberModalProps) => {
  const { mutateAsync: getInvitation, isPending } = useTeamInvitationMutation();

  const handleCopyInviteLink = async () => {
    if (isPending) return;

    if (!navigator.clipboard) {
      toast.error('클립보드를 사용할 수 없습니다.');
      return;
    }

    try {
      const joinTeamLink = createJoinTeamLink(await getInvitation(groupId), window.location.origin);

      if (!joinTeamLink) {
        toast.error('초대 링크를 불러오지 못했습니다.');
        return;
      }

      await navigator.clipboard.writeText(joinTeamLink);
      toast.success('초대 링크가 클립보드에 복사되었습니다.');
      onClose();
    } catch {
      // 초대 링크 발급 실패는 mutation 전역 토스트가 안내한다.
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="멤버 초대"
      description="그룹에 참여할 수 있는 링크를 복사합니다."
      primaryAction={{
        label: '링크 복사하기',
        loadingLabel: '복사 중',
        onClick: handleCopyInviteLink,
        isLoading: isPending,
      }}
      size="md"
      onClose={onClose}
    />
  );
};

export default InviteMemberModal;
