export type EditableProfileImageSize = 'sm' | 'lg';

export interface EditableProfileImageProps {
  src?: string | null;
  alt?: string;
  size?: EditableProfileImageSize;
  onChange?: (file: File) => void;
}
