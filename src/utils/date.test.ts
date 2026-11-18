import { describe, expect, it } from 'vitest';

import {
  addDaysToISODate,
  formatDate,
  generateHoursByInterval,
  generateMinutesByInterval,
  getServiceDate,
  getWeekDatesAround,
  parseISODate,
  toServiceDate,
} from './date';

describe('date', () => {
  describe('generateMinutesByInterval', () => {
    it('30분 간격 테스트', () => {
      // Arrange
      const interval = 30;
      const expected = [0, 30];

      // Act
      const result = generateMinutesByInterval(interval);

      // Assert
      expect(result).toEqual(expected);
    });

    it('인수 없는 경우 테스트', () => {
      // Arrange
      const expected = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
      ];

      // Act
      const result = generateMinutesByInterval();

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('generateHoursByInterval', () => {
    it('6시간 간격 테스트', () => {
      // Arrange
      const interval = 6;
      const expected = [0, 6, 12, 18];

      // Act
      const result = generateHoursByInterval(interval);

      // Assert
      expect(result).toEqual(expected);
    });

    it('인수 없는 경우 테스트', () => {
      // Arrange
      const expected = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
      ];

      // Act
      const result = generateHoursByInterval();

      // Assert
      expect(result).toEqual(expected);
    });
  });
});

describe('getWeekDates', () => {
  it('월 경계 테스트', () => {
    // Arrange
    const testDate = new Date('2026-03-01');
    const expected = [
      new Date('2026-02-26'),
      new Date('2026-02-27'),
      new Date('2026-02-28'),
      new Date('2026-03-01'),
      new Date('2026-03-02'),
      new Date('2026-03-03'),
      new Date('2026-03-04'),
    ];

    // Act
    const result = getWeekDatesAround(testDate);

    // Assert
    expect(result).toEqual(expected);
  });

  it('연도 경계 테스트', () => {
    // Arrange
    const testDate = new Date('2026-01-01');
    const expected = [
      new Date('2025-12-29'),
      new Date('2025-12-30'),
      new Date('2025-12-31'),
      new Date('2026-01-01'),
      new Date('2026-01-02'),
      new Date('2026-01-03'),
      new Date('2026-01-04'),
    ];

    // Act
    const result = getWeekDatesAround(testDate);

    // Assert
    expect(result.length).toBe(7);
    expect(result).toEqual(expected);
  });

  describe('getServiceDate (Asia/Seoul 기준)', () => {
    it('UTC 15시 이후는 서울 기준 다음 날이다', () => {
      expect(getServiceDate(new Date('2026-06-12T15:30:00.000Z'))).toBe('2026-06-13');
    });

    it('UTC 15시 이전은 같은 날이다', () => {
      expect(getServiceDate(new Date('2026-06-12T14:59:59.000Z'))).toBe('2026-06-12');
    });
  });

  describe('toServiceDate', () => {
    it('날짜만 있는 문자열은 그대로 반환한다', () => {
      expect(toServiceDate('2026-06-26')).toBe('2026-06-26');
    });

    it('시각이 포함된 문자열은 서울 기준 날짜로 변환한다', () => {
      expect(toServiceDate('2026-06-24T15:00:00.000Z')).toBe('2026-06-25');
    });

    it('비어 있거나 잘못된 값은 undefined를 반환한다', () => {
      expect(toServiceDate(null)).toBeUndefined();
      expect(toServiceDate('invalid-date')).toBeUndefined();
    });
  });

  describe('formatDate', () => {
    it('서울 기준 YYYY. MM. DD 형식으로 반환한다', () => {
      expect(formatDate('2026-06-12T15:30:00.000Z')).toBe('2026. 06. 13');
    });

    it('유효하지 않은 날짜 입력은 빈 문자열을 반환한다', () => {
      expect(formatDate('not-a-date')).toBe('');
    });
  });

  describe('addDaysToISODate', () => {
    it('월/연도 경계를 넘어 계산한다', () => {
      expect(addDaysToISODate('2026-12-31', 1)).toBe('2027-01-01');
      expect(addDaysToISODate('2026-03-01', -1)).toBe('2026-02-28');
    });
  });

  describe('parseISODate', () => {
    it('YYYY-MM-DD를 로컬 자정 Date로 만든다', () => {
      const date = parseISODate('2026-06-12');
      expect(date?.getFullYear()).toBe(2026);
      expect(date?.getMonth()).toBe(5);
      expect(date?.getDate()).toBe(12);
    });

    it('형식이 다르면 undefined를 반환한다', () => {
      expect(parseISODate('2026/06/12')).toBeUndefined();
      expect(parseISODate(null)).toBeUndefined();
    });
  });
});
