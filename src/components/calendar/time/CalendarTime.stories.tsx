import { type ComponentProps, useState } from 'react';

import { type Meta, type StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import CalendarTime from './CalendarTime';

// 모든 Story가 공유하는 상태 래퍼 (render 함수 안에서 훅을 직접 쓰지 않음)
const StatefulCalendarTime = (args: ComponentProps<typeof CalendarTime>) => {
  const [selectedTime, setSelectedTime] = useState(args.selectedTime);

  return <CalendarTime {...args} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />;
};

const meta = {
  component: CalendarTime,
  title: 'Components/CalendarTime',
  tags: ['autodocs'],
  render: (args) => <StatefulCalendarTime {...args} />,
} satisfies Meta<typeof CalendarTime>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedTime: {
      hour: 0,
      minute: 0,
    },
    setSelectedTime: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const {
      selectedTime: { hour, minute },
    } = args;
    const hourButtons = within(canvasElement).getByRole('button', {
      name: `${hour}시`,
    });
    const minuteButtons = within(canvasElement).getByRole('button', {
      name: `${minute}분`,
    });

    expect(hourButtons).toHaveClass('outline');
    expect(minuteButtons).toHaveClass('bg-brand-primary');
  },
};

export const ClickTest: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement }) => {
    // Arrange
    const hourButtons = within(canvasElement).getByRole('button', {
      name: `15시`,
    });
    const minuteButtons = within(canvasElement).getByRole('button', {
      name: `30분`,
    });

    // Act
    await userEvent.click(hourButtons);
    await userEvent.click(minuteButtons);

    // Assert
    expect(hourButtons).toHaveClass('outline');
    expect(minuteButtons).toHaveClass('bg-brand-primary');
  },
};
