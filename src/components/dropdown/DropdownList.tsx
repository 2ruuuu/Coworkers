'use client';

import { type KeyboardEvent, useEffect, useRef } from 'react';

import { cn } from '@/utils/cn';

import type { DropdownOption, DropdownSize } from './type';

const LIST_SIZE_STYLES: Record<DropdownSize, string> = {
  md: 'min-w-[120px] text-md',
  sm: 'min-w-[94px] text-xs',
};

interface DropdownListProps<T extends string> {
  id: string;
  options: readonly DropdownOption<T>[];
  size: DropdownSize;
  align: 'left' | 'right';
  role: 'menu' | 'listbox';
  labelledBy: string;
  selectedValue?: T;
  className?: string;
  onSelect: (value: T) => void;
  onClose: () => void;
}

/**
 * 드롭다운 목록. 열리면 첫(또는 선택된) 항목에 포커스하고,
 * 위/아래 화살표, Home/End로 이동, Escape/Tab으로 닫는다.
 */
const DropdownList = <T extends string>({
  id,
  options,
  size,
  align,
  role,
  labelledBy,
  selectedValue,
  className,
  onSelect,
  onClose,
}: DropdownListProps<T>) => {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const itemRole = role === 'menu' ? 'menuitem' : 'option';

  useEffect(() => {
    const selectedIndex = options.findIndex((option) => option.value === selectedValue);
    itemRefs.current[Math.max(selectedIndex, 0)]?.focus();
  }, [options, selectedValue]);

  const focusItem = (index: number) => {
    const count = options.length;
    itemRefs.current[(index + count) % count]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = itemRefs.current.findIndex((item) => item === document.activeElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusItem(currentIndex + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusItem(currentIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusItem(0);
        break;
      case 'End':
        event.preventDefault();
        focusItem(options.length - 1);
        break;
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        onClose();
        break;
      case 'Tab':
        onClose();
        break;
    }
  };

  return (
    <div
      id={id}
      role={role}
      aria-labelledby={labelledBy}
      onKeyDown={handleKeyDown}
      className={cn(
        'border-border-primary bg-background-primary absolute top-full z-10 mt-1 overflow-hidden rounded-xl border',
        align === 'right' ? 'right-0' : 'left-0',
        LIST_SIZE_STYLES[size],
        className,
      )}
    >
      {options.map((option, index) => {
        const isSelected = option.value === selectedValue;

        return (
          <button
            key={option.value}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            type="button"
            role={itemRole}
            aria-selected={role === 'listbox' ? isSelected : undefined}
            tabIndex={-1}
            className={cn(
              'hover:bg-background-secondary focus-visible:bg-background-secondary w-full px-3 py-3 text-left outline-none',
              isSelected && 'text-brand-primary font-semibold',
            )}
            onClick={() => {
              onSelect(option.value);
              onClose();
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default DropdownList;
