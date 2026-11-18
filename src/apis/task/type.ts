import type { UserSummary } from '@/apis/user/type';

export type FrequencyType = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface TaskListPathParams {
  groupId: number;
  taskListId: number;
}

export interface TaskDetailPathParams extends TaskListPathParams {
  taskId: number;
}

export interface GetTasksRequest extends TaskListPathParams {
  date?: string;
}

export interface UpdateTaskRequest extends TaskDetailPathParams {
  name?: string;
  description?: string;
  done?: boolean;
}

export interface Task {
  doneBy: { user: UserSummary | null } | null;
  writer: UserSummary | null;
  displayIndex: number;
  commentCount: number;
  deletedAt: string | null;
  recurringId: number;
  frequency: FrequencyType;
  updatedAt: string;
  doneAt: string | null;
  startDate: string | null;
  date: string | null;
  description: string | null;
  name: string;
  id: number;
}
