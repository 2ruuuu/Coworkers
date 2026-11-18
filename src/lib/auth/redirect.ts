import 'server-only';

import { getMyGroupsServer } from '@/apis/user/server';

const DEFAULT_REDIRECT_PATH = '/no-team';

/** 같은 사이트 내부 경로만 허용한다. (외부 URL, 프로토콜 상대 경로, 역슬래시 차단) */
export const getSafeRedirectPath = (redirectPath?: string | null): string | undefined => {
  if (
    !redirectPath ||
    !redirectPath.startsWith('/') ||
    redirectPath.startsWith('//') ||
    redirectPath.includes('\\')
  ) {
    return undefined;
  }

  return redirectPath;
};

/** 로그인 후 이동할 경로. 지정된 경로가 없으면 첫 번째 팀, 팀이 없으면 /no-team */
export const getPostLoginRedirectPath = async ({
  redirectPath,
}: {
  redirectPath?: string | null;
}): Promise<string> => {
  const safeRedirectPath = getSafeRedirectPath(redirectPath);

  if (safeRedirectPath) {
    return safeRedirectPath;
  }

  const groups = await getMyGroupsServer();
  const firstGroupId = groups[0]?.id;

  return firstGroupId ? `/${firstGroupId}` : DEFAULT_REDIRECT_PATH;
};
