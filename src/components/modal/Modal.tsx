'use client';

import { useEffect, useId, useRef, useSyncExternalStore } from 'react';
import type { MouseEvent } from 'react';

import { createPortal } from 'react-dom';

import AlertIcon from '@/assets/icons/alert.svg?react';
import { cn } from '@/utils/cn';

import Button from '../button/Button';
import type { ButtonVariant } from '../button/type';
import type { ModalAction, ModalProps, ModalSize, ModalVariant } from './type';

type ModalButtonVariant = 'primary' | 'secondary';

interface ModalButtonProps {
  action: ModalAction;
  variant: ModalButtonVariant;
  modalVariant: ModalVariant;
}

const MODAL_SIZE_CLASS: Record<ModalSize, string> = {
  sm: 'w-full max-w-[280px]',
  md: 'w-full max-w-[320px]',
  lg: 'w-full max-w-[420px]',
};

const PRIMARY_BUTTON_VARIANT: Record<ModalVariant, ButtonVariant> = {
  default: 'primary-filled',
  danger: 'danger-filled',
};

const subscribeToClientStore = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** 열린 모달 스택. Escape와 포커스 트랩은 가장 위의 모달에만 적용한다. */
const openModalStack: string[] = [];
let originalBodyOverflow = '';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const getFocusableElements = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

const getActionButtonLabel = ({ isLoading, label, loadingLabel = '처리 중' }: ModalAction) => {
  if (isLoading) {
    return loadingLabel;
  }

  return label;
};

const getModalButtonVariant = (
  variant: ModalButtonVariant,
  modalVariant: ModalVariant,
): ButtonVariant => {
  if (variant === 'secondary') {
    return 'secondary-whiteFilled';
  }

  return PRIMARY_BUTTON_VARIANT[modalVariant];
};

const ModalButton = ({ action, variant, modalVariant }: ModalButtonProps) => {
  return (
    <Button
      type={action.buttonType ?? 'button'}
      variant={getModalButtonVariant(variant, modalVariant)}
      className="h-10 min-w-0 flex-1 rounded-md px-4 py-0 text-xs font-semibold"
      disabled={action.disabled || action.isLoading}
      aria-busy={action.isLoading || undefined}
      onClick={action.onClick}
    >
      {getActionButtonLabel(action)}
    </Button>
  );
};

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M4 4L12 12M12 4L4 12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Modal = ({
  isOpen,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  variant = 'default',
  size = 'sm',
  showCloseButton = true,
  closeButtonLabel = '모달 닫기',
  closeOnOverlayClick = true,
  className,
  contentClassName,
  onClose,
}: ModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const isClient = useSyncExternalStore(
    subscribeToClientStore,
    getClientSnapshot,
    getServerSnapshot,
  );
  const hasFooter = Boolean(primaryAction || secondaryAction);

  const modalId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen || !isClient) {
      return;
    }

    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const isTopModal = () => openModalStack[openModalStack.length - 1] === modalId;

    openModalStack.push(modalId);

    if (openModalStack.length === 1) {
      originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    // 열리면 모달 안의 첫 번째 입력 요소(없으면 대화상자 자체)로 포커스를 옮긴다.
    const dialog = dialogRef.current;
    if (dialog) {
      const focusables = getFocusableElements(dialog);
      const firstField = focusables.find((element) =>
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName),
      );
      (firstField ?? dialog).focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopModal() || !dialogRef.current) {
        return;
      }

      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      // Tab 포커스가 모달 밖으로 나가지 않도록 처음/끝에서 순환시킨다.
      if (event.key === 'Tab') {
        const focusables = getFocusableElements(dialogRef.current);

        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      const index = openModalStack.indexOf(modalId);
      if (index !== -1) openModalStack.splice(index, 1);

      if (openModalStack.length === 0) {
        document.body.style.overflow = originalBodyOverflow;
        originalBodyOverflow = '';
      }

      document.removeEventListener('keydown', handleKeyDown);
      // 닫히면 모달을 열었던 요소로 포커스를 돌려준다.
      previouslyFocusedElement?.focus();
    };
  }, [isOpen, isClient, modalId]);

  if (!isClient || !isOpen) {
    return null;
  }

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8"
      onClick={handleOverlayClick}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          'bg-background-primary relative max-h-[calc(100dvh-64px)] overflow-y-auto rounded-2xl px-6 py-6 outline-none',
          'shadow-[0_16px_40px_rgb(15_23_42/0.18)]',
          MODAL_SIZE_CLASS[size],
          className,
        )}
      >
        {showCloseButton && (
          <button
            type="button"
            aria-label={closeButtonLabel}
            className="hover:bg-background-secondary focus-visible:ring-brand-primary absolute top-3 right-3 flex size-5 items-center justify-center rounded-sm transition-colors outline-none focus-visible:ring-2"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        )}

        <div className="flex flex-col items-center px-4 text-center">
          {variant === 'danger' && <AlertIcon className="mb-4 size-6" aria-hidden="true" />}

          <h2 id={titleId} className="text-text-primary text-sm font-semibold">
            {title}
          </h2>

          {description && (
            <p id={descriptionId} className="text-text-default mt-2 text-xs whitespace-pre-line">
              {description}
            </p>
          )}
        </div>

        {children && <div className={cn('mt-6', contentClassName)}>{children}</div>}

        {hasFooter && (
          <div className="mt-6 flex gap-2">
            {secondaryAction && (
              <ModalButton action={secondaryAction} variant="secondary" modalVariant={variant} />
            )}

            {primaryAction && (
              <ModalButton action={primaryAction} variant="primary" modalVariant={variant} />
            )}
          </div>
        )}
      </section>
    </div>
  );

  return createPortal(modal, document.body);
};

export default Modal;
