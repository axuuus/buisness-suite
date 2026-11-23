"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";

interface Customer {
  id: string;
  name: string;
  tier: "Starter" | "Pro" | "Scale";
  mrrMinor: bigint;
  status: "Active" | "Trial" | "Pending";
  platform: "Shopify" | "Tiktok Shop" | "Instagram";
  joinedDate: string;
}

const SAMPLE_CUSTOMERS: Customer[] = [
  { id: "1", name: "Northwind Studio", tier: "Pro", mrrMinor: 48000n, status: "Active", platform: "Shopify", joinedDate: "2025-01-14" },
  { id: "2", name: "Kite and Co.", tier: "Scale", mrrMinor: 125000n, status: "Active", platform: "Tiktok Shop", joinedDate: "2025-02-03" },
  { id: "3", name: "Maple Lane Goods", tier: "Starter", mrrMinor: 9000n, status: "Trial", platform: "Instagram", joinedDate: "2025-03-21" },
  { id: "4", name: "Fjord Outfitters", tier: "Pro", mrrMinor: 52000n, status: "Active", platform: "Shopify", joinedDate: "2025-04-02" },
  { id: "5", name: "Bright Pantry", tier: "Starter", mrrMinor: 12000n, status: "Pending", platform: "Instagram", joinedDate: "2025-05-19" },
  { id: "6", name: "Helix Labs", tier: "Scale", mrrMinor: 183000n, status: "Active", platform: "Tiktok Shop", joinedDate: "2025-06-08" },
];

export const CustomersTab: React.FC = () => {
  const { currentWorkspace, searchQuery } = useWorkspace();
  const [filterTier, setFilterTier] = useState<string>("All");
  const [isTierOpen, setIsTierOpen] = useState<boolean>(false);
  const tierRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (tierRef.current && !tierRef.current.contains(e.target as Node)) {
        setIsTierOpen(false);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const TIER_OPTIONS = [
    { value: "All", label: "Wszystkie plany" },
    { value: "Starter", label: "Starter" },
    { value: "Pro", label: "Pro" },
    { value: "Scale", label: "Scale" },
  ];

  const cur = currentWorkspace.default_currency;

  const filtered = SAMPLE_CUSTOMERS.filter((c) => {
    const matchesTier = filterTier === "All" || c.tier === filterTier;
    const matchesQuery = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Klienci & Konta (CRM)</h2>
          <p className="text-xs text-[var(--muted)]">Zarządzanie klientami B2B, umowami i subskrypcjami</p>
        </div>
        <div className="flex gap-2">
          <div className="relative" ref={tierRef}>
            <button
              type="button"
              className="btn text-xs bg-[var(--chip)]"
              onClick={() => setIsTierOpen(!isTierOpen)}
            >
              <span>{TIER_OPTIONS.find((o) => o.value === filterTier)?.label || "Wszystkie plany"}</span>
              <svg className="w-2.5 h-2.5 ml-1 opacity-70" viewBox="0 0 10 10">
                <path d="M1 3h8L5 8z" fill="currentColor" />
              </svg>
            </button>
            {isTierOpen && (
              <div className="pop min-w-[11rem] right-0 top-10 shadow-2xl">
                {TIER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className="mi"
                    onClick={() => {
                      setFilterTier(opt.value);
                      setIsTierOpen(false);
                    }}
                  >
                    <span className={opt.value === filterTier ? "text-[var(--rose)] font-semibold" : ""}>
                      {opt.label}
                    </span>
                    {opt.value === filterTier && <span className="text-[var(--rose)] font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button variant="rose">+ Dodaj klienta</Button>
        </div>
      </div>

      <div className="tbl glass">
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>Klient / Firma</th>
                <th>Pakiet</th>
                <th>Wartość miesięczna (MRR)</th>
                <th>Status</th>
                <th>Platforma</th>
                <th>Data dołączenia</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td data-l="Klient" className="font-semibold text-[var(--text)]">
                    {c.name}
                  </td>
                  <td data-l="Pakiet">
                    <span className="chip font-medium">{c.tier}</span>
                  </td>
                  <td data-l="MRR" className="tabular-nums font-bold">
                    {formatMoney(c.mrrMinor, cur)}
                  </td>
                  <td data-l="Status">
                    <span className={`st ${c.status === "Active" ? "ok" : ""}`}>{c.status}</span>
                  </td>
                  <td data-l="Platforma">
                    <span className="pf">
                      <i />
                      {c.platform}
                    </span>
                  </td>
                  <td data-l="Data" className="opacity-80">
                    {c.joinedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
