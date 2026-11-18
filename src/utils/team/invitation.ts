export const JOIN_TEAM_PATH = '/jointeam';

export interface Invitation {
  token: string;
  userEmail: string | null;
}

const toUrl = (value: string, base = 'http://localhost') => {
  try {
    return value.includes('://') ? new URL(value) : new URL(value, base);
  } catch {
    return null;
  }
};

/** URLSearchParams(또는 동등한 객체)에서 초대 정보(token, userEmail|email)를 읽는다. */
export const readInvitationParams = (params: {
  get: (key: string) => string | null;
}): Invitation | null => {
  const token = params.get('token')?.trim();

  if (!token) {
    return null;
  }

  const userEmail = (params.get('userEmail') ?? params.get('email'))?.trim() || null;

  return { token, userEmail };
};

/** 사용자가 붙여넣은 팀 링크(전체 URL 또는 경로)에서 초대 정보를 추출한다. */
export const parseInvitationLink = (link: string): Invitation | null => {
  const trimmed = link.trim();

  if (!trimmed) {
    return null;
  }

  const url = toUrl(trimmed);
  return url ? readInvitationParams(url.searchParams) : null;
};

/** 초대 정보로 우리 서비스의 팀 참여 경로(/jointeam?token=...)를 만든다. */
export const buildJoinTeamPath = ({ token, userEmail }: Invitation) => {
  const params = new URLSearchParams({ token });

  if (userEmail) {
    params.set('userEmail', userEmail);
  }

  return `${JOIN_TEAM_PATH}?${params.toString()}`;
};

/**
 * 백엔드가 발급한 초대 값(토큰 문자열 또는 token이 담긴 URL)을
 * 사용자에게 공유할 팀 참여 링크로 바꾼다.
 */
export const createJoinTeamLink = (invitation: string, origin: string) => {
  const trimmed = invitation.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = parseInvitationLink(trimmed);
  const path = buildJoinTeamPath(parsed ?? { token: trimmed, userEmail: null });

  return `${origin}${path}`;
};
