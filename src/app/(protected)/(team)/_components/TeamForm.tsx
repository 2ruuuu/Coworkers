'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import Button from '@/components/button/Button';
import EditableProfileImage from '@/components/editableProfileImage/EditableProfileImage';
import Input from '@/components/input/Input';
import { ROUTES } from '@/constants/routes';
import { useImagePreview } from '@/hooks/useImagePreview';
import { getErrorMessage, isDuplicateNameError } from '@/lib/error';
import { useCreateTeamMutation, useUpdateTeamMutation } from '@/queries/team/queries';
import { type TeamFormValues, teamFormSchema } from '@/schemas/team.schema';

type TeamFormProps =
  | { mode: 'create' }
  | { mode: 'edit'; groupId: number; initialName: string; initialImageUrl: string | null };

const FORM_TEXT = {
  create: {
    title: '팀 생성하기',
    submit: '생성하기',
    success: '새로운 팀이 성공적으로 생성되었습니다!',
    error: '팀 생성 중 오류가 발생했어요.',
  },
  edit: {
    title: '팀 수정하기',
    submit: '수정하기',
    success: '팀 정보가 성공적으로 수정되었습니다!',
    error: '팀 정보 수정 중 오류가 발생했어요.',
  },
} as const;

/** 팀 생성/수정 공용 폼 */
const TeamForm = (props: TeamFormProps) => {
  const router = useRouter();
  const createMutation = useCreateTeamMutation();
  const updateMutation = useUpdateTeamMutation();
  const text = FORM_TEXT[props.mode];
  const initialImageUrl = props.mode === 'edit' ? props.initialImageUrl : null;
  const { file: imageFile, previewUrl, selectFile } = useImagePreview(initialImageUrl);
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: { name: props.mode === 'edit' ? props.initialName : '' },
    mode: 'onBlur',
  });

  const onSubmit = async ({ name }: TeamFormValues) => {
    try {
      const group =
        props.mode === 'create'
          ? await createMutation.mutateAsync({ name, imageFile })
          : await updateMutation.mutateAsync({
              groupId: props.groupId,
              name,
              imageFile,
              currentImage: initialImageUrl,
            });

      toast.success(text.success);
      router.push(ROUTES.team(group.id));
    } catch (error) {
      if (isDuplicateNameError(error)) {
        setError('name', { type: 'validate', message: '이미 존재하는 이름입니다.' });
        return;
      }

      toast.error(getErrorMessage(error, text.error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-8 md:gap-10">
        <h1 className="text-text-primary text-xl font-semibold md:text-2xl">{text.title}</h1>
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <EditableProfileImage src={previewUrl} alt="팀 프로필 이미지" onChange={selectFile} />
          </div>
          <div className="flex flex-col gap-2 md:gap-3">
            <label htmlFor="team-name" className="text-md text-text-primary font-medium">
              팀 이름
            </label>
            <Input
              id="team-name"
              type="text"
              size="sm"
              placeholder="팀 이름을 입력해주세요."
              disabled={isPending}
              isError={Boolean(errors.name)}
              errorMessage={errors.name?.message}
              {...register('name')}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <Button type="submit" isLoading={isPending}>
            {text.submit}
          </Button>
          <p className="text-text-default flex justify-center text-xs break-all md:text-lg">
            팀 이름은 회사명이나 모임 이름 등으로 설정하면 좋아요.
          </p>
        </div>
      </div>
    </form>
  );
};

export default TeamForm;
