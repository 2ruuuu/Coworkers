import type { Preview } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OverlayProvider } from 'overlay-kit';

import '../src/app/globals.css';

// 컴포넌트가 React Query 훅(useQuery/useMutation)을 사용하므로 모든 스토리를 Provider로 감싼다.
// 스토리끼리 캐시가 섞이지 않도록 스토리마다 새 QueryClient를 만든다.
const createStoryQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });

const preview: Preview = {
  decorators: [
    (Story) => (
      <QueryClientProvider client={createStoryQueryClient()}>
        <OverlayProvider>
          <Story />
        </OverlayProvider>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
          },
        },

        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
          },
        },

        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
          },
        },
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
