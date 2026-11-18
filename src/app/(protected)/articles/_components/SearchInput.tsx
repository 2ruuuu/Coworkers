'use client';

import type { InputHTMLAttributes } from 'react';

import SearchIcon from '@/assets/icons/search.svg?react';
import { cn } from '@/utils/cn';

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

/** 검색 입력란. aria-label 등 input 속성을 그대로 전달한다. */
const SearchInput = ({ className, ...props }: SearchInputProps) => {
  return (
    <div className="relative">
      <SearchIcon className="absolute top-1/2 left-4 -translate-y-1/2" aria-hidden="true" />
      <input
        type="search"
        className={cn(
          'border-brand-primary focus-visible:ring-brand-primary/40 h-14 w-full rounded-full border-2 px-14 outline-none focus-visible:ring-4 md:w-105',
          className,
        )}
        {...props}
      />
    </div>
  );
};

export default SearchInput;
