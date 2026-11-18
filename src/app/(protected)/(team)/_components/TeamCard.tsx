import type { ReactNode } from 'react';

/** 팀 생성/수정/참여 화면의 공통 카드 */
const TeamCard = ({ children }: { children: ReactNode }) => (
  <div className="bg-background-primary rounded-[20px]">
    <div className="px-[21px] py-[60px] md:px-[45px]">{children}</div>
  </div>
);

export default TeamCard;
