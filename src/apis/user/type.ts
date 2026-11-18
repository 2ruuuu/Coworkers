import type { FrequencyType } from '@/apis/task/type';

export interface UserSummary {
  id: number;
  nickname: string;
  image: string | null;
}

export interface User extends UserSummary {
  teamId: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: number;
  teamId: string;
  name: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MemberRole = 'ADMIN' | 'MEMBER';

/** 그룹 멤버 (GET /groups/:id 의 members) */
export interface Member {
  userId: number;
  groupId: number;
  userName: string;
  userEmail: string;
  userImage: string | null;
  role: MemberRole;
}

/** 내 멤버십 (GET /user 의 memberships) */
export interface Membership extends Member {
  group: Group;
}

/** GET /user 응답 */
export interface Profile extends User {
  memberships: Membership[];
}

export interface UpdateProfileRequest {
  nickname?: string;
  image?: string | null;
}

export interface TaskHistory {
  id: number;
  recurringId: number;
  writerId: number;
  userId: number;
  displayIndex: number;
  name: string;
  description: string;
  frequency: FrequencyType;
  date: string;
  doneAt: string;
  deletedAt: string | null;
  updatedAt: string;
}

export interface TaskHistoryResponse {
  tasksDone: TaskHistory[];
}

export interface SendPasswordResetEmailRequest {
  email: string;
  redirectUrl: string;
}

export interface ResetPasswordRequest {
  password: string;
  passwordConfirmation: string;
  token: string;
}

export interface ChangePasswordRequest {
  password: string;
  passwordConfirmation: string;
}

export interface MessageResponse {
  message: string;
}
