'use client';

import { useEffect, useId, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';

import type { Task } from '@/apis/task/type';
import CalendarIcon from '@/assets/icons/calendar.svg?react';
import CheckIcon from '@/assets/icons/check_blue.svg?react';
import KebabIcon from '@/assets/icons/kebab.svg?react';
import RepeatIcon from '@/assets/icons/repeat.svg?react';
import XIcon from '@/assets/icons/x.svg?react';
import Button from '@/components/button/Button';
import Dropdown from '@/components/dropdown/Dropdown';
import Profile from '@/components/profile/Profile';
import { EDIT_DELETE_OPTIONS, FREQUENCY_TEXT } from '@/constants/listItem';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { taskQueries, useUpdateTaskMutation } from '@/queries/task/queries';
import { cn } from '@/utils/cn';
import { formatYearMonthDay } from '@/utils/date';
import { isTaskDone } from '@/utils/task';

import TaskComments from './TaskComments';

interface InfoOverlayProps {
  groupId: number;
  taskListId: number;
  taskId: number;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/** 할 일 상세 패널. 오른쪽에서 열리는 대화상자이며 Escape나 바깥 클릭으로 닫힌다. */
const InfoOverlay = ({
  groupId,
  taskListId,
  taskId,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: InfoOverlayProps) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { data: task } = useQuery(taskQueries.detail({ groupId, taskListId, taskId }));
  const { mutate: updateTask, isPending: isToggling } = useUpdateTaskMutation();

  useOutsideClick(panelRef, onClose);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const isDone = isTaskDone(task);
  const startDate = task.startDate ? new Date(task.startDate) : null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="bg-background-primary fixed inset-0 top-16 z-200 overflow-y-auto px-4 py-3 shadow-xl md:top-0 md:left-1/2 md:px-7 md:py-10 xl:px-10"
    >
      <div className="mb-10 md:mb-14 xl:mb-17">
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="할 일 상세 닫기"
          className="focus-visible:ring-brand-primary mb-4 rounded outline-none focus-visible:ring-2 md:mb-17.5"
          onClick={onClose}
        >
          <XIcon aria-hidden="true" />
        </button>

        <div className="text-text-primary flex items-center justify-between pb-4">
          <div className="flex gap-4">
            <h2
              id={titleId}
              className={cn(
                'text-xl font-semibold md:text-2xl',
                isDone && 'text-text-default line-through',
              )}
            >
              {task.name}
            </h2>
            {isDone && (
              <span className="bg-brand-secondary text-brand-primary rounded-lg px-2.5 py-1.5 text-lg font-semibold">
                완료
              </span>
            )}
          </div>

          <Dropdown
            options={EDIT_DELETE_OPTIONS}
            onSelect={(value) => (value === 'EDIT' ? onEdit(task) : onDelete(task))}
            trigger={<KebabIcon aria-hidden="true" />}
            triggerLabel="할 일 메뉴"
          />
        </div>

        <div className="flex items-center gap-2 pb-4">
          <Profile
            src={task.writer?.image}
            alt={`${task.writer?.nickname ?? '알 수 없음'} 프로필`}
          />
          <span className="text-md font-medium">{task.writer?.nickname ?? '알 수 없음'}</span>
        </div>

        <div className="flex items-center justify-between">
          <dl className="flex flex-col gap-2 text-xs">
            <div className="flex gap-3">
              <dt className="text-text-default flex w-[82px] items-center gap-1.5">
                <CalendarIcon aria-hidden="true" />
                시작 날짜
              </dt>
              <dd className="text-text-primary flex items-center">
                {startDate ? formatYearMonthDay(startDate) : '-'}
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="text-text-default flex w-[82px] items-center gap-1.5">
                <RepeatIcon aria-hidden="true" />
                반복 설정
              </dt>
              <dd className="text-text-primary flex items-center">
                {FREQUENCY_TEXT[task.frequency]}
              </dd>
            </div>
          </dl>

          <div className="fixed right-4 bottom-6 z-10 md:static md:right-0 md:bottom-0">
            <Button
              icon={
                <CheckIcon className={isDone ? '' : '[&_path]:stroke-white'} aria-hidden="true" />
              }
              variant={isDone ? 'secondary-whiteFilled' : 'secondary-filled'}
              disabled={isToggling}
              onClick={() => updateTask({ groupId, taskListId, taskId, done: !isDone })}
            >
              {isDone ? '완료 취소하기' : '완료하기'}
            </Button>
          </div>
        </div>

        <div className="border-border-primary my-6 border-t" />

        <p className="text-md text-text-primary font-normal whitespace-pre-line">
          {task.description}
        </p>
      </div>

      <TaskComments taskId={task.id} />
    </div>
  );
};

export default InfoOverlay;
