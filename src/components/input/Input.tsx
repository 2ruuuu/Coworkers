'use client';

import React, { useId, useState } from 'react';

import VisibilityFalseIcon from '@/assets/icons/visibility_false.svg?react';
import VisibilityTrueIcon from '@/assets/icons/visibility_true.svg?react';
import { cn } from '@/utils/cn';

import type { InputProps } from './type';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'lg',
      type = 'text',
      isError = false,
      errorMessage,
      disabled = false,
      rightButtonText,
      onRightButtonClick,
      className,
      ...props
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const errorId = useId();
    const hasErrorMessage = isError && Boolean(errorMessage);

    const inputType = type === 'password' && isPasswordVisible ? 'text' : type;

    const baseStyle = 'w-full rounded-xl border outline-none transition-colors';

    const sizeStyle = {
      sm: 'h-11 px-3.5 py-4 text-md',
      lg: 'h-12 px-4 py-4 text-base',
    };

    const defaultStyle = `
    border-border-primary
    bg-background-primary

    text-text-primary
    placeholder:text-text-default

    hover:border-interaction-hover
    focus:border-interaction-pressed
`;

    const errorStyle = `border-status-danger hover:border-status-danger focus:border-status-danger`;

    const disabledStyle = `
    border-border-primary
    bg-background-secondary
    disabled:text-text-disabled

    disabled:hover:border-border-primary
    disabled:focus:border-border-primary
`;
    const inputClassName = cn(
      baseStyle,
      sizeStyle[size],
      defaultStyle,
      isError && errorStyle,
      disabled && disabledStyle,
      className,
    );

    return (
      <div className="relative flex flex-col gap-2">
        <div className="relative">
          <input
            ref={ref}
            {...props}
            type={inputType}
            disabled={disabled}
            aria-invalid={isError || undefined}
            aria-describedby={
              cn(props['aria-describedby'], hasErrorMessage && errorId) || undefined
            }
            className={inputClassName}
          />
          {type === 'password' && !disabled && (
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute top-1/2 right-4 -translate-y-1/2"
              aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {isPasswordVisible ? (
                <VisibilityFalseIcon width={24} height={24} />
              ) : (
                <VisibilityTrueIcon width={24} height={24} />
              )}
            </button>
          )}
          {rightButtonText && (
            <button
              type="button"
              onClick={onRightButtonClick}
              className="bg-brand-primary hover:bg-interaction-hover active:bg-interaction-pressed text-background-primary absolute top-1/2 right-2 -translate-y-1/2 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {rightButtonText}
            </button>
          )}
        </div>
        <p
          id={errorId}
          className={cn('text-xs', hasErrorMessage ? 'text-status-danger' : 'text-transparent')}
          aria-live="polite"
        >
          {hasErrorMessage ? errorMessage : '\u00A0'}
        </p>
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
