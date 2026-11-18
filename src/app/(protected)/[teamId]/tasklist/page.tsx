import { notFound, redirect } from 'next/navigation';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { getGroupServer } from '@/apis/group/server';
import { getTasksServer } from '@/apis/task/server';
import { ROUTES } from '@/constants/routes';
import { withQuery } from '@/lib/apiUrl';
import { handleServerApiError } from '@/lib/auth/session';
import { ApiError } from '@/lib/error';
import { getQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/queries/queryKeys';
import { isoDateSchema, parsePositiveId } from '@/schemas/common.schema';
import { getServiceDate } from '@/utils/date';

import TaskListPageClient from './_components/TaskListPageClient';

interface TaskListPageProps {
  params: Promise<{ teamId: string }>;
  searchParams: Promise<{ taskListId?: string; date?: string }>;
}

const getGroupOrNotFound = async (groupId: number) => {
  try {
    return await getGroupServer(groupId);
  } catch (error) {
    if (error instanceof ApiError && [403, 404].includes(error.status)) {
      notFound();
    }
    return handleServerApiError(error);
  }
};

const TaskListPage = async ({ params, searchParams }: TaskListPageProps) => {
  const groupId = parsePositiveId((await params).teamId);
  const { taskListId: taskListIdParam, date: dateParam } = await searchParams;

  if (!groupId) {
    notFound();
  }

  const group = await getGroupOrNotFound(groupId);
  const requestedTaskListId = parsePositiveId(taskListIdParam);

  if (taskListIdParam && !group.taskLists.some((list) => list.id === requestedTaskListId)) {
    notFound();
  }

  // 날짜/목록이 비어 있거나 형식이 틀리면 기본값(오늘, 첫 번째 목록)으로 URL을 정리한다.
  const date = isoDateSchema.safeParse(dateParam).success ? dateParam! : getServiceDate();
  const taskListId = requestedTaskListId ?? group.taskLists[0]?.id;

  if (dateParam !== date || (taskListId && requestedTaskListId !== taskListId)) {
    redirect(withQuery(ROUTES.taskList(groupId), { date, taskListId }));
  }

  const queryClient = getQueryClient();
  queryClient.setQueryData(queryKeys.group.detail(groupId), group);

  if (taskListId) {
    const tasks = await getTasksServer({ groupId, taskListId, date }).catch(handleServerApiError);
    queryClient.setQueryData(queryKeys.task.list(groupId, taskListId, date), tasks);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskListPageClient groupId={groupId} taskListId={taskListId} />
    </HydrationBoundary>
  );
};

export default TaskListPage;
