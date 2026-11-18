import { unstable_rethrow } from 'next/navigation';

import { BusinessError, getErrorMessage, getErrorStatus } from '@/lib/error';

/**
 * 모든 Server Action의 공통 반환 형식.
 * 운영 빌드에서는 Server Action이 던진 에러 메시지가 클라이언트에 전달되지 않으므로,
 * 에러를 던지지 않고 결과 객체로 반환한다.
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; status?: number };

/**
 * Server Action 본문을 실행하고 ActionResult로 감싼다.
 * redirect()/notFound() 같은 Next.js 내부 에러는 다시 던진다.
 */
export const runAction = async <T>(
  action: () => Promise<T>,
  fallbackMessage: string,
): Promise<ActionResult<T>> => {
  try {
    return { success: true, data: await action() };
  } catch (error) {
    unstable_rethrow(error);

    return {
      success: false,
      error: getErrorMessage(error, fallbackMessage),
      status: getErrorStatus(error),
    };
  }
};

/** 클라이언트(React Query의 queryFn/mutationFn)에서 ActionResult를 풀어 실패 시 BusinessError를 던진다. */
export const unwrapActionResult = <T>(result: ActionResult<T>): T => {
  if (!result.success) {
    throw new BusinessError(result.error, result.status);
  }

  return result.data;
};
