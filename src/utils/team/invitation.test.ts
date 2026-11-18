import { describe, expect, it } from 'vitest';

import { buildJoinTeamPath, createJoinTeamLink, parseInvitationLink } from './invitation';

describe('invitation link', () => {
  it('전체 URL과 경로 모두에서 token/userEmail을 읽는다', () => {
    expect(parseInvitationLink('https://site.com/jointeam?token=abc&userEmail=a@b.com')).toEqual({
      token: 'abc',
      userEmail: 'a@b.com',
    });
    expect(parseInvitationLink('/jointeam?token=abc&email=a@b.com')).toEqual({
      token: 'abc',
      userEmail: 'a@b.com',
    });
  });

  it('token이 없거나 비어 있으면 null', () => {
    expect(parseInvitationLink('')).toBeNull();
    expect(parseInvitationLink('/jointeam?userEmail=a@b.com')).toBeNull();
  });

  it('팀 참여 경로를 만든다', () => {
    expect(buildJoinTeamPath({ token: 'a b', userEmail: null })).toBe('/jointeam?token=a+b');
  });

  it('백엔드가 토큰 문자열만 주면 그대로 token 파라미터로 쓴다', () => {
    expect(createJoinTeamLink('raw-token', 'https://site.com')).toBe(
      'https://site.com/jointeam?token=raw-token',
    );
    expect(createJoinTeamLink('  ', 'https://site.com')).toBeNull();
  });
});
