/** 서비스 기준 시간대. 서버(UTC)와 브라우저 시간대에 상관없이 날짜를 이 기준으로 계산한다. */
export const SERVICE_TIME_ZONE = 'Asia/Seoul';

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type DateInput = string | number | Date;
type MinuteInterval = 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30 | 60;
type HourInterval = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 24;

const toDate = (input: DateInput) => (input instanceof Date ? input : new Date(input));
const pad2 = (value: number | string) => String(value).padStart(2, '0');

const serviceDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: SERVICE_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const getServiceDateParts = (date: Date) => {
  const parts = serviceDateFormatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return { year: get('year'), month: get('month'), day: get('day') };
};

/** 서비스 시간대(Asia/Seoul) 기준 날짜를 'YYYY-MM-DD'로 반환한다. 기본값은 오늘. */
export const getServiceDate = (input: DateInput = new Date()) => {
  const { year, month, day } = getServiceDateParts(toDate(input));
  return `${year}-${month}-${day}`;
};

/**
 * 날짜 문자열을 서비스 시간대 기준 'YYYY-MM-DD'로 정규화한다.
 * 이미 날짜만 있는 문자열은 그대로, 시각이 포함된 문자열은 서비스 시간대로 변환한다.
 */
export const toServiceDate = (value: string | null | undefined) => {
  if (!value) return undefined;
  if (DATE_ONLY_PATTERN.test(value)) return value;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : getServiceDate(date);
};

/** 'YYYY. MM. DD' (서비스 시간대 기준). 잘못된 값이면 빈 문자열 */
export const formatDate = (input: DateInput) => {
  const date = toDate(input);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const { year, month, day } = getServiceDateParts(date);
  return `${year}. ${month}. ${day}`;
};

/** 'YYYY-MM-DD'에 일 수를 더한다. (시간대 영향 없음) */
export const addDaysToISODate = (isoDate: string, days: number) => {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

/** 'YYYY-MM-DD'를 브라우저 로컬 자정의 Date로 만든다. 잘못된 값이면 undefined */
export const parseISODate = (isoDate: string | null | undefined) => {
  if (!isoDate || !DATE_ONLY_PATTERN.test(isoDate)) return undefined;

  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return Number.isNaN(date.getTime()) ? undefined : date;
};

/** 로컬 Date(달력에서 고른 날짜)를 'YYYY-MM-DD'로 반환한다. */
export const formatISODate = (date: Date) => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

export const formatYearMonth = (date: Date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
};

export const formatYearMonthDay = (date: Date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getWeekDatesAround = (selectedDate: Date) => {
  return Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i - 3));
};

export const generateMinutesByInterval = (interval: MinuteInterval = 1) => {
  return Array.from({ length: 60 / interval }, (_, i) => i * interval);
};

export const generateHoursByInterval = (interval: HourInterval = 1) => {
  return Array.from({ length: 24 / interval }, (_, i) => i * interval);
};
