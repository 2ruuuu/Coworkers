'use client';

import { type FormEvent, useState } from 'react';

import { toast } from 'react-hot-toast';

import Input from '@/components/input/Input';
import Modal from '@/components/modal/Modal';
import { useCreateTaskListMutation, useUpdateTaskListMutation } from '@/queries/taskList/queries';

type TaskListNameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
} & ({ mode: 'create' } | { mode: 'edit'; taskListId: number; initialName: string });

/** 할 일 목록 만들기/이름 수정 모달 (팀 페이지와 할 일 페이지에서 공용) */
const TaskListNameModal = (props: TaskListNameModalProps) => {
  const { isOpen, onClose, groupId, mode } = props;
  const [name, setName] = useState(mode === 'edit' ? props.initialName : '');
  const createMutation = useCreateTaskListMutation();
  const updateMutation = useUpdateTaskListMutation();

  const trimmedName = name.trim();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const isUnchanged = mode === 'edit' && trimmedName === props.initialName;

  const handleSubmit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!trimmedName || isPending || isUnchanged) return;

    const onSuccess = () => {
      toast.success(mode === 'create' ? '할 일 목록을 만들었습니다.' : '목록 이름을 수정했습니다.');
      onClose();
    };

    if (mode === 'create') {
      createMutation.mutate({ groupId, name: trimmedName }, { onSuccess });
    } else {
      updateMutation.mutate(
        { groupId, taskListId: props.taskListId, name: trimmedName },
        { onSuccess },
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="할 일 목록"
      size="md"
      primaryAction={{
        label: mode === 'create' ? '만들기' : '수정하기',
        loadingLabel: mode === 'create' ? '생성 중' : '수정 중',
        onClick: () => handleSubmit(),
        disabled: !trimmedName || isUnchanged,
        isLoading: isPending,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Input
          aria-label="할 일 목록 이름"
          placeholder="목록 명을 입력해주세요."
          maxLength={30}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </form>
    </Modal>
  );
};

export default TaskListNameModal;
