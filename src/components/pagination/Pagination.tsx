import ArrowLeftIcon from '@/assets/icons/arrow_left.svg?react';
import ArrowRightIcon from '@/assets/icons/arrow_right.svg?react';
import { cn } from '@/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** 한 번에 보여줄 페이지 번호 개수 */
  pageWindow?: number;
  label: string;
}

const ARROW_BUTTON_CLASS =
  'hover:bg-background-tertiary hover:text-text-primary text-md disabled:text-text-disabled focus-visible:ring-brand-primary flex items-center justify-center gap-1 rounded-md px-2 py-1 font-medium outline-none focus-visible:ring-2 disabled:cursor-not-allowed';

/** 이전/다음 + 페이지 번호 페이지네이션 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageWindow = 5,
  label,
}: PaginationProps) => {
  const startPage = Math.max(
    1,
    Math.min(currentPage - Math.floor(pageWindow / 2), totalPages - pageWindow + 1),
  );
  const endPage = Math.min(totalPages, startPage + pageWindow - 1);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  return (
    <nav aria-label={label} className="mt-8 flex justify-center gap-2">
      <button
        type="button"
        aria-label="이전 페이지"
        className={ARROW_BUTTON_CLASS}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ArrowLeftIcon className="size-4" aria-hidden="true" />
      </button>

      {pages.map((pageNumber) => {
        const isCurrentPage = currentPage === pageNumber;

        return (
          <button
            type="button"
            key={pageNumber}
            aria-label={`${pageNumber}페이지`}
            aria-current={isCurrentPage ? 'page' : undefined}
            className={cn(
              'focus-visible:ring-brand-primary flex h-8 w-8 items-center justify-center gap-1 rounded-full outline-none focus-visible:ring-2',
              isCurrentPage
                ? 'bg-brand-primary text-text-inverse'
                : 'hover:bg-background-tertiary hover:text-text-primary',
            )}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="다음 페이지"
        className={ARROW_BUTTON_CLASS}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;
