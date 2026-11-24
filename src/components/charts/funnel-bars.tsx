"use client";

import React, { useState, useEffect, useRef } from "react";

export interface FunnelStage {
  label: string;
  value: number; // in thousands (k) or raw
}

interface FunnelBarsProps {
  stages?: FunnelStage[];
  unit?: string;
}

const DEFAULT_STAGES: FunnelStage[] = [
  { label: "Wpisane", value: 182 },
  { label: "Zatwierdzone", value: 164 },
  { label: "Billable", value: 141 },
  { label: "Zafakturowane", value: 118 },
  { label: "Opłacone", value: 96 },
];

export const FunnelBars: React.FC<FunnelBarsProps> = ({
  stages = DEFAULT_STAGES,
  unit = "k zł",
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxVal = stages[0]?.value || 1;

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" && index < stages.length - 1) {
      setActiveIdx(index + 1);
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIdx(index - 1);
    }
  };

  const activeStage = stages[activeIdx] || stages[0];
  const prevStage = activeIdx > 0 ? stages[activeIdx - 1] : null;
  const convPercent = prevStage
    ? Math.round((activeStage.value / prevStage.value) * 100)
    : 100;
  const dropPercent = 100 - convPercent;

  // Tooltip positioning
  const leftPercent = ((activeIdx + 0.5) / stages.length) * 100;
  const translateStyle =
    activeIdx === 0
      ? "-20% 0"
      : activeIdx === stages.length - 1
      ? "-80% 0"
      : "-50% 0";
  const bottomPercent = (activeStage.value / maxVal) * 68 * 0.4;

  return (
    <div className="funnel" ref={containerRef} role="region" aria-label="Pipeline przychodu lejek">
      {/* Y Axis */}
      <div className="yax" aria-hidden="true">
        <span>200k</span>
        <span>150k</span>
        <span>100k</span>
        <span>50k</span>
      </div>

      {/* Columns */}
      {stages.map((st, i) => {
        const heightPercent = (st.value / maxVal) * 68;
        const nextStage = i < stages.length - 1 ? stages[i + 1] : null;
        const nextHeightPercent = nextStage
          ? (nextStage.value / maxVal) * 68
          : null;
        const isSelected = activeIdx === i;

        return (
          <div
            key={st.label}
            className={`col ${isSelected ? "on" : ""}`}
            tabIndex={0}
            role="button"
            aria-pressed={isSelected}
            aria-label={`${st.label}: ${st.value} ${unit}`}
            onMouseEnter={() => setActiveIdx(i)}
            onFocus={() => setActiveIdx(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          >
            <div className="t">{st.label}</div>
            <div className="n">
              {st.value}
              {unit}
            </div>

            {/* Bar */}
            <div
              className="bar"
              style={{ height: `${heightPercent}%` }}
            >
              {isSelected && <span className="cap" />}
            </div>

            {/* Ramp connection to next bar */}
            {nextHeightPercent !== null && (
              <div
                className="ramp"
                style={{
                  height: `${heightPercent}%`,
                  clipPath: `polygon(0 0, 100% ${(1 - nextHeightPercent / heightPercent) * 100}%, 100% 100%, 0 100%)`,
                }}
              />
            )}
          </div>
        );
      })}

      {/* Dynamic Glass Tooltip */}
      <div
        className="tip float"
        style={{
          left: `calc(2rem + (100% - 2rem) * ${leftPercent / 100})`,
          translate: translateStyle,
          bottom: `${bottomPercent}%`,
        }}
        role="status"
        aria-live="polite"
      >
        <b>
          {activeStage.value}
          {unit}
        </b>{" "}
        przychodu
        <s>|</s>
        Konwersja: <b>{convPercent}%</b>
        <s>|</s>
        Spadek: <b>−{dropPercent}%</b>
      </div>
    </div>
  );
};
