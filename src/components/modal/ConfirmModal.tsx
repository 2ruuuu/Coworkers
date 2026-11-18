'use client';

import { useState } from 'react';

import Modal from './Modal';
import type { ModalVariant } from './type';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  loadingLabel?: string;
  cancelLabel?: string;
  variant?: ModalVariant;
  /** 완료되면 모달을 닫는다. 실패(예외)하면 모달을 연 채로 둔다. (에러 안내는 mutation 전역 토스트가 담당) */
  onConfirm: () => Promise<unknown>;
  onClose: () => void;
}

/** 삭제/내보내기처럼 확인 후 비동기 작업을 실행하는 모달 */
const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmLabel,
  loadingLabel = '처리 중',
  cancelLabel = '취소',
  variant = 'danger',
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    if (isPending) return;

    setIsPending(true);

    try {
      await onConfirm();
      onClose();
    } catch {
      // 에러는 호출한 쪽(mutation의 전역 onError)에서 안내한다.
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      description={description}
      primaryAction={{
        label: confirmLabel,
        loadingLabel,
        onClick: handleConfirm,
        isLoading: isPending,
      }}
      secondaryAction={{
        label: cancelLabel,
        onClick: onClose,
        disabled: isPending,
      }}
      variant={variant}
      size="md"
      closeOnOverlayClick={!isPending}
      onClose={onClose}
    />
  );
};

export default ConfirmModal;
