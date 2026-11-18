import Link from 'next/link';

import MenuIcon from '@/assets/icons/gnb_menu.svg?react';
import LogoSmall from '@/assets/icons/logo_small.svg?react';
import Profile from '@/components/profile/Profile';
import { ROUTES } from '@/constants/routes';

import ProfileMenu from './ProfileMenu';
import type { SidebarProps } from './type';

interface MobileHeaderProps extends SidebarProps {
  isMenuOpen: boolean;
  menuId: string;
  onOpenMenu: () => void;
}

export default function MobileHeader({
  groups,
  user,
  isMenuOpen,
  menuId,
  onOpenMenu,
}: MobileHeaderProps) {
  const logoHref = groups.length > 0 ? ROUTES.team(groups[0].id) : ROUTES.HOME;

  return (
    <header className="bg-background-primary border-brand-secondary fixed z-20 flex h-16 w-full items-center justify-between border px-5 md:hidden">
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          onClick={onOpenMenu}
        >
          <MenuIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <Link href={logoHref} aria-label="Coworkers 홈으로 이동">
          <LogoSmall className="h-6 w-6" aria-hidden="true" />
        </Link>
      </div>

      {user ? (
        <ProfileMenu
          size="sm"
          trigger={<Profile src={user.image} size="md" alt={`${user.nickname} 프로필 이미지`} />}
        />
      ) : (
        <div className="h-8 w-8" aria-hidden="true" />
      )}
    </header>
  );
}
