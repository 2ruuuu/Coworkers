'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type SearchParamValue = string | number | null | undefined;

/** 현재 URL의 쿼리 파라미터를 읽고, 일부만 바꿔서 이동한다. (값이 비어 있으면 삭제) */
export const useCustomSearchParams = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setSearchParams = (
    params: Record<string, SearchParamValue>,
    { replace = false }: { replace?: boolean } = {},
  ) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') nextParams.delete(key);
      else nextParams.set(key, String(value));
    });

    const query = nextParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    if (replace) router.replace(href, { scroll: false });
    else router.push(href, { scroll: false });
  };

  return { searchParams, setSearchParams };
};
