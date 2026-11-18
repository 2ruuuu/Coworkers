import type { Member } from '@/apis/user/type';

import type { TeamPageMember } from '../type';

const compareMembersByRole = (first: Member, second: Member) => {
  if (first.role === second.role) return 0;
  return first.role === 'ADMIN' ? -1 : 1;
};

/** 관리자를 먼저 보여주도록 정렬하고 화면용 형태로 바꾼다. */
export const mapMembers = (members: Member[]): TeamPageMember[] =>
  [...members].sort(compareMembersByRole).map((member) => ({
    id: member.userId,
    name: member.userName,
    email: member.userEmail,
    imageUrl: member.userImage,
    role: member.role,
  }));
