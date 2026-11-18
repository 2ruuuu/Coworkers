'use client';

import CheckboxEmptyIcon from '@/assets/icons/checkbox_empty.svg?react';
import CheckboxFilledIcon from '@/assets/icons/checkbox_fill.svg?react';

import type { TaskCheckboxProps } from './type';

const wrapperSizeStyle = {
  sm: 'gap-2',
  lg: 'gap-2.5',
} as const;

const taskSizeStyle = {
  sm: 'text-md',
  lg: 'text-lg',
} as const;

const iconSize = {
  sm: 16,
  lg: 18,
} as const;

export default function TaskCheckbox({
  task,
  size = 'sm',
  checked = false,
  disabled = false,
  onChange,
}: TaskCheckboxProps) {
  const wrapperClassName = disabled
    ? `inline-flex cursor-not-allowed items-center ${wrapperSizeStyle[size]}`
    : `inline-flex cursor-pointer items-center ${wrapperSizeStyle[size]}`;

  const taskClassName = disabled
    ? checked
      ? 'text-text-disabled line-through'
      : 'text-text-disabled'
    : checked
      ? 'text-text-disabled line-through'
      : 'text-text-primary';

  return (
    <label className={wrapperClassName}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="peer sr-only"
      />

      {/* 실제 체크박스는 숨겨져 있으므로 키보드 포커스를 아이콘 테두리로 보여준다. */}
      <span className="peer-focus-visible:ring-brand-primary inline-flex rounded-sm peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1">
        {checked ? (
          <CheckboxFilledIcon width={iconSize[size]} height={iconSize[size]} aria-hidden="true" />
        ) : (
          <CheckboxEmptyIcon width={iconSize[size]} height={iconSize[size]} aria-hidden="true" />
        )}
      </span>

      <span className={`${taskClassName} ${taskSizeStyle[size]}`}>{task}</span>
    </label>
  );
}
