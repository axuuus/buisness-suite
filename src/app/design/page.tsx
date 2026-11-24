"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FunnelBars } from "@/components/charts/funnel-bars";
import { StepLine } from "@/components/charts/step-line";
import { DotHistogram } from "@/components/charts/dot-histogram";
import { StripeBars } from "@/components/charts/stripe-bars";
import { BurnDown } from "@/components/charts/burn-down";
import { InsightCard } from "@/components/charts/insight-card";
import { CommandBar } from "@/components/shell/command-bar";
import { Modal } from "@/components/ui/modal";

export default function DesignSystemPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [previewWidth, setPreviewWidth] = useState<string>("100%");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [tableSortDir, setTableSortDir] = useState<number>(1);

  const toggleTheme = (val: "light" | "dark") => {
    setTheme(val);
    const root = document.documentElement;
    root.setAttribute("data-theme", val);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const sampleExpenses = [
    { date: "12.11", vendor: "Adobe", cat: "Oprogramowanie", amt: 1290, st: "ok", stLabel: "Zatwierdzony" },
    { date: "08.11", vendor: "Studio Foto Nova", cat: "Podwykonawcy", amt: 8400, st: "wait", stLabel: "Oczekuje" },
    { date: "29.10", vendor: "Meta Ads", cat: "Marketing", amt: 5200, st: "paid", stLabel: "Zwrócony" },
    { date: "21.10", vendor: "Freelancer J. Lis", cat: "Podwykonawcy", amt: 12000, st: "ok", stLabel: "Zatwierdzony" },
  ];

  return (
    <div className="shell min-h-screen space-y-12 pb-16">
      {/* Top Bar for Design Gallery */}
      <header className="top border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="logo">
            <i />
            <span>velodrome</span>
          </Link>
          <span className="text-xs text-[var(--muted)] pl-2 border-l border-[var(--line)]">
            Design System v2: Clean Data Light
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Viewport Width Switcher */}
          <div className="seg gray text-xs">
            <span>Szerokość podglądu:</span>
            <button
              onClick={() => setPreviewWidth("100%")}
              className={`px-2 py-0.5 rounded ${previewWidth === "100%" ? "bg-[var(--surface)] font-bold shadow-sm" : ""}`}
            >
              Pełna
            </button>
            <button
              onClick={() => setPreviewWidth("1440px")}
              className={`px-2 py-0.5 rounded ${previewWidth === "1440px" ? "bg-[var(--surface)] font-bold shadow-sm" : ""}`}
            >
              1440
            </button>
            <button
              onClick={() => setPreviewWidth("1024px")}
              className={`px-2 py-0.5 rounded ${previewWidth === "1024px" ? "bg-[var(--surface)] font-bold shadow-sm" : ""}`}
            >
              1024
            </button>
            <button
              onClick={() => setPreviewWidth("768px")}
              className={`px-2 py-0.5 rounded ${previewWidth === "768px" ? "bg-[var(--surface)] font-bold shadow-sm" : ""}`}
            >
              768
            </button>
            <button
              onClick={() => setPreviewWidth("360px")}
              className={`px-2 py-0.5 rounded ${previewWidth === "360px" ? "bg-[var(--surface)] font-bold shadow-sm" : ""}`}
            >
              360
            </button>
          </div>

          {/* Theme Switcher */}
          <div className="seg gray text-xs">
            <button
              onClick={() => toggleTheme("light")}
              className={`px-2 py-0.5 rounded ${theme === "light" ? "bg-[var(--surface)] font-bold shadow-sm" : ""}`}
            >
              light
            </button>
            <button
              onClick={() => toggleTheme("dark")}
              className={`px-2 py-0.5 rounded ${theme === "dark" ? "bg-[var(--surface)] font-bold shadow-sm" : ""}`}
            >
              dark
            </button>
          </div>
        </div>
      </header>

      {/* Preview Width Container */}
      <div style={{ maxWidth: previewWidth, margin: "0 auto", width: "100%" }} className="space-y-12">
        <div className="pt-2 pb-1">
          <h1 className="text-2xl font-bold tracking-tight">Galeria Komponentów (Clean Data Light)</h1>
          <p className="text-xs text-[var(--muted)] mt-1">
            Prezentacja wszystkich komponentów z sekcji 13 specyfikacji DESIGN-v2-redesign.md we wszystkich stanach.
          </p>
        </div>
        {/* ======================================================================
            1. TOKENY
            ====================================================================== */}
        <section className="space-y-4" id="sec-tokens">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--accent)]">01</span>
            <h2 className="text-lg font-bold">Tokeny systemowe (Paleta, Typografia, Cienie, Promienie)</h2>
          </div>

          <div className="card space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-[var(--muted)] uppercase mb-3">Próbki kolorów</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="h-12 rounded-xl bg-[var(--blue-500)] shadow-sm" />
                  <div className="font-medium">--blue-500 (Akcent)</div>
                  <div className="text-[var(--muted)] text-[0.7rem]">#2F6BFF</div>
                </div>
                <div className="space-y-1">
                  <div className="h-12 rounded-xl bg-[var(--blue-700)] shadow-sm" />
                  <div className="font-medium">--blue-700</div>
                  <div className="text-[var(--muted)] text-[0.7rem]">#1B3FD0</div>
                </div>
                <div className="space-y-1">
                  <div className="h-12 rounded-xl bg-[var(--green-500)] shadow-sm" />
                  <div className="font-medium">--green-500 (Seria 2)</div>
                  <div className="text-[var(--muted)] text-[0.7rem]">#22B84A</div>
                </div>
                <div className="space-y-1">
                  <div className="h-12 rounded-xl bg-[var(--pink-500)] shadow-sm" />
                  <div className="font-medium">--pink-500 (Seria 3)</div>
                  <div className="text-[var(--muted)] text-[0.7rem]">#F0287F</div>
                </div>
                <div className="space-y-1">
                  <div className="h-12 rounded-xl bg-[var(--orange-500)] shadow-sm" />
                  <div className="font-medium">--orange-500 (Ostrzeżenie)</div>
                  <div className="text-[var(--muted)] text-[0.7rem]">#F59A3D</div>
                </div>
                <div className="space-y-1">
                  <div className="h-12 rounded-xl bg-[var(--red-500)] shadow-sm" />
                  <div className="font-medium">--red-500 (Błąd/Limit)</div>
                  <div className="text-[var(--muted)] text-[0.7rem]">#D93A3A</div>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--line)] pt-4">
              <h3 className="text-xs font-semibold text-[var(--muted)] uppercase mb-3">Typografia Geist & Skala KPI</h3>
              <div className="space-y-3">
                <div className="text-3xl font-medium tracking-tight">Tytuł strony: 32px / clamp(2rem, 3.6vw, 3.25rem)</div>
                <div className="text-xl font-medium">Tytuł karty: 18px (1.125rem)</div>
                <div className="big font-normal">96 400 zł (Duża liczba KPI: clamp(2.25rem, 12cqi, 4.5rem))</div>
                <div className="lbl">Podpis / Etykieta: 13px (0.8125rem), kolor --muted</div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================
            2. PRZYCISKI I PIGUŁKI
            ====================================================================== */}
        <section className="space-y-4" id="sec-buttons">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--accent)]">02</span>
            <h2 className="text-lg font-bold">Przyciski, pigułki i przyciski okrągłe (.btn, .pill, .round)</h2>
          </div>

          <div className="card space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn">Główny przycisk ciemny (.btn)</button>
              <button className="pill" aria-current="page">Aktywna pigułka</button>
              <button className="pill">Pigułka domyślna</button>
              <button className="round" aria-label="Przycisk okrągły 2.5rem">
                <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
              </button>
              <button className="round sm" aria-label="Przycisk okrągły mały 2.25rem">⋯</button>
              <button className="btn opacity-50 cursor-not-allowed" disabled>Wyłączony (disabled)</button>
            </div>
          </div>
        </section>

        {/* ======================================================================
            3. POLA I PRZEŁĄCZNIKI
            ====================================================================== */}
        <section className="space-y-4" id="sec-inputs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--accent)]">03</span>
            <h2 className="text-lg font-bold">Pola zakresu dat, segmenty i formularze</h2>
          </div>

          <div className="card">
            <div className="flex flex-wrap items-center gap-3">
              <div className="seg">
                <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>
                <span>1 sty – 31 lip</span>
              </div>
              <span className="cmp">w porównaniu z</span>
              <div className="seg">
                <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>
                <span>1 sie – 31 gru</span>
              </div>
              <button className="seg gray">Dziennie ▾</button>
              <button className="seg gray">Dodaj widget +</button>
            </div>
          </div>
        </section>

        {/* ======================================================================
            4. KARTY I NAGŁÓWKI KART
            ====================================================================== */}
        <section className="space-y-4" id="sec-cards">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--accent)]">04</span>
            <h2 className="text-lg font-bold">Karty solidne z cieniem (.card, --sh-card)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <header>
                <h2>Karta pojedyncza</h2>
                <button className="round sm">⋯</button>
              </header>
              <span className="lbl">Podtytuł sekcji</span>
              <div className="big">120 000 zł</div>
            </div>
            <div className="card">
              <header>
                <h2>Karta ze statystyką i chipem</h2>
                <button className="round sm">⋯</button>
              </header>
              <div className="flex items-center gap-3 my-2">
                <span className="big">96 400 zł</span>
                <span className="chip float"><b>▲</b>15%</span>
              </div>
              <div className="wip">
                <span>Niezafakturowane (WIP)</span>
                <b>22 400 zł</b>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================
            5. CHIPY, PIGUŁKI STATUSU, TAGI
            ====================================================================== */}
        <section className="space-y-4" id="sec-badges">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--accent)]">05</span>
            <h2 className="text-lg font-bold">Chipy delty, pigułki statusu budżetu (.sp) i tagi encji</h2>
          </div>

          <div className="card space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="chip float"><b>▲</b> 15% (Chip delta)</span>
              <span className="sp">Stała cena (.sp)</span>
              <span className="sp ok">Zatwierdzony (.sp.ok)</span>
              <span className="sp wait">82% budżetu (.sp.wait)</span>
              <span className="sp paid">Zwrócony (.sp.paid)</span>
              <span className="sp bad">⚠ +12% ponad budżet (.sp.bad)</span>
              <span className="tag">/billable (.tag encji)</span>
              <span className="tag">/successful payments</span>
            </div>
          </div>
        </section>

        {/* ======================================================================
            6. WYKRESY
            ====================================================================== */}
        <section className="space-y-4" id="sec-charts">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--accent)]">06</span>
            <h2 className="text-lg font-bold">Wykresy systemowe (Lejek, Schodkowy, Kropki, Kreski, Burn-down, Insights)</h2>
          </div>

          <div className="grid">
            {/* 1. Lejek */}
            <div className="card wide">
              <header>
                <h2>FunnelBars – Lejek przychodu</h2>
                <button className="round sm">⋯</button>
              </header>
              <FunnelBars />
              <CommandBar />
            </div>

            {/* 2. StripeBars */}
            <div className="card">
              <header>
                <h2>StripeBars – Przychód wg typu</h2>
                <button className="round sm">⋯</button>
              </header>
              <StripeBars />
            </div>

            {/* 3. StepLine */}
            <div className="card">
              <header>
                <h2>StepLine – Burn rate / tydzień</h2>
                <button className="round sm">⋯</button>
              </header>
              <StepLine />
            </div>

            {/* 4. DotHistogram */}
            <div className="stack">
              <div className="card kpi">
                <header>
                  <h2>DotHistogram – Godziny</h2>
                  <button className="round sm">⋯</button>
                </header>
                <span className="big">312</span>
                <DotHistogram color="var(--green-500)" peakLabel="Szczyt: śr" />
                <div className="vs">vs poprz.<b>+34</b></div>
              </div>
              <div className="card kpi">
                <header>
                  <h2>DotHistogram – Zadania</h2>
                  <button className="round sm">⋯</button>
                </header>
                <span className="big">1 284</span>
                <DotHistogram color="var(--blue-500)" peakLabel="Najwięcej: czw" data={[1,1,2,2,3,3,4,6,4,2,1,3,2,1]} />
                <div className="vs">vs poprz.<b>+320</b></div>
              </div>
            </div>

            {/* 5. InsightCard */}
            <InsightCard />

            {/* 6. BurnDown */}
            <div className="card wide">
              <header>
                <h2>BurnDown – Pozostały budżet</h2>
                <button className="round sm">⋯</button>
              </header>
              <BurnDown />
              <div className="leg">
                <span><b style={{ background: "var(--faint)" }} />Plan</span>
                <span><b style={{ background: "var(--accent)" }} />Rzeczywistość</span>
                <span><b style={{ background: "var(--red-500)" }} />Prognoza</span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================
            7. TABELA
            ====================================================================== */}
        <section className="space-y-4" id="sec-table">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--accent)]">07</span>
            <h2 className="text-lg font-bold">Tabela z trybem kart na mobile (&lt;640px)</h2>
          </div>

          <div className="card">
            <header>
              <h2>Wydatki projektowe</h2>
              <button className="round sm">⋯</button>
            </header>
            <div className="tw">
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Dostawca</th>
                    <th>Kategoria</th>
                    <th className="r" aria-sort={tableSortDir > 0 ? "ascending" : "descending"}>
                      <button onClick={() => setTableSortDir(-tableSortDir)}>
                        Kwota {tableSortDir > 0 ? "↑" : "↓"}
                      </button>
                    </th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...sampleExpenses]
                    .sort((a, b) => (a.amt - b.amt) * tableSortDir)
                    .map((exp, idx) => (
                      <tr key={idx}>
                        <td data-l="Data">{exp.date}</td>
                        <td data-l="Dostawca">{exp.vendor}</td>
                        <td data-l="Kategoria">{exp.cat}</td>
                        <td className="r" data-l="Kwota">
                          {String(exp.amt).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0")} zł
                        </td>
                        <td data-l="Status">
                          <span className={`sp ${exp.st}`}>{exp.stLabel}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ======================================================================
            8. ELEMENTY PŁYWAJĄCE
            ====================================================================== */}
        <section className="space-y-4" id="sec-float">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--accent)]">08</span>
            <h2 className="text-lg font-bold">Elementy pływające (.float ze szkłem i rozmyciem blur)</h2>
          </div>

          <div className="card space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="tip float relative static! inline-block!">
                <b>141k zł</b> przychodu <s>|</s> Konwersja: <b>86%</b> <s>|</s> Spadek: <b>−14%</b>
              </div>
              <button className="btn" onClick={() => setIsModalOpen(true)}>
                Otwórz modal
              </button>
              <button className="btn" onClick={() => showToast("Zapisano pomyślnie!")}>
                Pokaż Toast (.toast)
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================================
            9. STANY KOMPONENTÓW
            ====================================================================== */}
        <section className="space-y-4" id="sec-states">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--accent)]">09</span>
            <h2 className="text-lg font-bold">Stany komponentów (Ładowanie/Szkielet, Pusty, Błąd)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stan Ładowania */}
            <div className="card space-y-3">
              <span className="lbl font-bold">Stan ładowania (Szkielet)</span>
              <div className="h-6 w-2/3 rounded-lg bg-[var(--surface-2)] animate-pulse" />
              <div className="h-12 w-full rounded-xl bg-[var(--surface-2)] animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-[var(--surface-2)] animate-pulse" />
            </div>

            {/* Stan Pusty */}
            <div className="card text-center items-center justify-center p-6 space-y-2">
              <span className="lbl font-bold">Stan pusty</span>
              <div className="round">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
              </div>
              <p className="text-xs font-semibold">Brak transakcji w okresie</p>
              <button className="btn text-xs py-1 px-3">Dodaj pierwszą</button>
            </div>

            {/* Stan Błędu */}
            <div className="card space-y-2 border border-red-500/20 bg-red-500/5">
              <span className="lbl font-bold text-red-500">Stan błędu</span>
              <p className="text-xs text-red-400">Nie udało się pobrać danych z serwera.</p>
              <button className="btn text-xs py-1 px-3 bg-red-600 text-white">Spróbuj ponownie</button>
            </div>
          </div>
        </section>

        {/* ======================================================================
            10. SHELL
            ====================================================================== */}
        <section className="space-y-4" id="sec-shell">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[var(--accent)]">10</span>
            <h2 className="text-lg font-bold">Shell (Górny pasek .top & Zakładki projektu .tabs)</h2>
          </div>

          <div className="card space-y-6">
            <div>
              <span className="lbl block mb-2 font-bold">Górny pasek aplikacji</span>
              <div className="p-3 rounded-2xl bg-[var(--bg)]">
                <div className="top">
                  <div className="logo"><i />velodrome</div>
                  <nav className="pills">
                    <button className="pill" aria-current="page">Home</button>
                    <button className="pill">Work</button>
                    <button className="pill">Time</button>
                    <button className="pill">Budget</button>
                    <button className="pill">Invoices</button>
                    <button className="pill">Clients</button>
                    <button className="pill">Reports</button>
                  </nav>
                  <div className="right">
                    <button className="round" aria-label="Szukaj"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg></button>
                    <button className="round" aria-label="Powiadomienia"><svg viewBox="0 0 24 24"><path d="M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21h4"/></svg><span className="dot" /></button>
                    <button className="round avatar" aria-label="Konto"><span>JK</span></button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="lbl block mb-2 font-bold">Segmentowe zakładki projektu</span>
              <div className="tabs" role="tablist">
                <button className="pill" role="tab">Overview</button>
                <button className="pill" role="tab">List</button>
                <button className="pill" role="tab">Board</button>
                <button className="pill" role="tab">Calendar</button>
                <button className="pill" role="tab">Timeline</button>
                <button className="pill" role="tab" aria-selected="true" aria-current="page">Budget</button>
                <button className="pill" role="tab">Settings</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal Showcase */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Przykładowy Modal (.float)">
        <div className="space-y-4 text-xs">
          <p className="text-[var(--muted)]">
            Modal bazujący na pływającym oknie Clean Data Light z zaokrąglonymi narożnikami i miękkim cieniem.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <button className="btn" onClick={() => setIsModalOpen(false)}>
              Anuluj
            </button>
            <button
              className="btn primary"
              onClick={() => {
                setIsModalOpen(false);
                showToast("Zapisano pomyślnie!");
              }}
            >
              Zapisz zmiany
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Showcase */}
      <div className={`toast ${toastMsg ? "on" : ""}`} role="status">
        {toastMsg}
      </div>
    </div>
  );
}
