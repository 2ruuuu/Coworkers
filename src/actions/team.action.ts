'use server';

import { z } from 'zod';

import {
  acceptGroupInvitationServer,
  createGroupServer,
  deleteGroupMemberServer,
  deleteGroupServer,
  getGroupInvitationServer,
  updateGroupServer,
} from '@/apis/group/server';
import type { GroupDetail } from '@/apis/group/type';
import { uploadImageIfFile } from '@/apis/image/server';
import { getMyProfileServer } from '@/apis/user/server';
import { type ActionResult, runAction } from '@/lib/action';
import { BusinessError } from '@/lib/error';
import { idSchema } from '@/schemas/common.schema';
import { teamJoinSchema, teamNameSchema } from '@/schemas/team.schema';
import { parseInvitationLink } from '@/utils/team/invitation';

/** FormData: name, image(File, 선택) */
export const createTeamAction = async (formData: FormData): Promise<ActionResult<GroupDetail>> => {
  return runAction(async () => {
    const name = teamNameSchema.parse(formData.get('name'));
    const image = await uploadImageIfFile(formData.get('image'));

    return createGroupServer(image ? { name, image } : { name });
  }, '팀 생성 중 오류가 발생했어요.');
};

/** FormData: groupId, name, image(File, 선택), currentImage(선택) */
export const updateTeamAction = async (formData: FormData): Promise<ActionResult<GroupDetail>> => {
  return runAction(async () => {
    const groupId = idSchema.parse(formData.get('groupId'));
    const name = teamNameSchema.parse(formData.get('name'));
    const currentImage = formData.get('currentImage');
    const image =
      (await uploadImageIfFile(formData.get('image'))) ??
      (typeof currentImage === 'string' && currentImage ? currentImage : undefined);

    return updateGroupServer(groupId, image ? { name, image } : { name });
  }, '팀 정보 수정 중 오류가 발생했어요.');
};

export const joinTeamAction = async (payload: {
  teamLink: string;
}): Promise<ActionResult<{ groupId: number }>> => {
  return runAction(async () => {
    const parsed = teamJoinSchema.safeParse(payload);

    if (!parsed.success) {
      throw new BusinessError(parsed.error.issues[0]?.message ?? '팀 링크를 입력해주세요.', 400);
    }

    const invitation = parseInvitationLink(parsed.data.teamLink);

    if (!invitation) {
      throw new BusinessError('올바른 팀 링크를 입력해주세요.', 400);
    }

    const userEmail = invitation.userEmail ?? (await getMyProfileServer()).email;

    return acceptGroupInvitationServer({ userEmail, token: invitation.token });
  }, '팀 참여 중 오류가 발생했어요.');
};

export const deleteTeamAction = async (groupId: number): Promise<ActionResult<void>> => {
  return runAction(() => deleteGroupServer(idSchema.parse(groupId)), '팀을 삭제하지 못했습니다.');
};

const deleteMemberSchema = z.object({ groupId: idSchema, memberUserId: idSchema });

export const deleteTeamMemberAction = async (payload: {
  groupId: number;
  memberUserId: number;
}): Promise<ActionResult<void>> => {
  return runAction(() => {
    const { groupId, memberUserId } = deleteMemberSchema.parse(payload);
    return deleteGroupMemberServer(groupId, memberUserId);
  }, '멤버를 내보내지 못했습니다.');
};

/** 초대 토큰(링크)을 발급받는다. 호출할 때마다 새 토큰이 발급되므로 mutation으로 사용한다. */
export const getTeamInvitationAction = async (groupId: number): Promise<ActionResult<string>> => {
  return runAction(
    () => getGroupInvitationServer(idSchema.parse(groupId)),
    '초대 링크를 불러오지 못했습니다.',
  );
};
