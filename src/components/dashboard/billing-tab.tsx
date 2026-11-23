"use client";

import React from "react";
import { useWorkspace } from "@/context/workspace-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/money";

interface Invoice {
  id: string;
  client: string;
  amountMinor: bigint;
  date: string;
  status: "Paid" | "Pending" | "Overdue";
}

const SAMPLE_INVOICES: Invoice[] = [
  { id: "INV-1042", client: "Northwind Studio", amountMinor: 48000n, date: "2026-04-20", status: "Paid" },
  { id: "INV-1043", client: "Kite and Co.", amountMinor: 125000n, date: "2026-04-25", status: "Pending" },
  { id: "INV-1044", client: "Maple Lane Goods", amountMinor: 9000n, date: "2026-04-28", status: "Pending" },
  { id: "INV-1045", client: "Helix Labs", amountMinor: 183000n, date: "2026-05-02", status: "Paid" },
  { id: "INV-1046", client: "Bright Pantry", amountMinor: 12000n, date: "2026-05-05", status: "Pending" },
];

export const BillingTab: React.FC = () => {
  const { currentWorkspace } = useWorkspace();
  const cur = currentWorkspace.default_currency;

  const totalPaid = SAMPLE_INVOICES
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + i.amountMinor, 0n);

  const totalPending = SAMPLE_INVOICES
    .filter((i) => i.status === "Pending")
    .reduce((sum, i) => sum + i.amountMinor, 0n);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Faktury & Rozliczenia Finansowe</h2>
          <p className="text-xs text-[var(--muted)]">Zarządzanie płatnościami i fakturowaniem (wartości w groszach)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="dark">Pobierz Zestawienie PDF</Button>
          <Button variant="rose">+ Nowa Faktura</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="glass">
          <div className="ch">
            <span>Opłacone w tym miesiącu</span>
            <span className="st ok">Zaksięgowane</span>
          </div>
          <div className="big">{formatMoney(totalPaid, cur)}</div>
          <p className="sub text-xs text-[var(--muted)]">Transakcje rozliczone na rachunku bankowym</p>
        </Card>

        <Card className="glass">
          <div className="ch">
            <span>Oczekujące na wpłatę</span>
            <span className="st">W toku</span>
          </div>
          <div className="big">{formatMoney(totalPending, cur)}</div>
          <p className="sub text-xs text-[var(--muted)]">Termin płatności do 14 dni</p>
        </Card>
      </div>

      <div className="tbl glass">
        <div className="th">
          <h2>Historia Faktur</h2>
        </div>
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>Numer Faktury</th>
                <th>Odbiorca / Klient</th>
                <th>Kwota Brutto</th>
                <th>Termin Płatności</th>
                <th>Status</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_INVOICES.map((inv) => (
                <tr key={inv.id}>
                  <td data-l="Numer" className="font-mono font-bold text-[var(--text)]">
                    {inv.id}
                  </td>
                  <td data-l="Klient">{inv.client}</td>
                  <td data-l="Kwota" className="tabular-nums font-bold">
                    {formatMoney(inv.amountMinor, cur)}
                  </td>
                  <td data-l="Termin" className="opacity-80">
                    {inv.date}
                  </td>
                  <td data-l="Status">
                    <span className={`st ${inv.status === "Paid" ? "ok" : ""}`}>{inv.status}</span>
                  </td>
                  <td data-l="Akcje">
                    <button type="button" className="text-xs text-[var(--rose)] hover:underline font-medium">
                      Pobierz PDF
                    </button>
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
