"use client";

import React, { useState } from "react";
import { BurnDown } from "@/components/charts/burn-down";

interface ExpenseRow {
  date: string;
  vendor: string;
  category: string;
  amount: number;
  statusClass: "ok" | "wait" | "paid" | "bad";
  statusText: string;
}

const INITIAL_EXPENSES: ExpenseRow[] = [
  { date: "12.11", vendor: "Adobe", category: "Oprogramowanie", amount: 1290, statusClass: "ok", statusText: "Zatwierdzony" },
  { date: "08.11", vendor: "Studio Foto Nova", category: "Podwykonawcy", amount: 8400, statusClass: "wait", statusText: "Oczekuje" },
  { date: "29.10", vendor: "Meta Ads", category: "Marketing", amount: 5200, statusClass: "paid", statusText: "Zwrócony" },
  { date: "21.10", vendor: "Freelancer J. Lis", category: "Podwykonawcy", amount: 12000, statusClass: "ok", statusText: "Zatwierdzony" },
  { date: "14.10", vendor: "Druk Express", category: "Inne", amount: 2150, statusClass: "ok", statusText: "Zatwierdzony" },
];

export const BudgetView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Budget");
  const [sortDir, setSortDir] = useState<number>(1);
  const [expenses, setExpenses] = useState<ExpenseRow[]>(INITIAL_EXPENSES);

  const formatMoney = (n: number) =>
    String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");

  const handleSort = () => {
    const nextDir = -sortDir;
    setSortDir(nextDir);
    setExpenses([...expenses].sort((a, b) => (a.amount - b.amount) * nextDir));
  };

  const PROJECT_TABS = ["Overview", "List", "Board", "Calendar", "Timeline", "Budget", "Settings"];

  return (
    <div id="v-budget" className="space-y-4">
      {/* 1. Project Head */}
      <div className="head">
        <h1>Rebranding Atlas</h1>
        <div className="tools">
          <button type="button" className="seg gray">
            Eksport
          </button>
          <button type="button" className="btn">
            Dodaj wydatek +
          </button>
        </div>
      </div>

      {/* 2. Contextual Project Tabs */}
      <div className="tabs" role="tablist" aria-label="Widoki projektu">
        {PROJECT_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className="pill"
            role="tab"
            aria-selected={activeTab === tab}
            aria-current={activeTab === tab ? "page" : undefined}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Row of 4 KPI Cards */}
      <div className="g4">
        <section className="card">
          <span className="lbl">Budżet</span>
          <div className="big">120 000 zł</div>
          <div>
            <span className="sp">Stała cena</span>
          </div>
        </section>

        <section className="card">
          <span className="lbl">Wydano</span>
          <div className="big">98 400 zł</div>
          <div>
            <span className="sp wait">82% budżetu</span>
          </div>
        </section>

        <section className="card">
          <span className="lbl">Pozostało</span>
          <div className="big">21 600 zł</div>
          <div>
            <span className="sp">18%</span>
          </div>
        </section>

        <section className="card">
          <span className="lbl">Prognoza</span>
          <div className="big">134 500 zł</div>
          <div>
            <span className="sp bad">⚠ +12% ponad budżet</span>
          </div>
        </section>
      </div>

      {/* 4. Grid */}
      <div className="grid">
        {/* Zużycie budżetu */}
        <section className="card wide" aria-labelledby="h-use">
          <header>
            <h2 id="h-use">Zużycie budżetu</h2>
            <button className="round sm" aria-label="Więcej opcji">
              ⋯
            </button>
          </header>

          <div
            className="use"
            role="img"
            aria-label="Wydano 82% budżetu, prognoza 112%"
          >
            <i className="a" />
            <i className="f" />
            <u>
              <span>Budżet 100%</span>
            </u>
          </div>

          <div className="leg" style={{ marginTop: "0.5rem" }}>
            <span>
              <b style={{ background: "var(--warning)" }} />
              Wydano 82%
            </span>
            <span>
              <b style={{ background: "var(--red-500)" }} />
              Prognoza 112%: przekroczenie ok. 14.12
            </span>
          </div>

          <div className="rows" style={{ marginTop: "1.25rem" }}>
            <div className="row">
              <div>
                <span>Praca</span>
                <b>62 400 zł z 70 000 zł</b>
              </div>
              <div className="track">
                <div className="fill" style={{ "--c": "var(--accent)", width: "89%" } as React.CSSProperties} />
              </div>
            </div>

            <div className="row">
              <div>
                <span>Podwykonawcy</span>
                <b>26 200 zł z 30 000 zł</b>
              </div>
              <div className="track">
                <div className="fill" style={{ "--c": "var(--warning)", width: "87%" } as React.CSSProperties} />
              </div>
            </div>

            <div className="row">
              <div>
                <span>Oprogramowanie i marketing</span>
                <b>9 800 zł z 20 000 zł</b>
              </div>
              <div className="track">
                <div className="fill" style={{ "--c": "var(--green-500)", width: "49%" } as React.CSSProperties} />
              </div>
            </div>
          </div>
        </section>

        {/* Burn-down */}
        <section className="card" aria-labelledby="h-bd">
          <header>
            <h2 id="h-bd">Burn-down</h2>
            <button className="round sm" aria-label="Więcej opcji">
              ⋯
            </button>
          </header>
          <BurnDown />
          <div className="leg">
            <span>
              <b style={{ background: "var(--faint)" }} />
              Plan
            </span>
            <span>
              <b style={{ background: "var(--accent)" }} />
              Rzeczywistość
            </span>
            <span>
              <b style={{ background: "var(--red-500)" }} />
              Prognoza
            </span>
          </div>
        </section>

        {/* Wydatki Table */}
        <section className="card wide" aria-labelledby="h-exp">
          <header>
            <h2 id="h-exp">Wydatki</h2>
            <button className="round sm" aria-label="Więcej opcji">
              ⋯
            </button>
          </header>

          <div className="tw">
            <table id="tb">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Dostawca</th>
                  <th>Kategoria</th>
                  <th className="r" aria-sort={sortDir > 0 ? "ascending" : "descending"}>
                    <button type="button" onClick={handleSort}>
                      Kwota {sortDir > 0 ? "↑" : "↓"}
                    </button>
                  </th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((row, i) => (
                  <tr key={i}>
                    <td data-l="Data">{row.date}</td>
                    <td data-l="Dostawca">{row.vendor}</td>
                    <td data-l="Kategoria">{row.category}</td>
                    <td className="r" data-l="Kwota">
                      {formatMoney(row.amount)} zł
                    </td>
                    <td data-l="Status">
                      <span className={`sp ${row.statusClass}`}>{row.statusText}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
