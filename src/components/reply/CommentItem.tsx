'use client';

import { useState } from 'react';

import KebabIcon from '@/assets/icons/kebab.svg?react';
import Dropdown from '@/components/dropdown/Dropdown';
import Profile from '@/components/profile/Profile';
import { EDIT_DELETE_OPTIONS, type EditDeleteValue } from '@/constants/listItem';

import Reply from './Reply';
import ReplyEdit from './ReplyEdit';
import type { ReplySize } from './type';

interface CommentItemProps {
  author: string;
  avatarSrc?: string | null;
  content: string;
  date: string;
  size?: ReplySize;
  /** 작성자 본인일 때만 수정/삭제 메뉴를 보여준다. */
  canManage: boolean;
  isUpdating?: boolean;
  /** 댓글 최대 글자 수 (수정 입력란에 적용) */
  maxLength?: number;
  /** 수정 저장. 성공하면 보기 모드로 돌아간다. */
  onUpdate: (content: string) => Promise<unknown>;
  onDelete: () => void;
}

/** 댓글 한 개 (보기/수정 모드, 수정·삭제 메뉴). 할 일 댓글과 게시글 댓글에서 공용으로 쓴다. */
const CommentItem = ({
  author,
  avatarSrc,
  content,
  date,
  size,
  canManage,
  isUpdating = false,
  maxLength,
  onUpdate,
  onDelete,
}: CommentItemProps) => {
  const [draft, setDraft] = useState<string | null>(null);
  const avatar = <Profile src={avatarSrc} alt={`${author} 프로필`} />;

  const handleMenuSelect = (value: EditDeleteValue) => {
    if (value === 'EDIT') setDraft(content);
    else onDelete();
  };

  const handleSubmit = async () => {
    if (draft === null || !draft.trim()) return;

    try {
      await onUpdate(draft.trim());
      setDraft(null);
    } catch {
      // 실패하면 입력한 내용을 유지한다. (에러 안내는 mutation 전역 토스트)
    }
  };

  if (draft !== null) {
    return (
      <ReplyEdit
        author={author}
        avatar={avatar}
        value={draft}
        maxLength={maxLength}
        isSubmitting={isUpdating}
        onChange={setDraft}
        onCancel={() => setDraft(null)}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <Reply
      size={size}
      author={author}
      avatar={avatar}
      date={date}
      menu={
        canManage && (
          <Dropdown
            options={EDIT_DELETE_OPTIONS}
            onSelect={handleMenuSelect}
            trigger={<KebabIcon className="size-4" aria-hidden="true" />}
            triggerLabel="댓글 메뉴"
          />
        )
      }
    >
      {content}
    </Reply>
  );
};

export default CommentItem;
