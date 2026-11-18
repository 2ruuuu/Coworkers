import { cn } from '@/utils/cn';
import { isTaskDone } from '@/utils/task';

import ListItemDate from './ListItemDate';
import ListItemInfo from './ListItemInfo';
import type { ListItemProps } from './type';

/**
 * 할 일 한 개. 카드 전체를 덮는 버튼으로 상세를 열고,
 * 체크박스와 메뉴는 그 위(z-10)에 올려 따로 조작할 수 있다.
 */
const ListItem = ({ task, onEdit, onDelete, onToggle, onClick }: ListItemProps) => {
  const { name, frequency, date, commentCount } = task;
  const isDone = isTaskDone(task);

  return (
    <article
      className={cn(
        'text-text-default outline-border-primary focus-within:outline-brand-primary relative flex flex-col gap-2.5 rounded-2xl px-3.5 py-3 outline transition-all duration-200 has-[[role=menu]]:z-20',
        'hover:outline-brand-primary/40 hover:-translate-y-0.5 hover:shadow-md',
        isDone
          ? 'bg-background-secondary hover:bg-background-secondary/80'
          : 'bg-background-primary hover:bg-background-secondary/50',
      )}
    >
      {onClick && (
        <button
          type="button"
          className="absolute inset-0 z-0 rounded-2xl outline-none"
          aria-label={`${name} 할 일 상세 보기`}
          onClick={onClick}
        />
      )}
      <ListItemInfo
        name={name}
        isDone={isDone}
        commentCount={commentCount}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <ListItemDate date={date} frequency={frequency} />
    </article>
  );
};

export default ListItem;
