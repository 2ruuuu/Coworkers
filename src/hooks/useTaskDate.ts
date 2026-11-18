'use client';

import { formatISODate, parseISODate } from '@/utils/date';

import { useCustomSearchParams } from './useCustomSearchParams';

/** URL의 date(YYYY-MM-DD) 파라미터를 선택된 날짜로 사용한다. 없으면 오늘. */
export const useTaskDate = () => {
  const { searchParams, setSearchParams } = useCustomSearchParams();
  const selectedDate = parseISODate(searchParams.get('date')) ?? new Date();

  const setDate = (date: Date) => setSearchParams({ date: formatISODate(date) });

  return { selectedDate, setDate };
};
