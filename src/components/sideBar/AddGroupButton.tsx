import Link from 'next/link';

import PlusIcon from '@/assets/icons/plus.svg?react';
import { ROUTES } from '@/constants/routes';

export default function AddGroupButton() {
  return (
    <Link
      href={ROUTES.ADD_TEAM}
      className="border-brand-primary text-brand-primary text-md hover:bg-brand-primary hover:text-brand-secondary focus-visible:ring-brand-primary my-3 flex items-center justify-center gap-1 rounded-full border px-3 py-2 transition-colors outline-none focus-visible:ring-2"
    >
      <PlusIcon className="h-4 w-4" aria-hidden="true" />팀 생성하기
    </Link>
  );
}
