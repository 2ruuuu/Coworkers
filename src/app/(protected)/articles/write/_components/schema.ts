import { z } from 'zod';

import { MAX_IMAGE_UPLOAD_BYTES, MAX_IMAGE_UPLOAD_MB } from '@/constants/image';

export const articleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해주세요.')
    .max(50, '제목은 50자 이하로 입력해주세요.'),
  content: z
    .string()
    .trim()
    .min(1, '내용을 입력해주세요.')
    .max(10000, '내용은 10000자 이하로 입력해주세요.'),
  /** 새로 고른 파일(File) 또는 기존 이미지 URL(string). 없으면 null */
  image: z
    .union([
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= MAX_IMAGE_UPLOAD_BYTES,
          `이미지는 ${MAX_IMAGE_UPLOAD_MB}MB 이하만 올릴 수 있어요.`,
        ),
      z.string(),
      z.null(),
    ])
    .optional(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
