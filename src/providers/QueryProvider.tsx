'use client';

import dynamic from 'next/dynamic';

import { QueryClientProvider } from '@tanstack/react-query';

import { getQueryClient } from '@/lib/queryClient';

interface QueryProviderProps {
  children: React.ReactNode;
}

// 환경 변수로 켠 경우에만 devtools 청크를 불러온다. (프로덕션 번들에 포함되지 않음)
const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then((module) => module.ReactQueryDevtools),
  { ssr: false },
);

const SHOULD_SHOW_REACT_QUERY_DEVTOOLS =
  process.env.NEXT_PUBLIC_ENABLE_REACT_QUERY_DEVTOOLS === 'true';

const QueryProvider = ({ children }: QueryProviderProps) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {SHOULD_SHOW_REACT_QUERY_DEVTOOLS && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default QueryProvider;
