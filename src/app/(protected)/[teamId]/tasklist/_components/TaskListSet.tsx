'use client';

import { overlay } from 'overlay-kit';

import type { TaskList } from '@/apis/taskList/type';
import KebabIcon from '@/assets/icons/kebab.svg?react';
import PlusIcon from '@/assets/icons/plus.svg?react';
import BadgeDone from '@/components/badgeDone/BadgeDone';
import Button from '@/components/button/Button';
import Dropdown from '@/components/dropdown/Dropdown';
import DropdownSelect from '@/components/dropdown/DropdownSelect';
import DeleteTaskListModal from '@/components/taskList/DeleteTaskListModal';
import TaskListNameModal from '@/components/taskList/TaskListNameModal';
import { EDIT_DELETE_OPTIONS, type EditDeleteValue } from '@/constants/listItem';
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { cn } from '@/utils/cn';
import { getBadgeStatus, isTaskDone } from '@/utils/task';

interface TaskListSetProps {
  taskLists: TaskList[];
  selectedTaskListId?: number;
  groupId: number;
}

const TaskListSet = ({ taskLists, selectedTaskListId, groupId }: TaskListSetProps) => {
  const { setSearchParams } = useCustomSearchParams();

  const selectTaskList = (taskListId: number | undefined) => {
    setSearchParams({ taskListId });
  };

  const openAddModal = () => {
    overlay.open(({ isOpen, close }) => (
      <TaskListNameModal mode="create" isOpen={isOpen} onClose={close} groupId={groupId} />
    ));
  };

  const handleMenuSelect = (taskList: TaskList, value: EditDeleteValue) => {
    if (value === 'EDIT') {
      overlay.open(({ isOpen, close }) => (
        <TaskListNameModal
          mode="edit"
          isOpen={isOpen}
          onClose={close}
          groupId={groupId}
          taskListId={taskList.id}
          initialName={taskList.name}
        />
      ));
      return;
    }

    overlay.open(({ isOpen, close }) => (
      <DeleteTaskListModal
        isOpen={isOpen}
        onClose={close}
        groupId={groupId}
        taskListId={taskList.id}
        taskListName={taskList.name}
        onDeleted={() => {
          // 보고 있던 목록을 지웠다면 남은 첫 번째 목록으로 이동한다.
          if (taskList.id === selectedTaskListId) {
            selectTaskList(taskLists.find((list) => list.id !== taskList.id)?.id);
          }
        }}
      />
    ));
  };

  const taskListOptions = taskLists.map((taskList) => ({
    label: taskList.name,
    value: String(taskList.id),
  }));

  return (
    <>
      {/* mobile, tablet */}
      <div className="flex flex-col gap-2 xl:hidden">
        <h2 className="text-text-default text-xs font-semibold md:text-lg">할 일</h2>
        <div className="flex w-full items-center justify-between">
          {taskLists.length > 0 && (
            <DropdownSelect
              label="할 일 목록"
              options={taskListOptions}
              value={selectedTaskListId ? String(selectedTaskListId) : undefined}
              onChange={(value) => selectTaskList(Number(value))}
            />
          )}
          <Button
            variant="secondary-whiteFilled"
            icon={<PlusIcon width={16} height={16} aria-hidden="true" />}
            onClick={openAddModal}
          >
            할 일 목록 추가
          </Button>
        </div>
      </div>

      {/* desktop */}
      <nav aria-label="할 일 목록" className="hidden flex-col gap-8 xl:flex">
        <h2 className="text-xl font-semibold">할 일 목록</h2>
        <ul className="flex flex-col items-center gap-1">
          {taskLists.map((taskList) => {
            const isSelected = taskList.id === selectedTaskListId;
            const doneCount = taskList.tasks.filter(isTaskDone).length;

            return (
              <li
                key={taskList.id}
                className={cn(
                  'border-border-primary bg-background-primary relative flex h-[54px] w-[270px] items-center justify-between rounded-xl border text-lg font-semibold',
                  isSelected ? 'border-brand-primary' : 'text-text-default',
                )}
              >
                <button
                  type="button"
                  aria-current={isSelected ? 'page' : undefined}
                  className="focus-visible:ring-brand-primary h-full min-w-0 flex-1 truncate rounded-xl px-4 text-left outline-none focus-visible:ring-2"
                  onClick={() => selectTaskList(taskList.id)}
                >
                  {taskList.name}
                </button>
                <div className="flex shrink-0 items-center justify-center pr-4">
                  <BadgeDone
                    className="min-w-10 overflow-visible border-0 bg-transparent p-0 shadow-none [&_svg]:size-4.5 [&_svg]:overflow-visible"
                    total={taskList.tasks.length}
                    current={doneCount}
                    status={getBadgeStatus(doneCount, taskList.tasks.length)}
                  />
                  <Dropdown
                    options={EDIT_DELETE_OPTIONS}
                    onSelect={(value) => handleMenuSelect(taskList, value)}
                    trigger={
                      <KebabIcon width={24} height={24} viewBox="0 0 16 16" aria-hidden="true" />
                    }
                    triggerLabel={`${taskList.name} 목록 설정 열기`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <Button
          variant="secondary-whiteFilled"
          className="w-fit self-center"
          icon={<PlusIcon width={16} height={16} aria-hidden="true" />}
          onClick={openAddModal}
        >
          할 일 목록 추가
        </Button>
      </nav>
    </>
  );
};

export default TaskListSet;
