import type { User } from '@/apis/user/type';

export interface SignUpRequest {
  image?: string;
  email: string;
  nickname: string;
  password: string;
  passwordConfirmation: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface OAuthSignInRequest {
  token: string;
  state?: string;
  redirectUri?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
