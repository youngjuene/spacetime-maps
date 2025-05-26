import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { Button } from "./Button";

export interface FloatingAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
}

export interface FloatingActionButtonProps {
  actions: FloatingAction[];
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "sm" | "md" | "lg";
}

const positionClasses = {
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
};

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-14 h-14",
  lg: "w-16 h-16",
};

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions,
  className,
  position = "bottom-right",
  size = "md",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMainButtonClick = () => {
    if (actions.length === 1) {
      actions[0].onClick();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleActionClick = (action: FloatingAction) => {
    action.onClick();
    setIsExpanded(false);
  };

  return (
    <div className={cn("fixed z-40", positionClasses[position], className)}>
      {/* Expanded Actions */}
      {isExpanded && actions.length > 1 && (
        <div className="absolute bottom-full mb-4 space-y-3">
          {actions.map((action, index) => (
            <div
              key={index}
              className="flex items-center gap-3 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="bg-neutral-800 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap">
                {action.label}
              </span>
              <Button
                variant={action.variant || "primary"}
                size="sm"
                onClick={() => handleActionClick(action)}
                className={cn(
                  "rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
                  "w-12 h-12 p-0"
                )}
              >
                {action.icon}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        variant="primary"
        onClick={handleMainButtonClick}
        className={cn(
          "rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
          "hover:scale-110 active:scale-95",
          sizeClasses[size],
          "p-0"
        )}
      >
        {actions.length === 1 ? (
          actions[0].icon
        ) : (
          <svg
            className={cn(
              "transition-transform duration-200",
              isExpanded && "rotate-45"
            )}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        )}
      </Button>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 -z-10 bg-black bg-opacity-20"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};
