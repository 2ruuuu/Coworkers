'use client';

import { useQuery } from '@tanstack/react-query';

import CommentItem from '@/components/reply/CommentItem';
import { TASK_COMMENT_MAX_LENGTH } from '@/constants/limits';
import {
  taskCommentQueries,
  useDeleteTaskCommentMutation,
  useUpdateTaskCommentMutation,
} from '@/queries/taskComment/queries';
import { userQueries } from '@/queries/user/queries';
import { formatYearMonthDay } from '@/utils/date';

import CommentForm from './CommentForm';

/** 할 일 상세의 댓글 영역 (입력 + 목록) */
const TaskComments = ({ taskId }: { taskId: number }) => {
  const { data: comments = [] } = useQuery(taskCommentQueries.list(taskId));
  const { data: me } = useQuery(userQueries.me());
  const { mutateAsync: updateComment, isPending: isUpdating } = useUpdateTaskCommentMutation();
  const { mutate: deleteComment } = useDeleteTaskCommentMutation();

  return (
    <section aria-labelledby="task-comments-title">
      <h3 id="task-comments-title" className="mb-4 flex gap-1 text-lg font-semibold">
        <span className="text-text-primary">댓글</span>
        <span className="text-brand-primary">{comments.length}</span>
      </h3>

      <CommentForm taskId={taskId} />

      <ul className="divide-border-primary divide-y divide-solid">
        {comments.map((comment) => (
          <li key={comment.id}>
            <CommentItem
              author={comment.user.nickname}
              avatarSrc={comment.user.image}
              content={comment.content}
              date={formatYearMonthDay(new Date(comment.createdAt))}
              canManage={comment.user.id === me?.id}
              isUpdating={isUpdating}
              maxLength={TASK_COMMENT_MAX_LENGTH}
              onUpdate={(content) => updateComment({ taskId, commentId: comment.id, content })}
              onDelete={() => deleteComment({ taskId, commentId: comment.id })}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TaskComments;
