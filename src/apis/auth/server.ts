import 'server-only';

import { ENDPOINTS } from '@/apis/endpoints';
import { serverFetcher } from '@/lib/serverFetcher';

import type { AuthResponse, OAuthSignInRequest, SignInRequest } from './type';

export const signInServer = async (body: SignInRequest) => {
  return serverFetcher<AuthResponse>(ENDPOINTS.auth.signIn, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const signInWithOAuthServer = async (provider: string, body: OAuthSignInRequest) => {
  return serverFetcher<AuthResponse>(ENDPOINTS.auth.signInWithOAuth(provider), {
    method: 'POST',
    body: JSON.stringify(body),
  });
};
