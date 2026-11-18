import type { User } from '@/apis/user/type';

export type SidebarGroup = {
  id: number;
  name: string;
  image?: string | null;
};

export interface SidebarProps {
  groups: SidebarGroup[];
  /** 아직 불러오는 중이면 undefined */
  user: User | undefined;
}
