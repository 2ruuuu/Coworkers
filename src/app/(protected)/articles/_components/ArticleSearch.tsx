'use client';

import { useEffect, useRef, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';

import { SEARCH_DEBOUNCE_MS } from '../_constants/article';
import SearchInput from './SearchInput';

interface ArticleSearchProps {
  keyword: string;
  onSearch: (keyword: string) => void;
}

/** 입력이 멈춘 뒤(디바운스) 검색어를 URL에 반영한다. */
const ArticleSearch = ({ keyword, onSearch }: ArticleSearchProps) => {
  const [value, setValue] = useState(keyword);
  const [syncedKeyword, setSyncedKeyword] = useState(keyword);
  const debouncedValue = useDebounce(value, SEARCH_DEBOUNCE_MS);
  const lastSearchedRef = useRef(debouncedValue);

  // 뒤로가기 등으로 URL의 검색어가 바뀌면 입력란도 맞춘다.
  if (keyword !== syncedKeyword) {
    setSyncedKeyword(keyword);
    if (keyword !== value.trim()) setValue(keyword);
  }

  useEffect(() => {
    // 사용자가 입력을 바꿨을 때만 검색한다. (URL 변경으로 다시 검색하지 않도록)
    if (debouncedValue === lastSearchedRef.current) return;
    lastSearchedRef.current = debouncedValue;

    if (debouncedValue.trim() !== keyword) onSearch(debouncedValue);
  }, [debouncedValue, keyword, onSearch]);

  return (
    <form role="search" onSubmit={(event) => event.preventDefault()}>
      <SearchInput
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="검색어를 입력해주세요."
        aria-label="게시글 검색"
      />
    </form>
  );
};

export default ArticleSearch;
