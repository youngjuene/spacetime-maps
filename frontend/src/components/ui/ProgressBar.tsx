import React from "react";
import { cn } from "../../utils/cn";

export interface ProgressBarProps {
  value: number; // 0 to 1
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  animated?: boolean;
  showValue?: boolean;
  label?: string;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

const progressSizes = {
  sm: "h-2",
  md: "h-4",
  lg: "h-6",
};

const progressVariants = {
  primary: "bg-primary-500",
  secondary: "bg-accent-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  error: "bg-error-500",
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className,
  size = "md",
  variant = "primary",
  animated = false,
  showValue = false,
  label,
  interactive = false,
  onChange,
}) => {
  const percentage = Math.max(0, Math.min(100, value * 100));

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onChange) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newValue = clickX / rect.width;
    onChange(Math.max(0, Math.min(1, newValue)));
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-neutral-700">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm text-neutral-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "w-full bg-neutral-200 rounded-full overflow-hidden",
          progressSizes[size],
          interactive &&
            "cursor-pointer hover:bg-neutral-300 transition-colors duration-200"
        )}
        onClick={handleClick}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            progressVariants[variant],
            animated && "animate-pulse"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const SpaceTimeProgressBar: React.FC<{
  timeness: number;
  className?: string;
  interactive?: boolean;
  onChange?: (value: number) => void;
}> = ({ timeness, className, interactive = false, onChange }) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm font-medium text-white whitespace-nowrap">
        Space
      </span>
      <ProgressBar
        value={timeness}
        variant="primary"
        size="md"
        interactive={interactive}
        onChange={onChange}
        className="flex-1"
      />
      <span className="text-sm font-medium text-white whitespace-nowrap">
        Time
      </span>
    </div>
  );
};
