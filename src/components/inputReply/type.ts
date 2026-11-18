export type InputReplySize = 'sm' | 'lg';

export interface InputReplyProps {
  size?: InputReplySize;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  /** 스크린리더용 이름 */
  label?: string;
  disabled?: boolean;
  /** 입력 가능한 최대 글자 수 */
  maxLength?: number;
}
