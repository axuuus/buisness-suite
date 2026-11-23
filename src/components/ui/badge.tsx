import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "ok" | "pending" | "neutral" | "budget-ok" | "budget-warn" | "budget-alert";
}

export const Badge: React.FC<BadgeProps> = ({ variant = "neutral", children, className = "", ...props }) => {
  let styleClasses = "st";

  if (variant === "ok") {
    styleClasses = "st ok";
  } else if (variant === "pending") {
    styleClasses = "st";
  } else if (variant === "budget-ok") {
    // Zużycie budżetu <75% -> --rose
    styleClasses = "st ok";
  } else if (variant === "budget-warn") {
    // Zużycie budżetu 75-99% -> przytłumiony bursztyn #C98A2B
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.7rem] font-medium bg-[rgba(201,138,43,0.18)] text-[#C98A2B] dark:text-[#E5A84B] ${className}`}
        {...props}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {children}
      </span>
    );
  } else if (variant === "budget-alert") {
    // Zużycie budżetu >=100% -> --deep z ikoną ostrzeżenia
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold bg-[rgba(140,49,80,0.22)] text-[var(--deep)] dark:text-[var(--baby)] ${className}`}
        {...props}
      >
        <span className="font-bold">⚠️</span>
        {children}
      </span>
    );
  }

  return (
    <span className={`${styleClasses} ${className}`} {...props}>
      {children}
    </span>
  );
};
