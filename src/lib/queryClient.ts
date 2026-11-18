import { MutationCache, QueryCache, QueryClient, isServer } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { getErrorMessage } from '@/lib/error';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** 실패 시 전역 토스트에 표시할 기본 문구 */
      errorMessage?: string;
      /** true면 전역 에러 토스트를 띄우지 않는다. (화면에서 직접 에러를 표시하는 경우) */
      silentError?: boolean;
    };
  }
}

const DEFAULT_ERROR_MESSAGE = '요청 중 오류가 발생했어요.';

const makeQueryClient = () => {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // 이미 화면에 데이터가 있는 상태에서 백그라운드 재조회가 실패한 경우에만 알린다.
        if (query.state.data !== undefined) {
          toast.error(getErrorMessage(error, DEFAULT_ERROR_MESSAGE));
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.silentError) return;
        toast.error(getErrorMessage(error, mutation.meta?.errorMessage ?? DEFAULT_ERROR_MESSAGE));
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined;

/**
 * 서버에서는 요청마다 새 QueryClient를, 브라우저에서는 하나의 QueryClient를 재사용한다.
 * 서버 컴포넌트의 prefetch와 클라이언트 Provider가 같은 기본 옵션을 공유한다.
 */
export const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  }

  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
};
