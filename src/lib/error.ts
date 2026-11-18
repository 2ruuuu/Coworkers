import axios from 'axios';
import { ZodError } from 'zod';

interface ErrorResponse {
  message?: string;
}

/** 백엔드 API가 2xx가 아닌 응답을 반환했을 때 던지는 에러 */
export class ApiError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(ApiError.extractMessage(body) ?? `API request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }

  /** 서버가 내려준 사용자용 메시지(JSON의 message 또는 텍스트 본문) */
  get serverMessage() {
    return ApiError.extractMessage(this.body);
  }

  private static extractMessage(body: string) {
    if (!body) return undefined;

    try {
      const data = JSON.parse(body) as ErrorResponse;
      return data.message || undefined;
    } catch {
      return body;
    }
  }
}

/** 필수 환경 변수 누락 등 실행 환경 설정 문제 */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * 사용자에게 그대로 보여줘도 되는 메시지를 가진 에러.
 * Server Action 결과(ActionResult)의 실패를 클라이언트에서 다시 던질 때 사용한다.
 */
export class BusinessError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'BusinessError';
    this.status = status;
  }
}

export const getErrorStatus = (error: unknown): number | undefined => {
  if (axios.isAxiosError(error)) return error.response?.status;
  if (error instanceof ApiError || error instanceof BusinessError) return error.status;
  return undefined;
};

export const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.message ?? fallbackMessage;
  }

  if (error instanceof ApiError) {
    return error.serverMessage ?? fallbackMessage;
  }

  if (error instanceof BusinessError) {
    return error.message;
  }

  // 개발 중에는 설정 누락 원인을 그대로 보여준다. (운영에서는 내부 정보를 숨김)
  if (isDevelopment && error instanceof ConfigError) {
    return error.message;
  }

  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? fallbackMessage;
  }

  return fallbackMessage;
};

const DUPLICATE_NAME_KEYWORD = '이미 존재';

export const isDuplicateNameError = (error: unknown) => {
  if (getErrorStatus(error) === 409) return true;

  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.message?.includes(DUPLICATE_NAME_KEYWORD) ?? false;
  }

  if (error instanceof ApiError) {
    return error.serverMessage?.includes(DUPLICATE_NAME_KEYWORD) ?? false;
  }

  return error instanceof Error && error.message.includes(DUPLICATE_NAME_KEYWORD);
};
