'use client';

import type { ReactNode } from 'react';

import Dropdown from '@/components/dropdown/Dropdown';
import type { DropdownSize } from '@/components/dropdown/type';

import { useProfileMenu } from './useProfileMenu';

interface ProfileMenuProps {
  trigger: ReactNode;
  size?: DropdownSize;
  /** 화면 아래쪽(사이드바 푸터)에서는 위로 연다. */
  placement?: 'top' | 'bottom';
}

const ProfileMenu = ({ trigger, size = 'md', placement = 'bottom' }: ProfileMenuProps) => {
  const { options, handleSelect } = useProfileMenu();

  return (
    <Dropdown
      options={options}
      onSelect={handleSelect}
      trigger={trigger}
      triggerLabel="프로필 메뉴"
      size={size}
      align="right"
      menuClassName={placement === 'top' ? 'top-auto bottom-full mt-0 mb-2' : undefined}
    />
  );
};

export default ProfileMenu;
