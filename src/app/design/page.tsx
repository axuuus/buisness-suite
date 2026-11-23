"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch, SegmentedControl } from "@/components/ui/switch";
import { Modal } from "@/components/ui/modal";
import { BRAND } from "@/config/brand";

export default function DesignSystemPage() {
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("auto");
  const [currency, setCurrency] = useState<string>("zł");
  const [switchVal, setSwitchVal] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toggleTheme = (val: "auto" | "light" | "dark") => {
    setTheme(val);
    const root = document.documentElement;
    if (val === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", val);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  };

  return (
    <div className="shell min-h-screen p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header / Bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xs text-[var(--muted)] hover:text-[var(--text)]">
              ← Strona Główna
            </Link>
            <span className="text-[var(--muted)]">/</span>
            <span className="text-xs font-semibold text-[var(--rose)]">System Wyglądu (Faza 0)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Galeria Komponentów Velodrome
          </h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Prezentacja wszystkich komponentów z sekcji 4.5 specyfikacji w każdym stanie.
          </p>
        </div>

        {/* Theme & Controls Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[var(--muted)]">Motyw:</span>
            <SegmentedControl
              value={theme}
              options={["auto", "light", "dark"]}
              onChange={toggleTheme}
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[var(--muted)]">Waluta:</span>
            <SegmentedControl
              value={currency}
              options={["zł", "$", "€", "£"]}
              onChange={setCurrency}
            />
          </div>
        </div>
      </header>

      {/* 1. BUTTONS (Wszystkie warianty i stany) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
          <span>1. Przyciski (Button Styles & States)</span>
          <span className="text-xs font-normal text-[var(--muted)]">sekcja 4.5</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl glass">
          {/* Neutral */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[var(--muted)]">Wariant Neutralny (.btn)</h3>
            <div className="space-y-1.5">
              <Button onClick={() => showToast("Kliknięto Domyślny")}>Domyślny (Default)</Button>
              <Button className="hover:bg-[var(--chip)]">Hover / Focus</Button>
              <Button disabled>Wyłączony (Disabled)</Button>
              <Button isLoading>Ładowanie (Loading)</Button>
            </div>
          </div>

          {/* Dark */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[var(--muted)]">Wariant Ciemny (.btn.dark)</h3>
            <div className="space-y-1.5">
              <Button variant="dark" onClick={() => showToast("Kliknięto Ciemny")}>
                Domyślny (Default)
              </Button>
              <Button variant="dark" disabled>
                Wyłączony (Disabled)
              </Button>
              <Button variant="dark" isLoading>
                Ładowanie (Loading)
              </Button>
            </div>
          </div>

          {/* Rose */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[var(--muted)]">Wariant Rose (.btn.rose)</h3>
            <div className="space-y-1.5">
              <Button variant="rose" onClick={() => showToast("Kliknięto Rose")}>
                Domyślny (Default)
              </Button>
              <Button variant="rose" disabled>
                Wyłączony (Disabled)
              </Button>
              <Button variant="rose" isLoading>
                Ładowanie (Loading)
              </Button>
            </div>
          </div>

          {/* Interactive Trigger */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-[var(--muted)]">Interakcje Modala & Toastu</h3>
            <div className="space-y-1.5">
              <Button variant="rose" onClick={() => setIsModalOpen(true)}>
                Otwórz Modal (.md)
              </Button>
              <Button variant="dark" onClick={() => showToast("Przykładowe powiadomienie Toast!")}>
                Pokaż Toast (.toast)
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KPI CARDS (Wszystkie stany: default, loading, error, empty) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
          <span>2. Karty KPI (.card.glass we wszystkich stanach)</span>
          <span className="text-xs font-normal text-[var(--muted)]">sekcja 4.5</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Default State */}
          <Card>
            <div className="ch">
              <span>
                <svg className="i" viewBox="0 0 24 24">
                  <path d="M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" />
                </svg>
                Stan Domyślny
              </span>
              <span>Avg <b>0,07%</b></span>
            </div>
            <div className="big">
              87 410 {currency}
              <span className="chip">0,13%</span>
            </div>
            <p className="sub">Earnings increase <b>+10%</b></p>
            <Progress
              value={55}
              forecastValue={15}
              tooltip={{ value: `2 450 ${currency}`, chip: "4,02%" }}
            />
            <div className="stats mt-auto pt-3">
              <div>Nowe<b>12 430 {currency}</b></div>
              <div>Churn<b>0.8%</b></div>
            </div>
          </Card>

          {/* Loading State */}
          <Card isLoading />

          {/* Error State */}
          <Card isError errorMessage="Błąd synchronizacji z bazą danych" />

          {/* Empty State */}
          <Card isEmpty emptyMessage="Brak aktywnych transakcji w tym miesiącu" />
        </div>
      </section>

      {/* 3. PROGRESS, CHARTS & BARS */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
          <span>3. Wykresy Liniowe, Słupkowe i Postęp</span>
          <span className="text-xs font-normal text-[var(--muted)]">sekcja 4.5</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Linear Chart replica */}
          <Card>
            <div className="ch">
              <span>Wykres Liniowy z Optyką Szklaną</span>
              <span>Avg <b>1,01%</b></span>
            </div>
            <div className="big">
              123 150 {currency}
              <span className="chip">↓ 0,21%</span>
            </div>
            <div className="lc mt-4">
              <div className="yl text-[0.62rem] text-[var(--muted)] flex flex-col justify-between py-2">
                <span>5 250 {currency}</span>
                <span>0 {currency}</span>
              </div>
              <div className="chart relative">
                <div className="tipw">
                  <span className="tip glass" style={{ left: "56%" }}>
                    123 150 {currency} <em>4,02%</em>
                  </span>
                </div>
                <svg viewBox="0 0 300 100" className="w-full h-24 overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" x2="1">
                      <stop offset="0%" stopColor="#8C3150" />
                      <stop offset="100%" stopColor="#AF4769" />
                    </linearGradient>
                  </defs>
                  <path d="M0 90H300" stroke="currentColor" strokeOpacity="0.12" />
                  <path
                    d="M10 85 L50 75 L90 70 L130 55 L170 30 L210 20 L250 15 L290 8"
                    fill="none"
                    stroke="#B5B1B5"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 88 L50 72 L90 65 L130 50 L170 25 L210 18 L250 10 L290 5"
                    fill="none"
                    stroke="url(#chartGrad)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                  <line x1="170" y1="25" x2="170" y2="90" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="3 3" />
                  <circle cx="170" cy="25" r="4.5" fill="#AF4769" stroke="#fff" strokeWidth="2" />
                </svg>
                <div className="xs flex justify-between text-[0.62rem] text-[var(--muted)] mt-1">
                  <span>01 Sie</span>
                  <span>31 Sie</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Bar Chart replica */}
          <Card>
            <div className="ch">
              <span>Słupki Pionowe & Wskaźnik Użytkowników</span>
              <span>Avg <b>2,01%</b></span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="big">97.4% <span className="chip">4,02%</span></div>
                <p className="text-xs text-[var(--muted)] mt-1">Nowi użytkownicy: <b>814% ↑</b></p>
              </div>
              <div className="bars flex items-end gap-1.5 h-16 w-36">
                {[30, 45, 60, 40, 75, 88, 100, 80, 65, 50, 70].map((h, i) => (
                  <i
                    key={i}
                    className={i >= 5 && i <= 8 ? "on" : ""}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="ins mt-auto pt-3">
              <div className="flex justify-between text-xs">
                <span>Godzina szczytu: <b>14:00</b></span>
                <span>Jakość: <b>Doskonała</b></span>
                <span>Churn: <b>13%</b></span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. BADGES & STATUSES (W tym reguły sekcji 4.7 budżetu) */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
          <span>4. Pigułki Statusu & Alerty Budżetu</span>
          <span className="text-xs font-normal text-[var(--muted)]">sekcja 4.5 & 4.7</span>
        </h2>
        <div className="p-5 rounded-2xl glass space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-[var(--muted)]">Statusy ogólne:</span>
            <Badge variant="ok">Aktywny / Opłacone (OK)</Badge>
            <Badge variant="pending">Oczekuje na zatwierdzenie (Pending)</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--line)]">
            <span className="text-xs text-[var(--muted)]">Reguły budżetu (sekcja 4.7):</span>
            <Badge variant="budget-ok">&lt;75% W normie (--rose)</Badge>
            <Badge variant="budget-warn">75–99% Ostrzeżenie (Bursztyn #C98A2B)</Badge>
            <Badge variant="budget-alert">≥100% Przekroczenie budżetu (--deep)</Badge>
          </div>
        </div>
      </section>

      {/* 5. SWITCHES & FORM CONTROLS */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
          <span>5. Przełączniki & Kontrolki Formularza</span>
          <span className="text-xs font-normal text-[var(--muted)]">sekcja 4.5</span>
        </h2>
        <div className="p-5 rounded-2xl glass grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--chip)]">
            <span className="text-xs font-medium">Przełącznik (.sw) aktywny:</span>
            <Switch checked={switchVal} onChange={setSwitchVal} label="Demo switch" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--chip)]">
            <span className="text-xs font-medium">Przełącznik wyłączony:</span>
            <Switch checked={false} onChange={() => {}} disabled label="Disabled switch" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--chip)]">
            <span className="text-xs font-medium">Segment (.seg):</span>
            <SegmentedControl
              value="Tydzień"
              options={["Dzień", "Tydzień", "Miesiąc"]}
              onChange={() => {}}
            />
          </div>
        </div>
      </section>

      {/* 6. MODAL & TOAST COMPONENT */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Przykładowy Szklany Modal (.md)">
        <p className="text-xs text-[var(--muted)]">
          To jest szklany modal wykonany według wytycznych z sekcji 4.5 (max-height: 90dvh, blur 30px, pułapka fokusa, Escape zamyka).
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={() => setIsModalOpen(false)}>Zamknij</Button>
          <Button variant="rose" onClick={() => { setIsModalOpen(false); showToast("Zapisano pomyślnie!"); }}>
            Zapisz zmiany
          </Button>
        </div>
      </Modal>

      {/* Toast Notification Container */}
      <div className={`toast ${toastMsg ? "on" : ""}`} role="status">
        {toastMsg}
      </div>
    </div>
  );
}
