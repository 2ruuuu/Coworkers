/**
 * next/image로 불러올 수 있는 외부 이미지 호스트.
 * next.config.ts의 images.remotePatterns와 isAllowedImageUrl이 함께 사용한다.
 * (`*.`으로 시작하면 하위 도메인 전체를 허용)
 */
export const ALLOWED_IMAGE_HOSTS = [
  'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
  '*.cloudfront.net',
  // 배포 도메인 (철자가 다른 예전 도메인 포함)
  'fe-project-cowokers.vercel.app',
  'fe-project-coworkers.vercel.app',
] as const;

/** 업로드 가능한 이미지 최대 크기. Server Action body 제한(next.config.ts)과 맞춘다. */
export const MAX_IMAGE_UPLOAD_MB = 5;
export const MAX_IMAGE_UPLOAD_BYTES = MAX_IMAGE_UPLOAD_MB * 1024 * 1024;
