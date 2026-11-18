import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  changePasswordAction,
  deleteMyAccountAction,
  updateMyProfileAction,
  uploadImageAction,
} from '@/actions/user.action';
import { ENDPOINTS } from '@/apis/endpoints';
import type { Group, Profile } from '@/apis/user/type';
import { unwrapActionResult } from '@/lib/action';
import { bffGet } from '@/lib/bffFetcher';
import { queryKeys } from '@/queries/queryKeys';
import { useActionMutation } from '@/queries/useActionMutation';

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: queryKeys.user.me(),
      queryFn: () => bffGet<Profile>(ENDPOINTS.user.me),
      staleTime: 5 * 60 * 1000,
    }),
  groups: () =>
    queryOptions({
      queryKey: queryKeys.user.groups(),
      queryFn: () => bffGet<Group[]>(ENDPOINTS.user.groups),
    }),
};

export const useUpdateMyProfileMutation = () => {
  const queryClient = useQueryClient();

  return useActionMutation(updateMyProfileAction, {
    // 사이드바/헤더의 프로필도 같은 키를 사용하므로 함께 갱신된다.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.user.all }),
    meta: { silentError: true },
  });
};

export const useChangePasswordMutation = () => {
  return useActionMutation(changePasswordAction, {
    meta: { silentError: true },
  });
};

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      return unwrapActionResult(await uploadImageAction(formData));
    },
    meta: { silentError: true },
  });
};

export const useDeleteMyAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => unwrapActionResult(await deleteMyAccountAction()),
    onSuccess: () => queryClient.clear(),
    meta: { silentError: true },
  });
};
