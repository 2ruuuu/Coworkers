import { useState } from 'react';

import { type Meta, type StoryObj } from '@storybook/nextjs-vite';

import KebabIcon from '@/assets/icons/kebab.svg?react';

import Dropdown from './Dropdown';
import DropdownSelect from './DropdownSelect';
import type { DropdownOption } from './type';

type SortValue = 'recent' | 'like';

const SORT_OPTIONS: DropdownOption<SortValue>[] = [
  { label: '최신순', value: 'recent' },
  { label: '좋아요순', value: 'like' },
];

const MENU_OPTIONS: DropdownOption<'EDIT' | 'DELETE'>[] = [
  { label: '수정하기', value: 'EDIT' },
  { label: '삭제하기', value: 'DELETE' },
];

const meta = {
  title: 'Components/Dropdown',
  component: DropdownSelect<SortValue>,
} satisfies Meta<typeof DropdownSelect<SortValue>>;

export default meta;

type Story = StoryObj<typeof meta>;

const SelectDemo = ({ size, defaultOpen }: { size: 'md' | 'sm'; defaultOpen?: boolean }) => {
  const [value, setValue] = useState<SortValue>('recent');

  return (
    <DropdownSelect
      label="정렬 기준"
      options={SORT_OPTIONS}
      value={value}
      onChange={setValue}
      size={size}
      defaultOpen={defaultOpen}
    />
  );
};

export const SelectMedium: Story = {
  args: { label: '정렬 기준', options: SORT_OPTIONS, value: 'recent', onChange: () => {} },
  render: () => <SelectDemo size="md" />,
};

export const SelectSmallOpen: Story = {
  args: { label: '정렬 기준', options: SORT_OPTIONS, value: 'recent', onChange: () => {} },
  render: () => <SelectDemo size="sm" defaultOpen />,
};

export const KebabMenu: Story = {
  args: { label: '정렬 기준', options: SORT_OPTIONS, value: 'recent', onChange: () => {} },
  render: () => (
    <div className="flex justify-end p-10">
      <Dropdown
        options={MENU_OPTIONS}
        onSelect={() => {}}
        trigger={<KebabIcon className="size-6" aria-hidden="true" />}
        triggerLabel="메뉴 열기"
      />
    </div>
  ),
};
