'use client';

import { useQuery } from '@tanstack/react-query';

import type { TeamCardSize } from '@/components/team/type';
import useMediaQuery, { MEDIA_QUERY } from '@/hooks/useMediaQuery';
import { teamQueries } from '@/queries/team/queries';
import { userQueries } from '@/queries/user/queries';
import { isTaskDone } from '@/utils/task';

import { TASK_STATUS_SECTIONS } from '../_constants/taskSections';
import { useTeamPageActions } from '../_hooks/useTeamPageActions';
import { mapMembers } from '../_utils/members';
import { createTaskItemsByStatus } from '../_utils/taskSections';
import TeamPageHeader from './header/TeamPageHeader';
import MemberSection from './member/MemberSection';
import TaskListSection from './taskList/TaskListSection';

interface TeamPageClientProps {
  groupId: number;
  today: string;
}

const TeamPageClient = ({ groupId, today }: TeamPageClientProps) => {
  // 서버 페이지에서 미리 채운 캐시를 사용한다. (첫 렌더부터 데이터가 있음)
  const { data: teamPage } = useQuery(teamQueries.page(groupId, today));
  const { data: myProfile } = useQuery(userQueries.me());
  const { data: myGroups = [] } = useQuery(userQueries.groups());
  const isDesktop = useMediaQuery(MEDIA_QUERY.desktop);
  const isTablet = useMediaQuery(MEDIA_QUERY.tablet);

  const group = teamPage?.group;
  const actions = useTeamPageActions({ groupId, teamName: group?.name ?? '', myGroups });

  if (!teamPage || !group) {
    return null;
  }

  // 멤버십을 찾지 못하면 권한이 없는 것으로 본다.
  const role =
    myProfile?.memberships.find((membership) => membership.groupId === groupId)?.role ?? 'MEMBER';
  const teamCardSize: TeamCardSize = isDesktop ? 'lg' : isTablet ? 'md' : 'sm';
  const members = mapMembers(group.members);
  const taskItemsByStatus = createTaskItemsByStatus(group.taskLists, today);
  const sections = TASK_STATUS_SECTIONS.map((section) => ({
    ...section,
    items: taskItemsByStatus[section.status],
  }));

  return (
    <div className="bg-background-secondary relative min-h-full overflow-y-auto px-4 py-6 md:px-6 xl:px-16 xl:py-15.75">
      <div className="mx-auto flex w-full max-w-85.75 flex-col gap-8 md:max-w-155 xl:mx-0 xl:max-w-280">
        <h1 className="sr-only">{group.name}</h1>

        <TeamPageHeader
          name={group.name}
          imageUrl={group.image}
          role={role}
          size={teamCardSize}
          members={members}
          completedTaskCount={teamPage.todayTasks.filter(isTaskDone).length}
          totalTaskCount={teamPage.todayTasks.length}
          onEditClick={actions.goToEditTeam}
          onDeleteClick={actions.openDeleteTeamModal}
        />

        <TaskListSection
          groupId={groupId}
          taskListsCount={group.taskLists.length}
          sections={sections}
          onCreateTaskList={actions.openCreateTaskListModal}
        />

        <MemberSection
          members={members}
          viewerRole={role}
          onInviteClick={actions.openInviteModal}
          onRemoveMember={actions.openRemoveMemberModal}
        />
      </div>
    </div>
  );
};

export default TeamPageClient;
