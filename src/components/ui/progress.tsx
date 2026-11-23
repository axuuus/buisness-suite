import React from "react";

export interface ProgressProps {
  value: number; // 0 to 100
  forecastValue?: number; // 0 to 100
  ticks?: string[];
  tooltip?: {
    value: string;
    chip?: string;
  };
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  forecastValue,
  ticks = ["0", "1,000", "2,000", "3,000", "4,000"],
  tooltip,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const clampedForecast = forecastValue ? Math.min(100 - clampedValue, Math.max(0, forecastValue)) : 0;
  const tipPosition = Math.max(16, Math.min(84, clampedValue));

  return (
    <div className="w-full">
      <div className="prog">
        <i className="f1" style={{ width: `${clampedValue}%` }} />
        {clampedForecast > 0 && <i className="f2" style={{ width: `${clampedForecast}%` }} />}
      </div>

      {ticks && (
        <div className="ticks">
          {ticks.map((t, idx) => (
            <span key={idx}>{t}</span>
          ))}
        </div>
      )}

      {tooltip && (
        <div className="mark">
          <span className="tip glass" style={{ left: `${tipPosition}%` }}>
            {tooltip.value}
            {tooltip.chip && <em>{tooltip.chip}</em>}
          </span>
        </div>
      )}
    </div>
  );
};
