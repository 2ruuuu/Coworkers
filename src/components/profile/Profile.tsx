import Image from 'next/image';

import ProfileDefaultIcon from '@/assets/icons/profile.svg?react';
import { cn } from '@/utils/cn';
import { normalizeImageUrl } from '@/utils/image';
import { isAllowedImageUrl } from '@/utils/isAllowedImageUrl';

import type { ProfileProps, ProfileSize } from './type';

const BASE_STYLES =
  'inline-flex items-center justify-center overflow-hidden object-cover select-none shrink-0';

const SIZE_STYLES: Record<ProfileSize, string> = {
  lg: 'w-10 h-10 rounded-xl',
  md: 'w-8 h-8 rounded-lg',
  sm: 'w-6 h-6 rounded-md',
};

const PIXEL_SIZES: Record<ProfileSize, number> = {
  lg: 40,
  md: 32,
  sm: 24,
};

/** 사용자 프로필 이미지. 허용되지 않은 이미지이거나 없으면 기본 아이콘을 보여준다. */
const Profile = ({ className, src, size = 'md', alt, ...props }: ProfileProps) => {
  const imageSrc = normalizeImageUrl(src);

  if (!isAllowedImageUrl(imageSrc)) {
    return (
      <span role="img" aria-label={alt} className={cn(BASE_STYLES, SIZE_STYLES[size], className)}>
        <ProfileDefaultIcon className="h-full w-full" aria-hidden="true" />
      </span>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={PIXEL_SIZES[size]}
      height={PIXEL_SIZES[size]}
      className={cn(BASE_STYLES, SIZE_STYLES[size], className)}
      {...props}
    />
  );
};

export default Profile;
