'use client';

import type { ArticleRequest } from '@/apis/article/type';
import { useCreateArticleMutation, useUpdateArticleMutation } from '@/queries/article/queries';
import { useUploadImageMutation } from '@/queries/user/queries';

import type { ArticleFormData } from '../_components/schema';

export type ArticleEditorMode = 'write' | 'edit';

/** 게시글 작성/수정 저장 로직. 새 이미지가 있으면 먼저 업로드한다. */
export const useArticleEditor = (mode: ArticleEditorMode, articleId?: string) => {
  const uploadImageMutation = useUploadImageMutation();
  const createArticleMutation = useCreateArticleMutation();
  const updateArticleMutation = useUpdateArticleMutation();

  const isSaving =
    uploadImageMutation.isPending ||
    createArticleMutation.isPending ||
    updateArticleMutation.isPending;

  const save = async (values: ArticleFormData) => {
    const image =
      values.image instanceof File
        ? await uploadImageMutation.mutateAsync(values.image)
        : (values.image ?? null);
    const body: ArticleRequest = { title: values.title, content: values.content, image };

    if (mode === 'edit') {
      if (!articleId) throw new Error('수정할 게시글을 찾을 수 없어요.');
      return updateArticleMutation.mutateAsync({ articleId, body });
    }

    return createArticleMutation.mutateAsync(body);
  };

  return { save, isSaving };
};
