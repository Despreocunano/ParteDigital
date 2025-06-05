import React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md',
        {
          'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500': variant === 'secondary',
          'border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-500': variant === 'outline',
          'bg-transparent hover:bg-gray-50 text-gray-900 focus-visible:ring-gray-500': variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500': variant === 'danger',
          'text-xs px-2.5 py-1.5 h-8': size === 'sm',
          'text-sm px-4 py-2 h-10': size === 'md',
          'text-base px-5 py-2.5 h-12': size === 'lg',
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}