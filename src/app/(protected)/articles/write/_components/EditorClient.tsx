'use client';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { ROUTES } from '@/constants/routes';
import { getErrorMessage } from '@/lib/error';

import { type ArticleEditorMode, useArticleEditor } from '../_hooks/useArticleEditor';
import ArticleForm from './ArticleForm';
import { type ArticleFormData, articleSchema } from './schema';

interface EditorClientProps {
  mode: ArticleEditorMode;
  /** 수정 모드에서 필수 */
  articleId?: string;
  defaultValues: ArticleFormData;
}

export default function EditorClient({ mode, articleId, defaultValues }: EditorClientProps) {
  const router = useRouter();
  const { save, isSaving } = useArticleEditor(mode, articleId);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues,
  });

  const image = useWatch({ control, name: 'image' });

  const onSubmit = async (values: ArticleFormData) => {
    try {
      const article = await save(values);
      router.push(ROUTES.article(String(article.id)));
    } catch (error) {
      toast.error(getErrorMessage(error, '게시글 저장에 실패했습니다.'));
    }
  };

  return (
    <ArticleForm
      register={register}
      errors={errors}
      image={image}
      onImageChange={(file) => setValue('image', file, { shouldDirty: true, shouldValidate: true })}
      isLoading={isSaving}
      submitText={mode === 'edit' ? '수정하기' : '등록하기'}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}
