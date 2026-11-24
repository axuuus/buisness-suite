import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "neutral" | "dark" | "rose" | "chip" | "primary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "neutral", size, isLoading, children, className = "", disabled, ...props }, ref) => {
    let variantClasses = "btn";
    if (variant === "dark") {
      variantClasses = "btn";
    } else if (variant === "rose" || variant === "primary") {
      variantClasses = "btn primary";
    } else if (variant === "chip") {
      variantClasses = "seg";
    } else if (variant === "ghost") {
      variantClasses = "seg gray";
    }

    const sizeClass = size === "sm" ? "text-xs h-8 px-3" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${variantClasses} ${sizeClass} ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
