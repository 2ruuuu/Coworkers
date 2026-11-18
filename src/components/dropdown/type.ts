import type { ReactNode } from 'react';

export type DropdownSize = 'md' | 'sm';

export interface DropdownOption<T extends string = string> {
  label: string;
  value: T;
}

export interface DropdownProps<T extends string> {
  options: readonly DropdownOption<T>[];
  onSelect: (value: T) => void;
  /** 트리거 버튼 안에 렌더할 내용 (아이콘 등) */
  trigger: ReactNode;
  /** 트리거 버튼의 접근 가능한 이름 (아이콘만 있는 경우 필수) */
  triggerLabel: string;
  triggerClassName?: string;
  size?: DropdownSize;
  /** 메뉴를 트리거의 어느 쪽에 맞출지 */
  align?: 'left' | 'right';
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
}

export interface DropdownSelectProps<T extends string> {
  options: readonly DropdownOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  /** 선택된 값이 없을 때 표시할 문구 */
  placeholder?: string;
  /** 스크린리더용 이름 (예: "정렬 기준") */
  label: string;
  size?: DropdownSize;
  className?: string;
  defaultOpen?: boolean;
}
