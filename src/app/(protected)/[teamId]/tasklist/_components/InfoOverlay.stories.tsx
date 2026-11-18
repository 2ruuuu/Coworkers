import { type Meta, type StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fn } from 'storybook/test';

import { MOCK_COMMENTS, MOCK_TASKLISTS } from '@/mocks/taskList';
import { queryKeys } from '@/queries/queryKeys';

import InfoOverlay from './InfoOverlay';

const MOCK_TASK = MOCK_TASKLISTS[0].tasks[0];

// 네트워크 요청 없이 보이도록 캐시에 목 데이터를 미리 넣는다.
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });
queryClient.setQueryData(queryKeys.task.detail(MOCK_TASK.id), MOCK_TASK);
queryClient.setQueryData(queryKeys.taskComment.list(MOCK_TASK.id), MOCK_COMMENTS);

const meta = {
  component: InfoOverlay,
  title: 'TaskList/InfoOverlay',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof InfoOverlay>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    groupId: MOCK_TASKLISTS[0].groupId,
    taskListId: MOCK_TASKLISTS[0].id,
    taskId: MOCK_TASK.id,
    isOpen: true,
    onClose: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
};
