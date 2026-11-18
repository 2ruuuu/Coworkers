'use client';

import { toast } from 'react-hot-toast';

import type { Task } from '@/apis/task/type';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { useDeleteTaskMutation } from '@/queries/task/queries';

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  groupId: number;
  taskListId: number;
}

const DeleteTaskModal = ({ isOpen, onClose, task, groupId, taskListId }: DeleteTaskModalProps) => {
  const { mutateAsync: deleteTask } = useDeleteTaskMutation();

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title={`'${task.name}' 할 일을 정말 삭제하시겠어요?`}
      description="삭제 후에는 되돌릴 수 없습니다."
      confirmLabel="삭제하기"
      loadingLabel="삭제 중"
      cancelLabel="닫기"
      onConfirm={async () => {
        await deleteTask({ groupId, taskListId, taskId: task.id });
        toast.success('할 일을 삭제했습니다.');
      }}
    />
  );
};

export default DeleteTaskModal;
