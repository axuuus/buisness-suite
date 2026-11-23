import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      isLoading,
      isError,
      isEmpty,
      emptyMessage = "Brak danych do wyświetlenia",
      errorMessage = "Nie udało się załadować zawartości",
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={`card glass ${className}`} {...props}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[14rem] space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--rose)] border-t-transparent animate-spin" />
            <p className="text-xs text-[var(--muted)]">Ładowanie danych...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center min-h-[14rem] space-y-2 text-center p-4">
            <div className="w-8 h-8 rounded-full bg-[rgba(140,49,80,0.15)] text-[var(--deep)] dark:text-[var(--baby)] flex items-center justify-center font-bold">!</div>
            <p className="text-sm font-medium text-[var(--text)]">{errorMessage}</p>
            <p className="text-xs text-[var(--muted)]">Spróbuj odświeżyć stronę lub sprawdź połączenie.</p>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center min-h-[14rem] space-y-2 text-center p-4">
            <p className="text-sm font-medium text-[var(--text)]">{emptyMessage}</p>
            <p className="text-xs text-[var(--muted)]">Dodaj pierwszy element, aby zobaczyć statystyki.</p>
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
);
Card.displayName = "Card";
