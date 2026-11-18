import type { Task } from '@/apis/task/type';

/** 할 일 목록 (생성/수정 응답에는 tasks가 없다) */
export interface TaskListSummary {
  id: number;
  name: string;
  groupId: number;
  displayIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskList extends TaskListSummary {
  tasks: Task[];
}

export interface CreateTaskListParams {
  groupId: number;
  name: string;
}

export interface UpdateTaskListNameParams {
  groupId: number;
  taskListId: number;
  name: string;
}

export interface DeleteTaskListParams {
  groupId: number;
  taskListId: number;
}
