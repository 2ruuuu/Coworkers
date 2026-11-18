import axios from 'axios';

import { MISSING_API_BASE_URL_MESSAGE } from '@/lib/apiUrl';
import { ConfigError } from '@/lib/error';

/**
 * 인증이 필요 없는 공개 API 전용 axios 인스턴스. (게시글 목록, 회원가입, 비밀번호 재설정 등)
 * 인증 토큰은 httpOnly 쿠키에 있어 브라우저에서 붙일 수 없으므로,
 * 인증이 필요한 요청은 Server Action(쓰기) 또는 BFF 라우트(`bffGet`, 읽기)를 사용한다.
 */
const publicFetcher = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API 주소가 없으면 요청이 우리 Next 서버로 잘못 가므로(404) 보내기 전에 원인을 알린다.
publicFetcher.interceptors.request.use((config) => {
  if (!config.baseURL) {
    throw new ConfigError(MISSING_API_BASE_URL_MESSAGE);
  }

  return config;
});

export default publicFetcher;
