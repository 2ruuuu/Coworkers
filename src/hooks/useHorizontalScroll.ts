'use client';

import { useEffect, useRef, useState } from 'react';

const SCROLL_AMOUNT = 300;
const DRAG_THRESHOLD = 10;

interface ScrollState {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  isDragging: boolean;
}

/**
 * 가로 스크롤 영역의 좌/우 버튼 상태와 마우스 드래그 스크롤을 관리한다.
 * (핸들러 메모이제이션은 React Compiler가 처리한다)
 */
export default function useHorizontalScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T | null>(null);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const isDraggingRef = useRef(false);

  const [scrollState, setScrollState] = useState<ScrollState>({
    canScrollLeft: false,
    canScrollRight: false,
    isDragging: false,
  });

  const updateScrollState = () => {
    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth;

    setScrollState((prev) => ({
      ...prev,
      canScrollLeft: scrollElement.scrollLeft > 0,
      canScrollRight: scrollElement.scrollLeft < maxScrollLeft - 1,
    }));
  };

  const scrollByDirection = (direction: 'left' | 'right') => {
    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return;
    }

    scrollElement.scrollBy({
      left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: 'smooth',
    });

    window.setTimeout(updateScrollState, 250);
  };

  const handlePointerDown = (event: React.PointerEvent<T>) => {
    const scrollElement = scrollRef.current;

    if (
      event.pointerType !== 'mouse' ||
      event.button !== 0 ||
      !scrollElement ||
      scrollElement.scrollWidth <= scrollElement.clientWidth
    ) {
      return;
    }

    startXRef.current = event.clientX;
    startScrollLeftRef.current = scrollElement.scrollLeft;
    hasDraggedRef.current = false;
    isDraggingRef.current = true;
  };

  const handlePointerMove = (event: React.PointerEvent<T>) => {
    const scrollElement = scrollRef.current;

    if (!scrollElement || !isDraggingRef.current) {
      return;
    }

    const movedDistance = event.clientX - startXRef.current;

    if (!hasDraggedRef.current && Math.abs(movedDistance) > DRAG_THRESHOLD) {
      hasDraggedRef.current = true;
      scrollElement.setPointerCapture(event.pointerId);
      setScrollState((prev) => ({ ...prev, isDragging: true }));
    }

    if (!hasDraggedRef.current) {
      return;
    }

    event.preventDefault();
    scrollElement.scrollLeft = startScrollLeftRef.current - movedDistance;
  };

  const handlePointerUp = (event: React.PointerEvent<T>) => {
    const scrollElement = scrollRef.current;

    if (scrollElement?.hasPointerCapture(event.pointerId)) {
      scrollElement.releasePointerCapture(event.pointerId);
    }

    isDraggingRef.current = false;
    setScrollState((prev) => ({ ...prev, isDragging: false }));
    updateScrollState();

    if (hasDraggedRef.current) {
      window.setTimeout(() => {
        hasDraggedRef.current = false;
      }, 0);
    }
  };

  // 드래그로 스크롤한 직후의 클릭은 카드 링크로 이동하지 않도록 막는다.
  const handleClickCapture = (event: React.MouseEvent<T>) => {
    if (!hasDraggedRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    hasDraggedRef.current = false;
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;

    if (!scrollElement) {
      return;
    }

    const handleChange = () => {
      const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth;

      setScrollState((prev) => ({
        ...prev,
        canScrollLeft: scrollElement.scrollLeft > 0,
        canScrollRight: scrollElement.scrollLeft < maxScrollLeft - 1,
      }));
    };

    handleChange();

    scrollElement.addEventListener('scroll', handleChange, { passive: true });
    window.addEventListener('resize', handleChange);

    return () => {
      scrollElement.removeEventListener('scroll', handleChange);
      window.removeEventListener('resize', handleChange);
    };
  }, []);

  return {
    scrollRef,
    canScrollLeft: scrollState.canScrollLeft,
    canScrollRight: scrollState.canScrollRight,
    isDragging: scrollState.isDragging,
    scrollByDirection,
    dragHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
      onClickCapture: handleClickCapture,
    },
  };
}
