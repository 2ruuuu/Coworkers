'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import Button from '@/components/button/Button';
import Input from '@/components/input/Input';
import { ROUTES } from '@/constants/routes';
import { getErrorMessage, getErrorStatus } from '@/lib/error';
import { useJoinTeamMutation } from '@/queries/team/queries';
import { type TeamJoinValues, teamJoinSchema } from '@/schemas/team.schema';

interface JoinTeamFormProps {
  initialTeamLink?: string;
}

const JoinTeamForm = ({ initialTeamLink = '' }: JoinTeamFormProps) => {
  const router = useRouter();
  const { mutateAsync, isPending } = useJoinTeamMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TeamJoinValues>({
    resolver: zodResolver(teamJoinSchema),
    defaultValues: { teamLink: initialTeamLink },
    mode: 'onBlur',
  });

  const onSubmit = async (data: TeamJoinValues) => {
    try {
      const { groupId } = await mutateAsync(data);

      toast.success('팀에 성공적으로 참여했습니다!');
      router.push(ROUTES.team(groupId));
    } catch (error) {
      const message = getErrorMessage(error, '팀 참여 중 오류가 발생했어요.');

      // 링크 형식 오류는 입력란에, 그 외(만료된 초대 등)는 토스트로 안내한다.
      if (getErrorStatus(error) === 400) {
        setError('teamLink', { type: 'validate', message });
        return;
      }

      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[400px] md:max-w-[460px]">
      <div className="flex flex-col gap-8 md:gap-10">
        <h1 className="text-text-primary text-xl font-semibold md:text-2xl">팀 참여하기</h1>

        <div className="flex flex-col gap-2 md:gap-3">
          <label htmlFor="teamLink" className="text-md text-text-primary font-medium">
            팀 링크
          </label>
          <Input
            id="teamLink"
            type="text"
            size="sm"
            placeholder="팀 링크를 입력해주세요."
            disabled={isPending}
            isError={Boolean(errors.teamLink)}
            errorMessage={errors.teamLink?.message}
            {...register('teamLink')}
          />
        </div>

        <div className="flex flex-col gap-5">
          <Button type="submit" fullWidth isLoading={isPending}>
            참여하기
          </Button>

          <p className="text-text-default flex justify-center text-lg break-all">
            공유받은 팀 링크를 입력해 참여할 수 있어요.
          </p>
        </div>
      </div>
    </form>
  );
};

export default JoinTeamForm;
