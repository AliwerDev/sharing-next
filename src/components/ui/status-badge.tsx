import * as React from "react";
import { cn } from "./utils";

export type StatusBadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "muted"
  | "default";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusBadgeVariant;
  status?: string;
  showDot?: boolean;
  glass?: boolean;
}

const statusToVariantMap: Record<string, StatusBadgeVariant> = {
  ACTIVE: "success",
  PENDING: "success",
  RESERVED: "warning",
  APPROVED: "warning",
  GIVEN: "muted",
  COMPLETED: "muted",
  DELETED: "muted",
  REJECTED: "error",
};

export function StatusBadge({
  variant,
  status,
  showDot,
  glass = false,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  // 1. Resolve variant from status if variant isn't explicitly provided
  const resolvedVariant = 
    variant || 
    (status ? statusToVariantMap[status.toUpperCase()] : undefined) || 
    "default";

  // 2. Determine dot visibility
  // Show dot by default for success, warning, info, and active-like statuses unless explicitly set to false
  const shouldShowDot = showDot ?? (resolvedVariant === "success" || resolvedVariant === "warning" || resolvedVariant === "info");

  // 3. Define styling classes based on variant & glassmorphism
  const variantStyles = {
    success: glass 
      ? "bg-status-active-bg/75 text-status-active border border-status-active/20" 
      : "bg-status-active-bg text-status-active",
    warning: glass 
      ? "bg-status-reserved-bg/75 text-status-reserved border border-status-reserved/20" 
      : "bg-status-reserved-bg text-status-reserved",
    error: glass 
      ? "bg-destructive/10 text-destructive border border-destructive/20" 
      : "bg-destructive/10 text-destructive",
    info: glass 
      ? "bg-blue-50/75 text-blue-600 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30" 
      : "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
    muted: glass 
      ? "bg-status-given-bg/75 text-status-given border border-status-given/20" 
      : "bg-status-given-bg text-status-given",
    default: glass 
      ? "bg-primary/80 text-primary-foreground border border-primary/20" 
      : "bg-primary text-primary-foreground",
  };

  const dotColorStyles = {
    success: "bg-status-active",
    warning: "bg-status-reserved",
    error: "bg-destructive",
    info: "bg-blue-500",
    muted: "bg-status-given",
    default: "bg-primary-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold select-none",
        glass ? "backdrop-blur-md shadow-sm" : "",
        variantStyles[resolvedVariant],
        className
      )}
      {...props}
    >
      {shouldShowDot && (
        <span className={cn(
          "w-1.5 h-1.5 rounded-full animate-pulse shrink-0",
          dotColorStyles[resolvedVariant]
        )} />
      )}
      {children || status || resolvedVariant}
    </span>
  );
}
