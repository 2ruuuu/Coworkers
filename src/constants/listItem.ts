import type { FrequencyType } from '@/apis/task/type';
import type { DropdownOption } from '@/components/dropdown/type';

export const FREQUENCY_TEXT: Record<FrequencyType, string> = {
  ONCE: '반복 안함',
  DAILY: '매일 반복',
  WEEKLY: '매주 반복',
  MONTHLY: '매달 반복',
};

export type EditDeleteValue = 'EDIT' | 'DELETE';

/** 수정/삭제 케밥 메뉴 옵션 */
export const EDIT_DELETE_OPTIONS: DropdownOption<EditDeleteValue>[] = [
  { value: 'EDIT', label: '수정하기' },
  { value: 'DELETE', label: '삭제하기' },
];
