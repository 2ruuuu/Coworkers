import CalendarIcon from '@/assets/icons/calendar.svg?react';
import RepeatIcon from '@/assets/icons/repeat.svg?react';
import { FREQUENCY_TEXT } from '@/constants/listItem';
import { formatYearMonthDay, parseISODate, toServiceDate } from '@/utils/date';

import { type ListItemDateProps } from './type';

/** 할 일 날짜를 서비스 시간대 기준 'YYYY년 M월 D일'로 표시한다. */
const formatTaskDate = (date: string | null) => {
  const localDate = parseISODate(toServiceDate(date));
  return localDate ? formatYearMonthDay(localDate) : '';
};

const ListItemDate = ({ date, frequency }: ListItemDateProps) => {
  return (
    <div className="flex items-center">
      {/* Date */}
      <div className="border-text-default flex items-center gap-1.5 border-r pr-2">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          <CalendarIcon width={16} height={16} aria-hidden="true" />
        </span>
        <span>{formatTaskDate(date)}</span>
      </div>

      {/* Recurring */}
      <div className="flex items-center gap-1.5 px-2">
        <RepeatIcon width={16} height={16} aria-hidden="true" />
        <span>{FREQUENCY_TEXT[frequency]}</span>
      </div>
    </div>
  );
};

export default ListItemDate;
