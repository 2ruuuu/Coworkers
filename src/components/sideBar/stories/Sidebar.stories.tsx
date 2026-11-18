import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import SidebarView from '@/components/sidebar/SidebarView';

const MOCK_USER = {
  id: 1,
  nickname: 'John Doe',
  email: 'john.doe@example.com',
  image: null,
  teamId: '1',
  createdAt: '2026-06-19',
  updatedAt: '2026-06-19',
};

const MOCK_GROUPS = [
  { id: 1, name: '경영관리팀' },
  { id: 2, name: '프로덕트팀' },
];

const meta = {
  title: 'Components/Sidebar',
  component: SidebarView,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/1' },
    },
  },
  args: {
    collapsed: false,
    groups: MOCK_GROUPS,
    user: MOCK_USER,
    onToggleCollapse: () => {},
  },
  decorators: [
    (Story) => (
      <div className="bg-background-secondary h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Expanded: Story = {};

export const Collapsed: Story = {
  args: { collapsed: true },
};

export const LoadingUser: Story = {
  args: { user: undefined },
};
