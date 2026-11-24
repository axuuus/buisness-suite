"use client";

import React from "react";

export interface StripeBarItem {
  name: string;
  amount: number;
  color: string;
  percent: number; // 0 to 1
  currency?: string;
}

interface StripeBarsProps {
  items?: StripeBarItem[];
  currency?: string;
}

const DEFAULT_ITEMS: StripeBarItem[] = [
  { name: "Stała cena", amount: 52400, color: "var(--green-500)", percent: 0.85 },
  { name: "Godzinowo", amount: 31200, color: "var(--blue-500)", percent: 0.55 },
  { name: "Retainer", amount: 12800, color: "var(--pink-500)", percent: 0.3 },
];

export const StripeBars: React.FC<StripeBarsProps> = ({
  items = DEFAULT_ITEMS,
  currency = "zł",
}) => {
  const formatNum = (n: number) =>
    String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");

  return (
    <div className="rows">
      {items.map((it) => (
        <div key={it.name} className="row">
          <div>
            <span>{it.name}</span>
            <b>
              {formatNum(it.amount)} {currency}
            </b>
          </div>
          <div className="track">
            <div
              className="fill"
              style={
                {
                  "--c": it.color,
                  width: `${Math.min(100, it.percent * 100)}%`,
                } as React.CSSProperties
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};
