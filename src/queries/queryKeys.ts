import type { ArticleOrder } from '@/apis/article/type';

/**
 * 모든 React Query 키를 한 곳에서 관리한다.
 * 상위 키(all, lists 등)로 invalidate하면 하위 키가 모두 무효화된다.
 */
export const queryKeys = {
  user: {
    all: ['user'] as const,
    me: () => [...queryKeys.user.all, 'me'] as const,
    groups: () => [...queryKeys.user.all, 'groups'] as const,
  },
  group: {
    all: ['group'] as const,
    detail: (groupId: number) => [...queryKeys.group.all, groupId] as const,
  },
  teamPage: {
    all: ['team-page'] as const,
    group: (groupId: number) => [...queryKeys.teamPage.all, groupId] as const,
    detail: (groupId: number, date: string) =>
      [...queryKeys.teamPage.group(groupId), date] as const,
  },
  task: {
    all: ['task'] as const,
    lists: () => [...queryKeys.task.all, 'list'] as const,
    listOf: (groupId: number, taskListId: number) =>
      [...queryKeys.task.lists(), groupId, taskListId] as const,
    list: (groupId: number, taskListId: number, date: string) =>
      [...queryKeys.task.listOf(groupId, taskListId), date] as const,
    details: () => [...queryKeys.task.all, 'detail'] as const,
    detail: (taskId: number) => [...queryKeys.task.details(), taskId] as const,
  },
  taskComment: {
    all: ['task-comment'] as const,
    list: (taskId: number) => [...queryKeys.taskComment.all, taskId] as const,
  },
  article: {
    all: ['article'] as const,
    lists: () => [...queryKeys.article.all, 'list'] as const,
    list: (params: { page: number; orderBy: ArticleOrder; keyword?: string; pageSize: number }) =>
      [...queryKeys.article.lists(), params] as const,
    best: (pageSize: number) => [...queryKeys.article.all, 'best', pageSize] as const,
    comments: (articleId: string) => [...queryKeys.article.all, 'comments', articleId] as const,
  },
} as const;
