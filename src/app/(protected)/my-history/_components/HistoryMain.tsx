import type { TaskHistory } from '@/apis/user/type';
import ListItemDate from '@/components/listItem/ListItemDate';
import TaskCheckbox from '@/components/taskCheckbox/TaskCheckbox';
import { formatYearMonthDay, parseISODate } from '@/utils/date';

import { groupDoneTasksByDate } from '../_utils/task';

interface HistoryMainProps {
  tasks: TaskHistory[];
}

const HistoryMain = ({ tasks }: HistoryMainProps) => {
  return (
    <>
      {groupDoneTasksByDate(tasks).map(([date, items]) => {
        const parsedDate = parseISODate(date);

        return (
          <section key={date} className="flex flex-col gap-3">
            <h2 className="text-text-default text-lg font-semibold">
              <time dateTime={date}>{parsedDate ? formatYearMonthDay(parsedDate) : date}</time>
            </h2>
            <ul className="flex flex-col gap-3">
              {items.map((task) => (
                <li
                  key={task.id}
                  className="text-text-default outline-border-primary bg-background-secondary flex justify-between gap-3 rounded-2xl px-3.5 py-3 outline"
                >
                  {/* 히스토리는 모두 완료된 할 일이므로 체크된 상태로만 보여준다. */}
                  <TaskCheckbox task={task.name} checked size="lg" disabled />
                  <ListItemDate date={task.date} frequency={task.frequency} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
};

export default HistoryMain;
