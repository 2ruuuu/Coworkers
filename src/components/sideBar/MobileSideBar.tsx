'use client';

import { useEffect, useRef } from 'react';

import CloseIcon from '@/assets/icons/x.svg?react';
import { cn } from '@/utils/cn';

import AddGroupButton from './AddGroupButton';
import ArticleMenu from './ArticleMenu';
import GroupSection from './GroupSection';
import type { SidebarGroup } from './type';

interface MobileSidebarProps {
  id: string;
  isOpen: boolean;
  groups: SidebarGroup[];
  onClose: () => void;
}

/**
 * 모바일 드로어. 닫혀 있을 때는 inert로 포커스/스크린리더 접근을 막고,
 * 열리면 닫기 버튼으로 포커스를 옮기며 Escape로 닫을 수 있다.
 */
export default function MobileSidebar({ id, isOpen, groups, onClose }: MobileSidebarProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        id={id}
        role="dialog"
        aria-modal={isOpen}
        aria-label="메뉴"
        inert={!isOpen}
        className={cn(
          'bg-background-primary border-border-primary fixed top-0 left-0 z-50 flex h-screen w-[204px] flex-col border-b px-4 py-6 transition-transform duration-300 md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="메뉴 닫기"
          onClick={onClose}
          className="mb-4 ml-auto"
        >
          <CloseIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        <nav aria-label="주요 메뉴">
          <div className="border-border-primary border-b pb-2">
            <GroupSection collapsed={false} groups={groups} />
            <div className="mt-4">
              <AddGroupButton />
            </div>
          </div>

          <div className="pt-4">
            <ArticleMenu collapsed={false} />
          </div>
        </nav>
      </aside>
    </>
  );
}
