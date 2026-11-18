import { type Meta, type StoryObj } from '@storybook/nextjs-vite';

import { MOCK_TASKLISTS } from '@/mocks/taskList';

import TaskListSet from './TaskListSet';

const meta = {
  component: TaskListSet,
  title: 'TaskList/Set',
  tags: ['autodocs'],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '0/tasklist',
        query: {
          taskListId: '0',
        },
      },
    },
  },
} satisfies Meta<typeof TaskListSet>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
  args: {
    taskLists: MOCK_TASKLISTS,
    selectedTaskListId: 0,
    groupId: 0,
  },
  globals: {
    viewport: {
      value: 'mobile',
      isRotated: false,
    },
  },
};

export const Desktop: Story = {
  args: Mobile.args,
  globals: {
    viewport: {
      value: 'desktop',
      isRotated: false,
    },
  },
};
