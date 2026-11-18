import { ALLOWED_IMAGE_HOSTS } from '@/constants/image';

const isAllowedHost = (hostname: string) =>
  ALLOWED_IMAGE_HOSTS.some((host) =>
    host.startsWith('*.') ? hostname.endsWith(host.slice(1)) : hostname === host,
  );

/** next/image로 렌더할 수 있는 이미지 URL인지 확인한다. (blob/data/내부 경로 또는 허용된 https 호스트) */
export const isAllowedImageUrl = (url: string | null | undefined): url is string => {
  if (!url) {
    return false;
  }

  if (url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('/')) {
    return true;
  }

  try {
    const { protocol, hostname } = new URL(url);
    return protocol === 'https:' && isAllowedHost(hostname);
  } catch {
    return false;
  }
};
