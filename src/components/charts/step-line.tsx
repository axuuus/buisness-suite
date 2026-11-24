"use client";

import React, { useMemo } from "react";

interface StepLineProps {
  data?: number[];
  maxVal?: number;
  labels?: string[];
  peakLabel?: string;
}

const DEFAULT_DATA = [
  22, 19, 26, 34, 34, 28, 31, 38, 42, 37, 40, 33, 30, 36, 24, 26, 32, 22, 29, 20, 25, 27, 24, 26,
];
const DEFAULT_LABELS = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze"];

export const StepLine: React.FC<StepLineProps> = ({
  data = DEFAULT_DATA,
  maxVal = 45,
  labels = DEFAULT_LABELS,
  peakLabel = "42 tys. zł",
}) => {
  const W = 300;
  const H = 100;

  const { pathStr, stripes, maxIdx, maxX, maxY } = useMemo(() => {
    const X = (i: number) => (i / (data.length - 1)) * W;
    const Y = (v: number) => H - (v / maxVal) * H;

    let path = "";
    data.forEach((v, i) => {
      path += i ? `H${X(i)}V${Y(v)}` : `M0 ${Y(v)}`;
    });

    const lines: { x: number; y1: number }[] = [];
    for (let x = 1; x < W; x += 3.2) {
      const idx = Math.min(data.length - 1, Math.floor((x / W) * (data.length - 1)));
      lines.push({ x, y1: Y(data[idx]) });
    }

    const max = Math.max(...data);
    const mIdx = data.indexOf(max);

    return {
      pathStr: path,
      stripes: lines,
      maxIdx: mIdx,
      maxX: (X(mIdx) / W) * 100,
      maxY: Y(data[mIdx]) / H,
    };
  }, [data, maxVal]);

  return (
    <div className="step" role="img" aria-label={`Wykres schodkowy. Szczyt: ${peakLabel}`}>
      {/* Peak Bubble */}
      <span className="bub float" style={{ left: `${maxX}%` }}>
        {peakLabel}
      </span>

      {/* Peak Dot */}
      <i
        style={{
          position: "absolute",
          left: `${maxX}%`,
          top: `calc(1.75rem + (100% - 3.15rem) * ${maxY})`,
          width: "0.6rem",
          height: "0.6rem",
          borderRadius: "50%",
          background: "var(--pink-500)",
          border: "2px solid var(--surface)",
          translate: "-50% -50%",
          boxShadow: "var(--sh-float)",
        }}
      />

      {/* SVG Canvas */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="step-grad" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2={H}>
            <stop offset="0" stopColor="var(--pink-200)" />
            <stop offset="1" stopColor="var(--pink-200)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Stripes under step line */}
        <g stroke="url(#step-grad)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" opacity="0.8">
          {stripes.map((l, idx) => (
            <line key={idx} x1={l.x} x2={l.x} y1={l.y1} y2={H} />
          ))}
        </g>

        {/* Step line */}
        <path
          d={pathStr}
          fill="none"
          stroke="var(--pink-500)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Month Labels */}
      <div className="mon" aria-hidden="true">
        {labels.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
};
