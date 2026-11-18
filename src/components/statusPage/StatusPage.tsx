import type { ReactNode } from 'react';

import LogoIcon from '@/assets/icons/logo_coworkers.svg?react';

interface StatusPageProps {
  code: string;
  title: string;
  description: ReactNode;
  /** 하단 버튼/링크 영역 */
  actions: ReactNode;
}

/** 404/500 같은 상태 안내 화면 */
const StatusPage = ({ code, title, description, actions }: StatusPageProps) => (
  <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 md:min-h-screen">
    <div className="flex w-full max-w-120 flex-col items-center text-center">
      <LogoIcon className="h-12 w-12 shrink-0 overflow-visible" aria-hidden="true" />

      <strong className="text-brand-primary mt-10 text-7xl leading-none font-semibold md:text-8xl">
        {code}
      </strong>

      <div className="mt-6 flex flex-col gap-2">
        <h1 className="text-text-primary text-xl font-semibold md:text-2xl">{title}</h1>
        <p className="text-text-default text-sm leading-6 md:text-base">{description}</p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">{actions}</div>
    </div>
  </section>
);

export const STATUS_PAGE_ACTION_CLASS =
  'bg-brand-primary text-background-primary hover:bg-interaction-hover active:bg-interaction-pressed focus-visible:ring-brand-primary inline-flex h-12 min-w-40 items-center justify-center rounded-xl px-6 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:text-base';

export const STATUS_PAGE_SECONDARY_ACTION_CLASS =
  'border-brand-primary text-brand-primary hover:bg-brand-secondary focus-visible:ring-brand-primary inline-flex h-12 min-w-40 items-center justify-center rounded-xl border px-6 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 md:text-base';

export default StatusPage;
