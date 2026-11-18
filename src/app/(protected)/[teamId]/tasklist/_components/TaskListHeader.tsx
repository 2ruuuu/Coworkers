'use client';

import { overlay } from 'overlay-kit';

import SettingIcon from '@/assets/icons/setting.svg?react';
import Dropdown from '@/components/dropdown/Dropdown';
import DeleteTaskListModal from '@/components/taskList/DeleteTaskListModal';
import TaskListNameModal from '@/components/taskList/TaskListNameModal';
import { EDIT_DELETE_OPTIONS, type EditDeleteValue } from '@/constants/listItem';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';

interface TaskListHeaderProps {
  name: string;
  groupId: number;
  taskListId: number;
}

const TaskListHeader = ({ name, groupId, taskListId }: TaskListHeaderProps) => {
  const { setSearchParams } = useCustomSearchParams();

  const handleMenuSelect = (value: EditDeleteValue) => {
    if (value === 'EDIT') {
      overlay.open(({ isOpen, close }) => (
        <TaskListNameModal
          mode="edit"
          isOpen={isOpen}
          onClose={close}
          groupId={groupId}
          taskListId={taskListId}
          initialName={name}
        />
      ));
      return;
    }

    overlay.open(({ isOpen, close }) => (
      <DeleteTaskListModal
        isOpen={isOpen}
        onClose={close}
        groupId={groupId}
        taskListId={taskListId}
        taskListName={name}
        // 보고 있던 목록이 사라지면 서버 페이지가 첫 번째 목록으로 다시 정리한다.
        onDeleted={() => setSearchParams({ taskListId: undefined })}
      />
    ));
  };

  return (
    <div className="text-text-primary xl:outline-border-primary xl:bg-background-primary flex items-center gap-2 rounded-xl bg-transparent text-center text-2xl font-semibold xl:w-full xl:justify-between xl:px-6 xl:py-4.5 xl:outline">
      <h1>{name}</h1>
      <Dropdown
        options={EDIT_DELETE_OPTIONS}
        onSelect={handleMenuSelect}
        trigger={<SettingIcon className="size-6" aria-hidden="true" />}
        triggerLabel={`${name} 목록 설정`}
      />
    </div>
  );
};

export default TaskListHeader;
