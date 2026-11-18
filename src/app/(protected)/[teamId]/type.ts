import type { MemberRole } from '@/apis/user/type';

export type TeamPageRole = MemberRole;
export type TaskStatus = 'today' | 'scheduled' | 'done';

export interface TeamPageMember {
  id: number;
  name: string;
  email: string;
  imageUrl: string | null;
  role: TeamPageRole;
}

export interface TeamPageTask {
  id: number;
  title: string;
  done: boolean;
}

export interface TaskListItem {
  id: number;
  title: string;
  status: TaskStatus;
  date?: string;
  doneCount: number;
  totalCount: number;
  tasks: TeamPageTask[];
}

export interface TaskStatusSection {
  status: TaskStatus;
  label: string;
}
