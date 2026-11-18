import type { TaskList } from '@/apis/taskList/type';
import type { Member } from '@/apis/user/type';

export interface GroupDetail {
  id: number;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  teamId: string;
  members: Member[];
  taskLists: TaskList[];
}
