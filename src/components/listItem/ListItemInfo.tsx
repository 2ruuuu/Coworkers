import CommentIcon from '@/assets/icons/comment.svg?react';
import KebabIcon from '@/assets/icons/kebab.svg?react';
import Dropdown from '@/components/dropdown/Dropdown';
import TaskCheckbox from '@/components/taskCheckbox/TaskCheckbox';
import { EDIT_DELETE_OPTIONS, type EditDeleteValue } from '@/constants/listItem';

import type { ListItemInfoProps } from './type';

const ListItemInfo = ({
  name,
  isDone,
  commentCount,
  onToggle,
  onEdit,
  onDelete,
}: ListItemInfoProps) => {
  const handleSelect = (value: EditDeleteValue) => {
    if (value === 'EDIT') onEdit();
    else onDelete();
  };

  return (
    <div className="pointer-events-none relative z-10 flex items-center justify-between">
      <div className="pointer-events-auto flex gap-3.5">
        <TaskCheckbox task={name} checked={isDone} size="lg" onChange={onToggle} />
        {commentCount > 0 && (
          <div className="flex items-center gap-1">
            <CommentIcon width={16} height={16} aria-hidden="true" />
            <span>
              <span className="sr-only">댓글 </span>
              {commentCount}
            </span>
          </div>
        )}
      </div>
      <Dropdown
        options={EDIT_DELETE_OPTIONS}
        onSelect={handleSelect}
        trigger={<KebabIcon width={16} height={16} aria-hidden="true" />}
        triggerLabel={`${name} 메뉴 열기`}
        triggerClassName="text-icon-primary hover:bg-background-secondary hover:text-brand-primary size-7 transition-colors active:scale-95"
        className="pointer-events-auto"
      />
    </div>
  );
};

export default ListItemInfo;
