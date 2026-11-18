'use client';

import { useQuery } from '@tanstack/react-query';
import { overlay } from 'overlay-kit';

import type { Task } from '@/apis/task/type';
import PlusIcon from '@/assets/icons/plus_white.svg?react';
import Button from '@/components/button/Button';
import ListItem from '@/components/listItem/ListItem';
import { useTaskDate } from '@/hooks/useTaskDate';
import { taskQueries, useUpdateTaskMutation } from '@/queries/task/queries';
import { addDays, formatISODate } from '@/utils/date';
import { isTaskDone } from '@/utils/task';

import InfoOverlay from './InfoOverlay';
import { TaskItemsSkeleton } from './TaskListPageSkeleton';
import TaskListTitle from './TaskListTitle';
import AddTaskModal from './modals/AddTaskModal';
import DeleteTaskModal from './modals/DeleteTaskModal';
import EditTaskModal from './modals/EditTaskModal';

interface TaskListMainProps {
  taskListId: number;
  groupId: number;
  taskListName: string;
}

const TaskListMain = ({ taskListId, groupId, taskListName }: TaskListMainProps) => {
  const { selectedDate, setDate } = useTaskDate();
  const { data: tasks = [], isPending } = useQuery(
    taskQueries.list({ groupId, taskListId, date: formatISODate(selectedDate) }),
  );
  const { mutate: updateTask } = useUpdateTaskMutation();

  const openEditModal = (task: Task) => {
    overlay.open(({ isOpen, close }) => (
      <EditTaskModal
        isOpen={isOpen}
        onClose={close}
        task={task}
        groupId={groupId}
        taskListId={taskListId}
      />
    ));
  };

  const openDeleteModal = (task: Task) => {
    overlay.open(({ isOpen, close }) => (
      <DeleteTaskModal
        isOpen={isOpen}
        onClose={close}
        task={task}
        groupId={groupId}
        taskListId={taskListId}
      />
    ));
  };

  const openDetail = (task: Task) => {
    overlay.open(({ isOpen, close }) => (
      <InfoOverlay
        groupId={groupId}
        taskListId={taskListId}
        taskId={task.id}
        isOpen={isOpen}
        onClose={close}
        // 상세 패널을 닫고 모달을 연다. (패널의 바깥 클릭 닫기와 겹치지 않도록)
        onEdit={(detail) => {
          close();
          openEditModal(detail);
        }}
        onDelete={(detail) => {
          close();
          openDeleteModal(detail);
        }}
      />
    ));
  };

  const openAddModal = () => {
    overlay.open(({ isOpen, close }) => (
      <AddTaskModal
        isOpen={isOpen}
        onClose={close}
        groupId={groupId}
        taskListId={taskListId}
        initialDate={selectedDate}
      />
    ));
  };

  return (
    <div className="bg-background-primary relative flex flex-col gap-10 rounded-[20px] p-4 md:p-7.5 xl:p-10">
      <TaskListTitle
        taskName={taskListName}
        onNextWeek={() => setDate(addDays(selectedDate, 7))}
        onPrevWeek={() => setDate(addDays(selectedDate, -7))}
        onToday={() => setDate(new Date())}
      />
      {isPending ? (
        <TaskItemsSkeleton />
      ) : tasks.length === 0 ? (
        <p className="text-text-default py-10 text-center text-sm">이 날짜에 할 일이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {tasks.map((task) => (
            <li key={task.id}>
              <ListItem
                task={task}
                onClick={() => openDetail(task)}
                onToggle={() =>
                  updateTask({ groupId, taskListId, taskId: task.id, done: !isTaskDone(task) })
                }
                onDelete={() => openDeleteModal(task)}
                onEdit={() => openEditModal(task)}
              />
            </li>
          ))}
        </ul>
      )}
      <div className="fixed right-5 bottom-5 xl:right-20 xl:bottom-20">
        <Button
          variant="icon-circle"
          icon={<PlusIcon className="size-6" aria-hidden="true" />}
          onClick={openAddModal}
          aria-label="할 일 추가하기"
        />
      </div>
    </div>
  );
};

export default TaskListMain;
