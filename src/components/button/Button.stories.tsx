import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import CheckBlueIcon from '@/assets/icons/check_blue.svg?react';
import CheckWhiteIcon from '@/assets/icons/check_white.svg?react';
import HeartEmptyIcon from '@/assets/icons/heart_empty.svg?react';
import HeartFillIcon from '@/assets/icons/heart_fill.svg?react';
import PlusGrayIcon from '@/assets/icons/plus_gray.svg?react';
import PlusWhiteIcon from '@/assets/icons/plus_white.svg?react';

import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary-filled',
        'primary-outline',
        'secondary-filled',
        'secondary-whiteFilled',
        'danger-filled',
        'icon-circle',
        'icon-circle-white',
        'input-btn',
      ],
    },
    isLoading: {
      control: 'boolean',
    },
    buttonState: {
      control: 'select',
      options: ['default', 'disabled'],
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    icon: {
      control: 'select',
      options: [
        'None',
        'Check_Blue',
        'Check_White',
        'Plus_White',
        'Plus_Gray',
        'Heart_Fill',
        'Heart_Empty',
      ],
      mapping: {
        None: undefined,
        Check_Blue: <CheckBlueIcon width={16} height={16} aria-hidden="true" />,
        Check_White: <CheckWhiteIcon width={16} height={16} aria-hidden="true" />,
        Plus_White: <PlusWhiteIcon width={24} height={24} aria-hidden="true" />,
        Plus_Gray: <PlusGrayIcon width={16} height={16} aria-hidden="true" />,
        Heart_Fill: <HeartFillIcon width={16} height={16} aria-hidden="true" />,
        Heart_Empty: <HeartEmptyIcon width={16} height={16} aria-hidden="true" />,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    variant: 'primary-filled',
    children: '생성하기',
    disabled: false,
    fullWidth: false,
  },
};

export const AllVariants: Story = {
  render: (args: React.ComponentProps<typeof Button>) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button {...args} variant="primary-filled">
          primary-filled
        </Button>
        <Button {...args} variant="primary-outline">
          primary-outline
        </Button>
        <Button {...args} variant="danger-filled">
          danger-filled
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button {...args} variant="secondary-filled">
          secondary-filled
        </Button>
        <Button {...args} variant="secondary-whiteFilled">
          secondary-whiteFilled
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Button
          {...args}
          variant="icon-circle"
          icon={<PlusWhiteIcon width={24} height={24} aria-hidden="true" />}
        />

        <Button
          {...args}
          variant="icon-circle-white"
          icon={<PlusGrayIcon width={24} height={24} aria-hidden="true" />}
        />

        <Button
          {...args}
          variant="input-btn"
          icon={<PlusGrayIcon width={16} height={16} aria-hidden="true" />}
        >
          할 일
        </Button>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    variant: 'primary-filled',
    children: '완료 취소하기',
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'secondary-whiteFilled',
    children: '완료 취소하기',
    icon: <span>✓</span>,
  },
};

export const FullWidth: Story = {
  args: {
    variant: 'primary-filled',
    children: '전체 너비 버튼',
    fullWidth: true,
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary-filled',
    children: '저장하기',
    isLoading: true,
    loadingLabel: '저장 중...',
  },
};
