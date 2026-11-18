'use client';

import DownArrowIcon from '@/assets/icons/down_arrow.svg?react';
import { cn } from '@/utils/cn';

import DropdownList from './DropdownList';
import type { DropdownSelectProps, DropdownSize } from './type';
import { useDropdown } from './useDropdown';

const TRIGGER_SIZE_STYLES: Record<DropdownSize, string> = {
  md: 'h-11 min-w-[120px] px-3.5 text-md',
  sm: 'h-10 min-w-[94px] px-3 text-xs',
};

/** 선택한 값을 버튼에 표시하는 드롭다운 (정렬 기준, 반복 설정 등) */
const DropdownSelect = <T extends string>({
  options,
  value,
  onChange,
  placeholder = '선택',
  label,
  size = 'md',
  className,
  defaultOpen = false,
}: DropdownSelectProps<T>) => {
  const { isOpen, wrapperRef, triggerRef, triggerId, listId, close, toggle } =
    useDropdown(defaultOpen);
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div ref={wrapperRef} className={cn('relative inline-block', className)}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-label={`${label}: ${selectedLabel ?? placeholder}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        onClick={toggle}
        className={cn(
          'border-border-primary bg-background-primary text-text-default focus-visible:border-interaction-pressed inline-flex w-full items-center justify-between gap-2 rounded-xl border outline-none',
          TRIGGER_SIZE_STYLES[size],
        )}
      >
        <span>{selectedLabel ?? placeholder}</span>
        <DownArrowIcon className="size-5 shrink-0" aria-hidden="true" />
      </button>

      {isOpen && (
        <DropdownList
          id={listId}
          role="listbox"
          labelledBy={triggerId}
          options={options}
          size={size}
          align="left"
          className="w-full"
          selectedValue={value}
          onSelect={onChange}
          onClose={close}
        />
      )}
    </div>
  );
};

export default DropdownSelect;
