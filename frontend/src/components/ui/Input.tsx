import React from "react";
import { cn } from "../../utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-neutral-400">{leftIcon}</div>
          </div>
        )}

        <input
          id={inputId}
          className={cn(
            "block w-full rounded-lg border transition-colors duration-200",
            "px-3 py-2 text-neutral-900 placeholder-neutral-500",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error
              ? "border-error-300 focus:ring-error-500"
              : "border-neutral-300 hover:border-neutral-400",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-neutral-400">{rightIcon}</div>
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p
          className={cn(
            "mt-2 text-sm",
            error ? "text-error-600" : "text-neutral-500"
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};
