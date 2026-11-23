import React from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="ov"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="md">
        <div className="flex items-center justify-between">
          <h3>{title}</h3>
          <button onClick={onClose} className="text-[var(--muted)] hover:text-[var(--text)] text-sm">
            ✕
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
