import { type UseMutationOptions, useMutation } from '@tanstack/react-query';

import { type ActionResult, unwrapActionResult } from '@/lib/action';

/**
 * Server Action으로 mutation을 만든다.
 * ActionResult가 실패면 BusinessError를 던지므로 onError/전역 토스트로 처리된다.
 */
export const useActionMutation = <TVariables, TData>(
  action: (variables: TVariables) => Promise<ActionResult<TData>>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>,
) => {
  return useMutation<TData, Error, TVariables>({
    ...options,
    mutationFn: async (variables) => unwrapActionResult(await action(variables)),
  });
};
