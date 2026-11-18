import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  ApiError,
  BusinessError,
  ConfigError,
  getErrorMessage,
  getErrorStatus,
  isDuplicateNameError,
} from './error';

const createAxiosError = (status: number, message?: string) =>
  new AxiosError('fail', 'ERR', undefined, undefined, {
    status,
    data: { message },
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe('ApiError', () => {
  it('JSON 본문의 message를 서버 메시지로 사용한다', () => {
    const error = new ApiError(400, JSON.stringify({ message: '잘못된 요청' }));
    expect(error.status).toBe(400);
    expect(error.serverMessage).toBe('잘못된 요청');
  });

  it('JSON이 아니면 본문 텍스트를 그대로 사용한다', () => {
    expect(new ApiError(500, 'Internal').serverMessage).toBe('Internal');
    expect(new ApiError(500, '').serverMessage).toBeUndefined();
  });
});

describe('getErrorMessage', () => {
  it('에러 종류별로 사용자 메시지를 꺼낸다', () => {
    expect(getErrorMessage(new ApiError(400, '{"message":"서버"}'), '기본')).toBe('서버');
    expect(getErrorMessage(new BusinessError('비즈니스'), '기본')).toBe('비즈니스');
    expect(getErrorMessage(createAxiosError(400, 'axios'), '기본')).toBe('axios');
  });

  it('zod 검증 에러는 첫 번째 메시지를 사용한다', () => {
    const result = z.string().min(1, '입력해주세요').safeParse('');
    expect(getErrorMessage(result.error, '기본')).toBe('입력해주세요');
  });

  it('알 수 없는 에러는 기본 문구를 사용한다 (내부 메시지 노출 방지)', () => {
    expect(getErrorMessage(new Error('stack trace'), '기본')).toBe('기본');
    expect(getErrorMessage('string', '기본')).toBe('기본');
  });
});

describe('getErrorStatus / isDuplicateNameError', () => {
  it('상태 코드를 꺼낸다', () => {
    expect(getErrorStatus(new ApiError(404, ''))).toBe(404);
    expect(getErrorStatus(new BusinessError('x', 409))).toBe(409);
    expect(getErrorStatus(createAxiosError(401))).toBe(401);
    expect(getErrorStatus(new Error('x'))).toBeUndefined();
  });

  it('409 또는 "이미 존재" 메시지를 이름 중복으로 판단한다', () => {
    expect(isDuplicateNameError(new ApiError(409, ''))).toBe(true);
    expect(isDuplicateNameError(new BusinessError('이미 존재하는 이름입니다.'))).toBe(true);
    expect(isDuplicateNameError(new ApiError(400, '{"message":"이미 존재합니다"}'))).toBe(true);
    expect(isDuplicateNameError(new ApiError(400, '{"message":"다른 에러"}'))).toBe(false);
  });
});

describe('ConfigError', () => {
  it('개발 환경에서는 설정 누락 원인을 그대로 보여준다', () => {
    expect(getErrorMessage(new ConfigError('API 주소가 없습니다'), '기본')).toBe(
      'API 주소가 없습니다',
    );
  });
});
