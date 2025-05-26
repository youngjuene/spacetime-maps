import React from "react";
import { cn } from "../../utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  children: React.ReactNode;
}

const cardVariants = {
  default: "bg-white shadow-sm border border-neutral-200",
  elevated: "bg-white shadow-lg border-0",
  outlined: "bg-white border-2 border-neutral-300 shadow-none",
};

const cardPadding = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card: React.FC<CardProps> = ({
  variant = "default",
  padding = "md",
  hover = false,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200",
        cardVariants[variant],
        cardPadding[padding],
        hover && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("mb-4", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={cn("text-lg font-semibold text-neutral-900", className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("text-neutral-700", className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn("mt-4 pt-4 border-t border-neutral-200", className)}
    {...props}
  >
    {children}
  </div>
);
