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
          <select
            className="btn text-xs bg-[var(--chip)] cursor-pointer outline-none"
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
          >
            <option value="All">Wszystkie plany</option>
            <option value="Starter">Starter</option>
            <option value="Pro">Pro</option>
            <option value="Scale">Scale</option>
          </select>
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
