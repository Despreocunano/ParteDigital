import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  description?: string;
  showCharacterCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, description, showCharacterCount, maxLength, value, ...props }, ref) => {
    const characterCount = typeof value === 'string' ? value.length : 0;
    const remainingCharacters = maxLength ? maxLength - characterCount : 0;

    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        <div className="flex justify-between mt-1">
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : description ? (
            <p className="text-sm text-gray-500">{description}</p>
          ) : null}
          {showCharacterCount && maxLength && (
            <p className="text-sm text-gray-500">
              {remainingCharacters} caracteres restantes
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';