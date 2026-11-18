import 'server-only';

import { ENDPOINTS } from '@/apis/endpoints';
import { serverFetcher } from '@/lib/serverFetcher';

import type { UploadImageResponse } from './type';

export const uploadImageServer = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  return serverFetcher<UploadImageResponse>(ENDPOINTS.image.upload, {
    method: 'POST',
    body: formData,
  });
};

/** 폼에서 받은 값이 비어 있지 않은 파일이면 업로드하고 URL을, 아니면 undefined를 반환한다. */
export const uploadImageIfFile = async (value: FormDataEntryValue | null) => {
  if (!(value instanceof File) || value.size === 0) {
    return undefined;
  }

  const { url } = await uploadImageServer(value);
  return url;
};
