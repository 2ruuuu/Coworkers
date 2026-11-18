import { z } from 'zod';

export const teamNameSchema = z
  .string()
  .trim()
  .min(1, '팀 이름을 입력해주세요.')
  .max(20, '팀 이름은 20자 이하로 입력해주세요.');

export const taskListNameSchema = z
  .string()
  .trim()
  .min(1, '할 일 목록 이름을 입력해주세요.')
  .max(30, '할 일 목록 이름은 30자 이하로 입력해주세요.');

/** 팀 생성/수정 폼 */
export const teamFormSchema = z.object({
  name: teamNameSchema,
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;

/** 팀 참여 폼 */
export const teamJoinSchema = z.object({
  teamLink: z.string().trim().min(1, '팀 링크를 입력해주세요.'),
});

export type TeamJoinValues = z.infer<typeof teamJoinSchema>;
