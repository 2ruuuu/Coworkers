'use client';

import { cn } from '@/utils/cn';

import DropdownList from './DropdownList';
import type { DropdownProps } from './type';
import { useDropdown } from './useDropdown';

/**
 * 트리거 버튼(케밥 아이콘 등)을 누르면 메뉴가 열리는 드롭다운.
 * 열림 상태, 바깥 클릭/Escape 닫기, 키보드 이동을 내부에서 처리한다.
 */
const Dropdown = <T extends string>({
  options,
  onSelect,
  trigger,
  triggerLabel,
  triggerClassName,
  size = 'md',
  align = 'right',
  className,
  menuClassName,
  disabled,
}: DropdownProps<T>) => {
  const { isOpen, wrapperRef, triggerRef, triggerId, listId, close, toggle } = useDropdown();

  return (
    <div ref={wrapperRef} className={cn('relative inline-flex', className)}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        disabled={disabled}
        className={cn(
          'focus-visible:ring-brand-primary inline-flex items-center justify-center rounded-md outline-none focus-visible:ring-2',
          triggerClassName,
        )}
        onClick={(event) => {
          event.stopPropagation();
          toggle();
        }}
      >
        {trigger}
      </button>

      {isOpen && (
        <DropdownList
          id={listId}
          role="menu"
          labelledBy={triggerId}
          options={options}
          size={size}
          align={align}
          className={menuClassName}
          onSelect={onSelect}
          onClose={close}
        />
      )}
    </div>
  );
};

export default Dropdown;
