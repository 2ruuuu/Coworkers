'use client';

import { type FormEvent, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import InputReply from '@/components/inputReply/InputReply';
import Profile from '@/components/profile/Profile';
import { TASK_COMMENT_MAX_LENGTH } from '@/constants/limits';
import { useCreateTaskCommentMutation } from '@/queries/taskComment/queries';
import { userQueries } from '@/queries/user/queries';

interface CommentFormProps {
  taskId: number;
}

/** 할 일 댓글 입력. 입력란 옆에는 댓글을 쓰는 사람(현재 사용자)의 프로필을 보여준다. */
const CommentForm = ({ taskId }: CommentFormProps) => {
  const [comment, setComment] = useState('');
  const { data: me } = useQuery(userQueries.me());
  const { mutate: createComment, isPending } = useCreateTaskCommentMutation();

  const submitComment = () => {
    const content = comment.trim();
    if (!content || isPending) return;

    createComment({ content, taskId }, { onSuccess: () => setComment('') });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitComment();
  };

  return (
    <form className="flex items-center gap-3" onSubmit={handleSubmit}>
      <Profile src={me?.image} alt={me ? `${me.nickname} 프로필` : '내 프로필'} />
      <InputReply
        value={comment}
        onChange={setComment}
        onSubmit={submitComment}
        disabled={isPending}
        maxLength={TASK_COMMENT_MAX_LENGTH}
        size="lg"
      />
    </form>
  );
};

export default CommentForm;
