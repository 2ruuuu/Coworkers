import { queryOptions } from '@tanstack/react-query';

import { ENDPOINTS } from '@/apis/endpoints';
import type { GroupDetail } from '@/apis/group/type';
import { bffGet } from '@/lib/bffFetcher';
import { queryKeys } from '@/queries/queryKeys';

export const groupQueries = {
  detail: (groupId: number) =>
    queryOptions({
      queryKey: queryKeys.group.detail(groupId),
      queryFn: () => bffGet<GroupDetail>(ENDPOINTS.group.detail(groupId)),
    }),
};
