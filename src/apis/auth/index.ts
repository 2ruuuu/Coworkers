import { ENDPOINTS } from '@/apis/endpoints';
import publicFetcher from '@/lib/publicFetcher';

import type { AuthResponse, SignUpRequest } from './type';

// 회원가입 (공개 API)
export const signUp = async (body: SignUpRequest) => {
  const response = await publicFetcher.post<AuthResponse>(ENDPOINTS.auth.signUp, body);
  return response.data;
};
