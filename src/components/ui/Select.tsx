import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  description?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, description, options, ...props }, ref) => {
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
        <select
          className={cn(
            'flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        ) : description ? (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';