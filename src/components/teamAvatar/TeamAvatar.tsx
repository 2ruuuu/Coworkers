import Image from 'next/image';

import { cn } from '@/utils/cn';
import { normalizeImageUrl } from '@/utils/image';
import { isAllowedImageUrl } from '@/utils/isAllowedImageUrl';

interface TeamAvatarProps {
  name: string;
  image?: string | null;
  /** next/image sizes 속성 */
  sizes: string;
  className?: string;
  initialClassName?: string;
}

/** 팀 이미지. 이미지가 없으면 팀 이름의 첫 글자를 보여준다. 부모가 크기를 정한다. */
const TeamAvatar = ({ name, image, sizes, className, initialClassName }: TeamAvatarProps) => {
  const imageSrc = normalizeImageUrl(image);

  return (
    <div className={cn('relative shrink-0 overflow-hidden', className)}>
      {isAllowedImageUrl(imageSrc) ? (
        <Image
          src={imageSrc}
          alt={`${name} 팀 이미지`}
          fill
          className="object-cover"
          sizes={sizes}
        />
      ) : (
        <div
          role="img"
          aria-label={`${name} 팀 이미지`}
          className={cn(
            'bg-brand-primary text-text-inverse flex h-full w-full items-center justify-center text-xs font-semibold',
            initialClassName,
          )}
        >
          <span aria-hidden="true">{name.trim().charAt(0).toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};

export default TeamAvatar;
