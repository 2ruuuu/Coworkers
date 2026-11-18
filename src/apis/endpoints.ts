import { withQuery } from '@/lib/apiUrl';

type Id = number | string;

/**
 * 백엔드 API 경로를 한 곳에서 관리한다.
 * 서버(serverFetcher), BFF(/api/...), 클라이언트(publicFetcher) 모두 이 경로를 사용한다.
 */
export const ENDPOINTS = {
  auth: {
    signUp: '/auth/signUp',
    signIn: '/auth/signIn',
    signInWithOAuth: (provider: string) => `/auth/signIn/${provider}`,
  },
  user: {
    me: '/user',
    groups: '/user/groups',
    history: '/user/history',
    password: '/user/password',
    sendResetPasswordEmail: '/user/send-reset-password-email',
    resetPassword: '/user/reset-password',
  },
  group: {
    root: '/groups',
    detail: (groupId: Id) => `/groups/${groupId}`,
    tasks: (groupId: Id, date?: string) => withQuery(`/groups/${groupId}/tasks`, { date }),
    invitation: (groupId: Id) => `/groups/${groupId}/invitation`,
    acceptInvitation: '/groups/accept-invitation',
    member: (groupId: Id, memberUserId: Id) => `/groups/${groupId}/member/${memberUserId}`,
  },
  taskList: {
    root: (groupId: Id) => `/groups/${groupId}/task-lists`,
    detail: (groupId: Id, taskListId: Id, date?: string) =>
      withQuery(`/groups/${groupId}/task-lists/${taskListId}`, { date }),
  },
  task: {
    list: (groupId: Id, taskListId: Id, date?: string) =>
      withQuery(`/groups/${groupId}/task-lists/${taskListId}/tasks`, { date }),
    detail: (groupId: Id, taskListId: Id, taskId: Id) =>
      `/groups/${groupId}/task-lists/${taskListId}/tasks/${taskId}`,
    recurring: (groupId: Id, taskListId: Id) =>
      `/groups/${groupId}/task-lists/${taskListId}/recurring`,
    recurringDetail: (groupId: Id, taskListId: Id, recurringId: Id) =>
      `/groups/${groupId}/task-lists/${taskListId}/recurring/${recurringId}`,
  },
  taskComment: {
    list: (taskId: Id) => `/tasks/${taskId}/comments`,
    detail: (taskId: Id, commentId: Id) => `/tasks/${taskId}/comments/${commentId}`,
  },
  article: {
    list: '/articles',
    detail: (articleId: Id) => `/articles/${articleId}`,
    like: (articleId: Id) => `/articles/${articleId}/like`,
    comments: (articleId: Id, query: { limit: number; cursor?: number | null }) =>
      withQuery(`/articles/${articleId}/comments`, query),
    createComment: (articleId: Id) => `/articles/${articleId}/comments`,
    comment: (commentId: Id) => `/comments/${commentId}`,
  },
  image: {
    upload: '/images/upload',
  },
} as const;
