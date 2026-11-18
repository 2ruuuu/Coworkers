import type { GroupDetail } from '@/apis/group/type';
import type { Task } from '@/apis/task/type';

export interface TeamPageData {
  /** taskLists[].tasks에 오늘 기준 ±7일의 할 일이 합쳐진 그룹 정보 */
  group: GroupDetail;
  /** 오늘 날짜의 그룹 할 일 (진행률 계산용) */
  todayTasks: Task[];
}
