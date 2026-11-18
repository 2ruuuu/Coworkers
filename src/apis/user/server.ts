import 'server-only';

import { ENDPOINTS } from '@/apis/endpoints';
import { serverFetcher } from '@/lib/serverFetcher';

import type {
  ChangePasswordRequest,
  Group,
  MessageResponse,
  Profile,
  TaskHistoryResponse,
  UpdateProfileRequest,
} from './type';

export const getMyProfileServer = async () => {
  return serverFetcher<Profile>(ENDPOINTS.user.me);
};

export const getMyGroupsServer = async () => {
  return serverFetcher<Group[]>(ENDPOINTS.user.groups);
};

export const getMyTaskHistoryServer = async () => {
  return serverFetcher<TaskHistoryResponse>(ENDPOINTS.user.history);
};

export const updateMyProfileServer = async (body: UpdateProfileRequest) => {
  return serverFetcher<MessageResponse>(ENDPOINTS.user.me, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

export const changePasswordServer = async (body: ChangePasswordRequest) => {
  return serverFetcher<MessageResponse>(ENDPOINTS.user.password, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
};

export const deleteMyAccountServer = async () => {
  return serverFetcher<MessageResponse>(ENDPOINTS.user.me, { method: 'DELETE' });
};
