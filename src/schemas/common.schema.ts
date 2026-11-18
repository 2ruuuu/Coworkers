import { z } from 'zod';

/** 양의 정수 ID (숫자 문자열도 허용) */
export const idSchema = z.coerce
  .number()
  .int('ID가 올바르지 않습니다.')
  .positive('ID가 올바르지 않습니다.');

/** 경로에 들어가는 문자열 ID (게시글/댓글). 숫자만 허용해 경로 조작을 막는다. */
export const stringIdSchema = z
  .union([z.string(), z.number()])
  .transform(String)
  .pipe(z.string().regex(/^\d+$/, 'ID가 올바르지 않습니다.'));

/** YYYY-MM-DD 형식의 날짜 */
export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식이 올바르지 않습니다.');

/** 문자열을 양의 정수 ID로 파싱한다. 올바르지 않으면 undefined */
export const parsePositiveId = (value: unknown): number | undefined => {
  const result = idSchema.safeParse(value);
  return result.success ? result.data : undefined;
};
