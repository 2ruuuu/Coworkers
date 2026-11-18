import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import EditableProfileImage from './EditableProfileImage';

const meta = {
  title: 'Components/EditableProfileImage',
  component: EditableProfileImage,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EditableProfileImage>;

export default meta;

type Story = StoryObj<typeof meta>;

// 외부 네트워크 없이 보이도록 data URL을 사용한다.
const SAMPLE_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="%235189fa"/></svg>';

export const Default: Story = {
  args: {
    src: SAMPLE_IMAGE,
    size: 'sm',
    onChange: () => {},
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'lg',
  },
};
