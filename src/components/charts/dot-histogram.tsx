"use client";

import React from "react";

interface DotHistogramProps {
  data?: number[];
  color?: string;
  peakLabel?: string;
}

export const DotHistogram: React.FC<DotHistogramProps> = ({
  data = [1, 1, 2, 2, 3, 5, 7, 5, 3, 2, 2, 1, 1, 1],
  color = "var(--green-500)",
  peakLabel = "Szczyt: śr",
}) => {
  const maxVal = Math.max(...data);
  const peakIdx = data.indexOf(maxVal);
  const leftPercent = ((peakIdx + 0.5) / data.length) * 100;

  // Split label into prefix and bold part
  const match = peakLabel.match(/^(.*?):\s*(.*)$/);
  const prefix = match ? match[1] + ":" : "";
  const suffix = match ? match[2] : peakLabel;

  return (
    <div className="hist" role="img" aria-label={peakLabel}>
      {/* Floating Peak Bubble */}
      <span className="bub float" style={{ left: `${leftPercent}%` }}>
        {prefix} <b>{suffix}</b>
      </span>

      {/* Dots Grid */}
      <div className="dots" style={{ "--c": color } as React.CSSProperties}>
        {data.map((count, colIdx) => (
          <div key={colIdx} className={colIdx === peakIdx ? "pk" : ""}>
            {Array.from({ length: count }).map((_, dotIdx) => (
              <i key={dotIdx} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
