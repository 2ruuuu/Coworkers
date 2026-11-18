'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import UploadIcon from '@/assets/icons/img.svg?react';
import Button from '@/components/button/Button';
import InputBox from '@/components/inputBox/InputBox';

import type { ArticleFormData } from './schema';

type ArticleFormProps = {
  register: UseFormRegister<ArticleFormData>;
  errors: FieldErrors<ArticleFormData>;
  image?: File | string | null;
  onImageChange: (file: File | null) => void;
  submitText: string;
  onSubmit: () => void;
  isLoading: boolean;
};

/**
 * 선택한 파일의 미리보기 URL을 관리한다.
 * 파일을 고를 때 URL을 만들고, 다른 파일을 고르거나 화면을 떠나면 이전 URL을 해제한다.
 */
const useFilePreview = (image: File | string | null | undefined) => {
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const setFile = (file: File | null) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);

    const url = file ? URL.createObjectURL(file) : null;
    urlRef.current = url;
    setPreview(file && url ? { file, url } : null);
  };

  const previewUrl =
    typeof image === 'string' ? image : image && preview?.file === image ? preview.url : '';

  return { previewUrl, setFile };
};

const RequiredMark = () => (
  <span className="text-point-rose" aria-hidden="true">
    *
  </span>
);

const ArticleForm = ({
  register,
  errors,
  image,
  onImageChange,
  submitText,
  onSubmit,
  isLoading,
}: ArticleFormProps) => {
  const { previewUrl, setFile } = useFilePreview(image);

  const handleImageChange = (file: File | null) => {
    setFile(file);
    onImageChange(file);
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="mb-8 flex w-full flex-col items-start gap-2">
        <label htmlFor="article-title" className="flex items-center gap-1">
          <span className="text-md font-semibold md:text-lg">제목</span>
          <RequiredMark />
        </label>
        <input
          id="article-title"
          type="text"
          {...register('title')}
          aria-invalid={Boolean(errors.title) || undefined}
          aria-describedby={errors.title ? 'article-title-error' : undefined}
          placeholder="제목을 입력해주세요."
          className="border-border-primary bg-background-primary text-text-primary placeholder:text-text-default hover:border-interaction-hover focus:border-interaction-pressed h-12 w-full rounded-xl border px-4 py-4 text-base transition-colors outline-none"
        />
        {errors.title && (
          <p id="article-title-error" className="text-point-rose">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="mb-8 flex w-full flex-col items-start gap-2">
        <label htmlFor="article-content" className="flex items-center gap-1">
          <span className="text-md font-semibold md:text-lg">내용</span>
          <RequiredMark />
        </label>
        <InputBox
          id="article-content"
          {...register('content')}
          aria-invalid={Boolean(errors.content) || undefined}
          aria-describedby={errors.content ? 'article-content-error' : undefined}
          size="lg"
          placeholder="내용을 입력해주세요."
          className="border-border-primary min-h-[300px] w-full rounded-xl border p-4 whitespace-pre-wrap"
        />
        {errors.content && (
          <p id="article-content-error" className="text-point-rose">
            {errors.content.message}
          </p>
        )}
      </div>

      <div className="mb-8 flex flex-col gap-2">
        <span id="article-image-label" className="text-md font-semibold md:text-lg">
          이미지
        </span>

        {previewUrl ? (
          <div className="border-border-primary relative h-24 w-24 overflow-hidden rounded-xl border">
            <Image
              src={previewUrl}
              alt="첨부한 이미지 미리보기"
              className="h-full w-full object-cover"
              width={120}
              height={120}
            />
            <button
              type="button"
              aria-label="이미지 삭제"
              className="focus-visible:ring-brand-primary absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white outline-none focus-visible:ring-2"
              onClick={() => handleImageChange(null)}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        ) : (
          <label
            htmlFor="article-image"
            className="border-border-primary focus-within:ring-brand-primary flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border focus-within:ring-2"
          >
            {/* sr-only로 숨겨 키보드(Tab)로도 파일을 고를 수 있게 한다. */}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              id="article-image"
              aria-labelledby="article-image-label"
              aria-describedby={errors.image ? 'article-image-error' : undefined}
              onChange={(event) => handleImageChange(event.target.files?.[0] ?? null)}
            />
            <UploadIcon className="size-6" aria-hidden="true" />
            <span className="text-text-disabled text-md">0 / 1</span>
          </label>
        )}
        {errors.image && (
          <p id="article-image-error" className="text-point-rose">
            {errors.image.message}
          </p>
        )}
      </div>

      <Button variant="primary-filled" className="w-full" type="submit" isLoading={isLoading}>
        {submitText}
      </Button>
    </form>
  );
};

export default ArticleForm;
