import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "ok" | "pending" | "neutral" | "budget-ok" | "budget-warn" | "budget-alert";
}

export const Badge: React.FC<BadgeProps> = ({ variant = "neutral", children, className = "", ...props }) => {
  let styleClasses = "sp";

  if (variant === "ok" || variant === "budget-ok") {
    styleClasses = "sp ok";
  } else if (variant === "pending") {
    styleClasses = "sp wait";
  } else if (variant === "budget-warn") {
    styleClasses = "sp wait";
  } else if (variant === "budget-alert") {
    return (
      <span className={`sp bad ${className}`} {...props}>
        <span>⚠️</span>
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
