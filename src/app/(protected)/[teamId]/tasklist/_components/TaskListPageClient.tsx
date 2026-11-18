'use client';

import { useQuery } from '@tanstack/react-query';

import { groupQueries } from '@/queries/group/queries';

import TaskListHeader from './TaskListHeader';
import TaskListMain from './TaskListMain';
import TaskListSet from './TaskListSet';

interface TaskListPageClientProps {
  groupId: number;
  /** 목록이 하나도 없으면 undefined */
  taskListId?: number;
}

const TaskListPageClient = ({ groupId, taskListId }: TaskListPageClientProps) => {
  // 서버 페이지에서 미리 채운 캐시를 사용한다.
  const { data: group } = useQuery(groupQueries.detail(groupId));

  if (!group) return null;

  const selectedTaskList = group.taskLists.find((taskList) => taskList.id === taskListId);

  return (
    <div className="flex flex-col gap-5 p-4 md:gap-7 md:px-6 md:py-17.5 xl:px-30 xl:py-30">
      {selectedTaskList && (
        <TaskListHeader
          name={selectedTaskList.name}
          groupId={groupId}
          taskListId={selectedTaskList.id}
        />
      )}
      <div className="flex flex-col gap-6 xl:flex-row">
        <TaskListSet
          taskLists={group.taskLists}
          selectedTaskListId={selectedTaskList?.id}
          groupId={groupId}
        />
        <div className="flex-1">
          {selectedTaskList ? (
            <TaskListMain
              taskListId={selectedTaskList.id}
              groupId={groupId}
              taskListName={selectedTaskList.name}
            />
          ) : (
            <p className="bg-background-primary text-text-default flex min-h-60 items-center justify-center rounded-[20px] text-sm">
              아직 할 일 목록이 없어요. 목록을 먼저 추가해주세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskListPageClient;
