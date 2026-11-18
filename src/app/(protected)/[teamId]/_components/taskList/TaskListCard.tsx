'use client';

import Link from 'next/link';

import { overlay } from 'overlay-kit';

import KebabIcon from '@/assets/icons/kebab.svg?react';
import BadgeDone from '@/components/badgeDone/BadgeDone';
import Dropdown from '@/components/dropdown/Dropdown';
import TaskCheckbox from '@/components/taskCheckbox/TaskCheckbox';
import DeleteTaskListModal from '@/components/taskList/DeleteTaskListModal';
import TaskListNameModal from '@/components/taskList/TaskListNameModal';
import { EDIT_DELETE_OPTIONS, type EditDeleteValue } from '@/constants/listItem';
import { ROUTES } from '@/constants/routes';
import { withQuery } from '@/lib/apiUrl';
import { useUpdateTaskMutation } from '@/queries/task/queries';
import { getBadgeStatus } from '@/utils/task';

import type { TaskListItem } from '../../type';

interface TaskListCardProps {
  item: TaskListItem;
  groupId: number;
}

export default function TaskListCard({ item, groupId }: TaskListCardProps) {
  const { mutate: updateTask } = useUpdateTaskMutation();
  const taskListHref = withQuery(ROUTES.taskList(groupId), {
    taskListId: item.id,
    date: item.date,
  });

  const handleMenuItemSelect = (value: EditDeleteValue) => {
    if (value === 'EDIT') {
      overlay.open(({ isOpen, close }) => (
        <TaskListNameModal
          mode="edit"
          isOpen={isOpen}
          onClose={close}
          groupId={groupId}
          taskListId={item.id}
          initialName={item.title}
        />
      ));
      return;
    }

    overlay.open(({ isOpen, close }) => (
      <DeleteTaskListModal
        isOpen={isOpen}
        onClose={close}
        groupId={groupId}
        taskListId={item.id}
        taskListName={item.title}
      />
    ));
  };

  return (
    <article className="border-border-primary bg-background-primary hover:border-brand-primary/40 focus-within:ring-brand-primary/30 relative h-37.75 overflow-visible rounded-xl border px-5 pt-5 pb-4 shadow-sm transition-all duration-200 focus-within:ring-2 hover:-translate-y-0.5 hover:shadow-md has-[[role=menu]]:z-20">
      {/* 카드 전체를 덮는 링크. 체크박스와 메뉴는 그 위(z-10)에 올려 따로 조작할 수 있다. */}
      <Link
        href={taskListHref}
        className="absolute inset-0 z-0 rounded-xl outline-none"
        draggable={false}
        onDragStart={(event) => event.preventDefault()}
        aria-label={`${item.title} 할 일 목록으로 이동`}
      />

      <div className="pointer-events-none relative z-10 flex items-start justify-between gap-3">
        <h4 className="text-text-primary min-w-0 truncate text-sm font-semibold">{item.title}</h4>

        <div className="flex shrink-0 items-center gap-1.5">
          <BadgeDone
            status={getBadgeStatus(item.doneCount, item.totalCount)}
            current={item.doneCount}
            total={item.totalCount}
            className="min-w-10 overflow-visible border-0 bg-transparent p-0 shadow-none [&_svg]:size-4.5 [&_svg]:overflow-visible"
          />
          <Dropdown
            options={EDIT_DELETE_OPTIONS}
            size="sm"
            onSelect={handleMenuItemSelect}
            trigger={<KebabIcon className="size-4" aria-hidden="true" />}
            triggerLabel={`${item.title} 메뉴 열기`}
            triggerClassName="text-icon-primary hover:bg-background-secondary hover:text-brand-primary size-5 rounded transition-colors active:scale-95"
            className="pointer-events-auto"
          />
        </div>
      </div>

      <ul className="pointer-events-none relative z-10 mt-5 flex flex-col gap-2 [&_label]:min-w-0 [&_span]:block [&_span]:truncate [&_span]:text-xs">
        {item.tasks.map((task) => (
          <li key={task.id} className="pointer-events-auto">
            <TaskCheckbox
              task={task.title}
              checked={task.done}
              onChange={(checked) =>
                updateTask({ groupId, taskListId: item.id, taskId: task.id, done: checked })
              }
            />
          </li>
        ))}
      </ul>
    </article>
  );
}
