import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Profile from './Profile';

const meta: Meta<typeof Profile> = {
  title: 'Components/Profile',
  component: Profile,
  argTypes: {
    size: {
      control: 'select',
      options: ['lg', 'md', 'sm'],
      description: '프로필의 크기를 결정합니다. (lg: 40px, md: 32px, sm: 24px)',
    },
    src: {
      control: 'text',
      description: '프로필 이미지의 URL 주소입니다. 빈 값이면 profile.svg 기본 아이콘이 뜹니다.',
    },
    alt: {
      control: 'text',
      description: '이미지 로딩에 실패하거나 스크린 리더가 읽을 대체 텍스트입니다.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Profile>;

// 외부 네트워크 없이 보이도록 data URL을 사용한다.
const MOCK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="%235189fa"/></svg>';

export const Default: Story = {
  args: {
    size: 'md',
    src: MOCK_IMAGE,
    alt: '사용자 프로필 이미지',
  },
};

export const AllStates: Story = {
  render: (args) => (
    <div className="flex w-fit flex-col gap-6 rounded-2xl bg-[#333333] p-6">
      <div className="flex items-center gap-[30px]">
        <div className="w-[90px] text-sm font-semibold text-white">상태 / 크기</div>
        <div className="w-[50px] text-center text-xs text-[#ccc]">Large (40)</div>
        <div className="w-[50px] text-center text-xs text-[#ccc]">Medium (32)</div>
        <div className="w-[50px] text-center text-xs text-[#ccc]">Small (24)</div>
      </div>

      <hr className="m-0 border-t border-none border-[#444]" />

      {/* 이미지 있음 상태 */}
      <div className="flex items-center gap-[30px]">
        <div className="w-[90px] text-sm text-[#aaa]">이미지 있음</div>
        <div className="flex w-[50px] justify-center">
          <Profile {...args} size="lg" src={MOCK_IMAGE} />
        </div>
        <div className="flex w-[50px] justify-center">
          <Profile {...args} size="md" src={MOCK_IMAGE} />
        </div>
        <div className="flex w-[50px] justify-center">
          <Profile {...args} size="sm" src={MOCK_IMAGE} />
        </div>
      </div>

      {/* 이미지 없음 (기본 SVG 아이콘) 상태 */}
      <div className="flex items-center gap-[30px]">
        <div className="w-[90px] text-sm text-[#aaa]">이미지 없음</div>
        <div className="flex w-[50px] justify-center">
          <Profile {...args} size="lg" src={null} />
        </div>
        <div className="flex w-[50px] justify-center">
          <Profile {...args} size="md" src={null} />
        </div>
        <div className="flex w-[50px] justify-center">
          <Profile {...args} size="sm" src={null} />
        </div>
      </div>
    </div>
  ),
};

export const Large: Story = {
  args: {
    size: 'lg',
    src: MOCK_IMAGE,
    alt: 'Large Profile',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    src: MOCK_IMAGE,
    alt: 'Medium Profile',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    src: MOCK_IMAGE,
    alt: 'Small Profile',
  },
};

export const Placeholder: Story = {
  args: {
    size: 'md',
    src: null,
    alt: 'Default Profile',
  },
};
