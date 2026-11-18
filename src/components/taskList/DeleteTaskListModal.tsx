'use client';

import { toast } from 'react-hot-toast';

import ConfirmModal from '@/components/modal/ConfirmModal';
import { useDeleteTaskListMutation } from '@/queries/taskList/queries';

interface DeleteTaskListModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  taskListId: number;
  taskListName: string;
  onDeleted?: () => void;
}

const DeleteTaskListModal = ({
  isOpen,
  onClose,
  groupId,
  taskListId,
  taskListName,
  onDeleted,
}: DeleteTaskListModalProps) => {
  const { mutateAsync: deleteTaskList } = useDeleteTaskListMutation();

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title={`'${taskListName}' 할 일 목록을 정말 삭제하시겠어요?`}
      description="삭제 후에는 되돌릴 수 없습니다."
      confirmLabel="삭제하기"
      loadingLabel="삭제 중"
      onConfirm={async () => {
        await deleteTaskList({ groupId, taskListId });
        toast.success('할 일 목록을 삭제했습니다.');
        onDeleted?.();
      }}
    />
  );
};

export default DeleteTaskListModal;
