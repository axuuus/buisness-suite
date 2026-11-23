import React from "react";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, disabled }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label || "Toggle"}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`sw ${checked ? "on" : ""} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    />
  );
};

export interface SegmentedControlProps<T extends string> {
  value: T;
  options: T[];
  onChange: (val: T) => void;
  disabled?: boolean;
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  disabled,
}: SegmentedControlProps<T>) {
  return (
    <div className={`seg ${disabled ? "opacity-40 pointer-events-none" : ""}`}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={value === opt ? "on" : ""}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
