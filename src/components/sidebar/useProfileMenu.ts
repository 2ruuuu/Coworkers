'use client';

import { useRouter } from 'next/navigation';

import type { DropdownOption } from '@/components/dropdown/type';
import { ROUTES } from '@/constants/routes';
import { useLogoutMutation } from '@/queries/auth/queries';

export type ProfileMenuValue = 'history' | 'account' | 'team' | 'logout';

export const PROFILE_MENU_OPTIONS: DropdownOption<ProfileMenuValue>[] = [
  { label: '마이 히스토리', value: 'history' },
  { label: '계정 설정', value: 'account' },
  { label: '팀 참여', value: 'team' },
  { label: '로그아웃', value: 'logout' },
];

/** 프로필 메뉴 선택 처리. 로그아웃 시 쿼리 캐시를 비우고 로그인 페이지로 이동한다. */
export const useProfileMenu = () => {
  const router = useRouter();
  const { mutate: logout } = useLogoutMutation();

  const handleSelect = (value: ProfileMenuValue) => {
    switch (value) {
      case 'history':
        router.push(ROUTES.MY_HISTORY);
        break;
      case 'account':
        router.push(ROUTES.SETTINGS);
        break;
      case 'team':
        router.push(ROUTES.JOIN_TEAM);
        break;
      case 'logout':
        logout(undefined, { onSuccess: () => router.replace(ROUTES.LOGIN) });
        break;
    }
  };

  return { options: PROFILE_MENU_OPTIONS, handleSelect };
};
