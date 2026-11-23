"use client";

import React from "react";
import { useWorkspace } from "@/context/workspace-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const ReportsTab: React.FC = () => {
  const { currentWorkspace, season } = useWorkspace();

  const REPORTS = [
    { title: "Raport Przychodu i Kosztów Q1", desc: "Zestawienie marży brutto i netto z podziałem na klientów", date: "2026-04-01" },
    { title: "Zestawienie Czasu Pracy Zespołu", desc: "Zestawienie godzin billable vs non-billable", date: "2026-04-15" },
    { title: "Audyt Podatkowy i Rejestr VAT", desc: "Podsumowanie stawek podatkowych i obrotu", date: "2026-04-20" },
    { title: "Analiza Realizacji Budżetów Projektowych", desc: "Porównanie budżetów planowanych i rzeczywistych", date: "2026-04-28" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Raporty Biznesowe</h2>
          <p className="text-xs text-[var(--muted)]">Automatycznie generowane raporty i zestawienia dla {season}</p>
        </div>
        <Button variant="rose">+ Wygeneruj raport niestandardowy</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map((rep, idx) => (
          <Card key={idx} className="glass p-5 flex flex-col justify-between">
            <div>
              <div className="ch">
                <span className="text-xs font-semibold text-[var(--rose)]">PDF / Excel</span>
                <span className="text-[0.68rem] opacity-75">{rep.date}</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text)]">{rep.title}</h3>
              <p className="text-xs text-[var(--muted)] mt-1">{rep.desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-[var(--line)] flex justify-end gap-2">
              <Button className="text-xs">Podgląd</Button>
              <Button variant="dark" className="text-xs">Eksportuj CSV</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
