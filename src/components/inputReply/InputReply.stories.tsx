import { type ComponentProps, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import InputReply from './InputReply';

const meta = {
  title: 'Components/InputReply',
  component: InputReply,
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputReply>;

export default meta;

type Story = StoryObj<typeof meta>;

// render 함수 안에서 훅을 쓰지 않도록 상태를 가진 컴포넌트로 감싼다.
const StatefulInputReply = (args: ComponentProps<typeof InputReply>) => {
  const [value, setValue] = useState(args.value ?? '');

  return <InputReply {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: (args) => <StatefulInputReply {...args} />,
  args: {
    size: 'sm',
    value: '안녕하세요',
    placeholder: '댓글을 달아주세요',
    onChange: () => {},
    onSubmit: () => {},
  },
};

export const Large: Story = {
  render: Default.render,
  args: {
    ...Default.args,
    size: 'lg',
    value: '',
  },
};
