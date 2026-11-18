import 'server-only';

import { ENDPOINTS } from '@/apis/endpoints';
import type { Task } from '@/apis/task/type';
import { serverFetcher } from '@/lib/serverFetcher';

import type { GroupDetail } from './type';

export const getGroupServer = async (groupId: number) => {
  return serverFetcher<GroupDetail>(ENDPOINTS.group.detail(groupId));
};

export const getGroupTasksServer = async (groupId: number, date?: string) => {
  return serverFetcher<Task[]>(ENDPOINTS.group.tasks(groupId, date));
};

export const createGroupServer = async (body: { name: string; image?: string }) => {
  return serverFetcher<GroupDetail>(ENDPOINTS.group.root, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const updateGroupServer = async (
  groupId: number,
  body: { name: string; image?: string },
) => {
  return serverFetcher<GroupDetail>(ENDPOINTS.group.detail(groupId), {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

export const deleteGroupServer = async (groupId: number) => {
  return serverFetcher<void>(ENDPOINTS.group.detail(groupId), { method: 'DELETE' });
};

export const deleteGroupMemberServer = async (groupId: number, memberUserId: number) => {
  return serverFetcher<void>(ENDPOINTS.group.member(groupId, memberUserId), { method: 'DELETE' });
};

export const getGroupInvitationServer = async (groupId: number) => {
  return serverFetcher<string>(ENDPOINTS.group.invitation(groupId));
};

export const acceptGroupInvitationServer = async (body: { userEmail: string; token: string }) => {
  return serverFetcher<{ groupId: number }>(ENDPOINTS.group.acceptInvitation, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};
