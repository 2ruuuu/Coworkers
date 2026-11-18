'use client';

import { useId, useRef, useState } from 'react';

import { useOutsideClick } from '@/hooks/useOutsideClick';

/** 드롭다운 열림 상태, 바깥 클릭 닫기, 닫힐 때 트리거로 포커스 복귀를 관리한다. */
export const useDropdown = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerId = useId();
  const listId = useId();

  useOutsideClick(wrapperRef, () => setIsOpen(false));

  const close = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, wrapperRef, triggerRef, triggerId, listId, close, toggle };
};
