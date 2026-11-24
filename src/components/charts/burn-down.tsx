"use client";

import React, { useMemo } from "react";

interface BurnDownProps {
  actual?: number[];
  weeks?: string[];
}

const DEFAULT_ACTUAL = [120, 111, 99, 90, 76, 62, 51, 39, 21.6];
const DEFAULT_WEEKS = ["T1", "T3", "T5", "T7", "T9", "T12"];

export const BurnDown: React.FC<BurnDownProps> = ({
  actual = DEFAULT_ACTUAL,
  weeks = DEFAULT_WEEKS,
}) => {
  const W = 300;
  const H = 100;
  const mn = -25;
  const mx = 125;

  const { planPath, actualPath, forecastPath, yZero } = useMemo(() => {
    const X = (w: number) => (w / 12) * W;
    const Y = (v: number) => H - ((v - mn) / (mx - mn)) * H;

    const pl = `M0 ${Y(120)}L${W} ${Y(0)}`;

    let act = "";
    actual.forEach((v, i) => {
      act += i ? `H${X(i)}V${Y(v)}` : `M0 ${Y(v)}`;
    });

    let fc = `M${X(actual.length - 1)} ${Y(actual[actual.length - 1])}`;
    for (let w = actual.length; w <= 12; w++) {
      fc += `L${X(w)} ${Y(21.6 - 9 * (w - 8))}`;
    }

    return {
      planPath: pl,
      actualPath: act,
      forecastPath: fc,
      yZero: Y(0),
    };
  }, [actual]);

  return (
    <div className="step" role="img" aria-label="Wykres Burn-down budżetu">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ inset: "0.5rem 0 1.4rem", height: "calc(100% - 1.9rem)" }}
      >
        {/* Zero baseline */}
        <line
          x1="0"
          x2={W}
          y1={yZero}
          y2={yZero}
          stroke="var(--line-strong)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        {/* Plan line */}
        <path
          d={planPath}
          fill="none"
          stroke="var(--faint)"
          strokeDasharray="4 4"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* Actual step line */}
        <path
          d={actualPath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Forecast line */}
        <path
          d={forecastPath}
          fill="none"
          stroke="var(--red-500)"
          strokeDasharray="3 3"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Week Labels */}
      <div className="mon" aria-hidden="true">
        {weeks.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
    </div>
  );
};
