"use client";

import React, { useState } from "react";
import { FunnelBars } from "@/components/charts/funnel-bars";
import { StepLine } from "@/components/charts/step-line";
import { DotHistogram } from "@/components/charts/dot-histogram";
import { StripeBars } from "@/components/charts/stripe-bars";
import { InsightCard } from "@/components/charts/insight-card";
import { CommandBar } from "@/components/shell/command-bar";

interface HomeViewProps {
  onCopyLink?: () => void;
  onAddWidget?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = () => {
  const [granularity, setGranularity] = useState<"Dziennie" | "Tygodniowo" | "Miesięcznie">("Dziennie");
  const [isGranularityOpen, setIsGranularityOpen] = useState(false);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);

  return (
    <div id="v-home" className="space-y-4">
      {/* 1. Page Header with Title and Toolbar */}
      <div className="head">
        <h1>
          <span>Przegląd</span>
          <button
            type="button"
            className="round sm"
            aria-label="Kopiuj link do widoku"
            onClick={() => {
              if (typeof navigator !== "undefined") {
                navigator.clipboard?.writeText(window.location.href);
              }
            }}
          >
            <svg viewBox="0 0 24 24">
              <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
            </svg>
          </button>
        </h1>

        {/* Toolbar */}
        <div className="tools">
          <div className="seg">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="5" width="16" height="15" rx="3" />
              <path d="M4 10h16M9 3v4M15 3v4" />
            </svg>
            <span>1 sty – 31 lip</span>
          </div>

          <span className="cmp">w porównaniu z</span>

          <div className="seg">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="5" width="16" height="15" rx="3" />
              <path d="M4 10h16M9 3v4M15 3v4" />
            </svg>
            <span>1 sie – 31 gru</span>
          </div>

          <div className="relative">
            <button
              type="button"
              className="seg gray"
              onClick={() => setIsGranularityOpen(!isGranularityOpen)}
            >
              <span>{granularity} ▾</span>
            </button>
            {isGranularityOpen && (
              <div className="pop float absolute right-0 top-11 p-1.5 w-36 z-50">
                {(["Dziennie", "Tygodniowo", "Miesięcznie"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    className="mi"
                    onClick={() => {
                      setGranularity(g);
                      setIsGranularityOpen(false);
                    }}
                  >
                    <span>{g}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="seg gray"
            onClick={() => setIsAddWidgetOpen(!isAddWidgetOpen)}
          >
            Dodaj widget +
          </button>
        </div>
      </div>

      {/* 2. Main Widget Grid */}
      <main className="grid">
        {/* Pipeline przychodu (Funnel) */}
        <section className="card wide" aria-labelledby="h-pipe">
          <header>
            <h2 id="h-pipe">Pipeline przychodu</h2>
            <button className="round sm" aria-label="Więcej opcji">
              ⋯
            </button>
          </header>
          <FunnelBars />
          <CommandBar />
        </section>

        {/* Przychód & Gross Volume */}
        <section className="card" aria-labelledby="h-rev">
          <header>
            <h2 id="h-rev">Przychód</h2>
            <button className="round sm" aria-label="Więcej opcji">
              ⋯
            </button>
          </header>
          <div className="flex items-center gap-3 my-2 mb-4">
            <span className="big">96 400 zł</span>
            <span className="chip float">
              <b>▲</b>15%
            </span>
          </div>
          <StripeBars />
          <div className="wip">
            <span>Niezafakturowane (WIP)</span>
            <b>22 400 zł</b>
          </div>
        </section>

        {/* Burn rate */}
        <section className="card" aria-labelledby="h-burn">
          <header>
            <h2 id="h-burn">Burn rate</h2>
            <button className="round sm" aria-label="Więcej opcji">
              ⋯
            </button>
          </header>
          <StepLine />
        </section>

        {/* Stack with 2 Dot Histograms */}
        <div className="stack">
          <section className="card kpi" aria-labelledby="h-h">
            <header>
              <h2 id="h-h">Godziny w tygodniu</h2>
              <button className="round sm" aria-label="Więcej opcji">
                ⋯
              </button>
            </header>
            <span className="big">312</span>
            <DotHistogram color="var(--green-500)" peakLabel="Szczyt: śr" />
            <div className="vs">
              vs poprzedni okres<b>+34</b>
            </div>
          </section>

          <section className="card kpi" aria-labelledby="h-t">
            <header>
              <h2 id="h-t">Ukończone zadania</h2>
              <button className="round sm" aria-label="Więcej opcji">
                ⋯
              </button>
            </header>
            <span className="big">1 284</span>
            <DotHistogram
              color="var(--blue-500)"
              peakLabel="Najwięcej: czw"
              data={[1, 1, 2, 2, 3, 3, 4, 6, 4, 2, 1, 3, 2, 1]}
            />
            <div className="vs">
              vs poprzedni okres<b>+320</b>
            </div>
          </section>
        </div>

        {/* Insights Card */}
        <InsightCard />
      </main>
    </div>
  );
};
