'use client';

import { useEffect, useRef, useState } from 'react';

interface ImagePreviewState {
  file: File | null;
  previewUrl: string | null;
}

/**
 * 이미지 파일 선택과 미리보기 URL(blob)을 관리한다.
 * 새 파일을 고르거나 컴포넌트가 사라지면 이전 blob URL을 해제한다.
 */
export const useImagePreview = (initialUrl: string | null = null) => {
  const [state, setState] = useState<ImagePreviewState>({ file: null, previewUrl: initialUrl });
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  const selectFile = (file: File) => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);

    const previewUrl = URL.createObjectURL(file);
    blobUrlRef.current = previewUrl;
    setState({ file, previewUrl });
  };

  return { file: state.file, previewUrl: state.previewUrl, selectFile };
};
