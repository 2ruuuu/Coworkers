'use client';

import { useSyncExternalStore } from 'react';

export const MEDIA_QUERY = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1279px)',
  desktop: '(min-width: 1280px)',
} as const;
type MediaQuery = (typeof MEDIA_QUERY)[keyof typeof MEDIA_QUERY];

/** 미디어 쿼리 일치 여부. 서버 렌더에서는 false. (함수 메모이제이션은 React Compiler가 처리) */
export default function useMediaQuery(query: MediaQuery) {
  const subscribe = (callback: () => void) => {
    const mediaQuery = window.matchMedia(query);

    mediaQuery.addEventListener('change', callback);

    return () => {
      mediaQuery.removeEventListener('change', callback);
    };
  };

  const getSnapshot = () => window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
