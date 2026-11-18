import type { ReactNode } from 'react';

export type ReplySize = 'sm' | 'lg';

export interface ReplyProps {
  size?: ReplySize;
  author: string;
  avatar: ReactNode;
  children: ReactNode;
  date: string;
  /** 오른쪽 위에 표시할 메뉴 (수정/삭제 드롭다운 등) */
  menu?: ReactNode;
}

export interface ReplyEditProps {
  author: string;
  avatar: ReactNode;
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  /** 입력 가능한 최대 글자 수 */
  maxLength?: number;
}
