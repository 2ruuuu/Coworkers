import { type QueryClient, queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createTeamAction,
  deleteTeamAction,
  deleteTeamMemberAction,
  getTeamInvitationAction,
  joinTeamAction,
  updateTeamAction,
} from '@/actions/team.action';
import type { TeamPageData } from '@/apis/teamPage/type';
import { unwrapActionResult } from '@/lib/action';
import { withQuery } from '@/lib/apiUrl';
import { getRouteJson } from '@/lib/bffFetcher';
import { queryKeys } from '@/queries/queryKeys';
import { useActionMutation } from '@/queries/useActionMutation';

export const teamQueries = {
  page: (groupId: number, date: string) =>
    queryOptions({
      queryKey: queryKeys.teamPage.detail(groupId, date),
      queryFn: () => getRouteJson<TeamPageData>(withQuery(`/api/team-page/${groupId}`, { date })),
    }),
};

/** 팀 목록·팀 페이지·그룹 상세처럼 팀 정보가 들어 있는 캐시를 모두 무효화한다. */
const invalidateTeamQueries = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.user.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.teamPage.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.group.all }),
  ]);

interface TeamFormVariables {
  name: string;
  imageFile: File | null;
}

const toTeamFormData = ({ name, imageFile }: TeamFormVariables) => {
  const formData = new FormData();
  formData.append('name', name);
  if (imageFile) formData.append('image', imageFile);
  return formData;
};

/** 팀 이름 중복 등 폼에서 에러를 직접 표시하므로 전역 토스트를 끈다. */
export const useCreateTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TeamFormVariables) =>
      unwrapActionResult(await createTeamAction(toTeamFormData(variables))),
    onSuccess: () => invalidateTeamQueries(queryClient),
    retry: false,
    meta: { silentError: true },
  });
};

export const useUpdateTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      currentImage,
      ...variables
    }: TeamFormVariables & { groupId: number; currentImage: string | null }) => {
      const formData = toTeamFormData(variables);
      formData.append('groupId', String(groupId));
      if (currentImage) formData.append('currentImage', currentImage);
      return unwrapActionResult(await updateTeamAction(formData));
    },
    onSuccess: () => invalidateTeamQueries(queryClient),
    retry: false,
    meta: { silentError: true },
  });
};

export const useJoinTeamMutation = () => {
  const queryClient = useQueryClient();

  return useActionMutation(joinTeamAction, {
    onSuccess: () => invalidateTeamQueries(queryClient),
    retry: false,
    meta: { silentError: true },
  });
};

export const useDeleteTeamMutation = () => {
  const queryClient = useQueryClient();

  return useActionMutation(deleteTeamAction, {
    onSuccess: () => invalidateTeamQueries(queryClient),
    retry: false,
    meta: { errorMessage: '팀을 삭제하지 못했습니다.' },
  });
};

export const useDeleteTeamMemberMutation = () => {
  const queryClient = useQueryClient();

  return useActionMutation(deleteTeamMemberAction, {
    onSuccess: (_data, { groupId }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.teamPage.group(groupId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.group.detail(groupId) }),
      ]),
    retry: false,
    meta: { errorMessage: '멤버를 내보내지 못했습니다.' },
  });
};

export const useTeamInvitationMutation = () => {
  return useActionMutation(getTeamInvitationAction, {
    retry: false,
    meta: { errorMessage: '초대 링크를 불러오지 못했습니다.' },
  });
};
