import React from "react";
import { cn } from "../../utils/cn";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const spinnerSizes = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
}) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-neutral-200 border-t-primary-500",
        spinnerSizes[size],
        className
      )}
    />
  );
};

export const LoadingCard: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-neutral-200">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-neutral-600 font-medium">{message}</p>
    </div>
  );
};
