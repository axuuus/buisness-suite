"use client";

import React, { useState } from "react";
import { useWorkspace } from "@/context/workspace-context";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/money";

interface TransactionRow {
  product: string;
  order: string;
  status: "Waiting for payment" | "Paid" | "Shipped";
  priceMinor: bigint;
  date: string;
  platform: "Tiktok Shop" | "Instagram" | "Shopify";
  taxMinor: bigint;
  discountMinor: bigint;
}

const SAMPLE_TRANSACTIONS: TransactionRow[] = [
  {
    product: "Roche Watch A18",
    order: "W82026CC",
    status: "Waiting for payment",
    priceMinor: 1999n,
    date: "April 8, 2026",
    platform: "Tiktok Shop",
    taxMinor: 180n,
    discountMinor: 850n,
  },
  {
    product: "Nova Earbuds S2",
    order: "W82031AB",
    status: "Paid",
    priceMinor: 4900n,
    date: "April 9, 2026",
    platform: "Instagram",
    taxMinor: 441n,
    discountMinor: 500n,
  },
  {
    product: "Lumen Desk Lamp",
    order: "W82044KD",
    status: "Shipped",
    priceMinor: 3250n,
    date: "April 11, 2026",
    platform: "Tiktok Shop",
    taxMinor: 293n,
    discountMinor: 0n,
  },
  {
    product: "Aero Bottle 750",
    order: "W82052MN",
    status: "Paid",
    priceMinor: 2400n,
    date: "April 12, 2026",
    platform: "Shopify",
    taxMinor: 216n,
    discountMinor: 300n,
  },
  {
    product: "Pixel Keycaps Set",
    order: "W82063PQ",
    status: "Waiting for payment",
    priceMinor: 3890n,
    date: "April 14, 2026",
    platform: "Instagram",
    taxMinor: 350n,
    discountMinor: 0n,
  },
  {
    product: "Terra Yoga Mat",
    order: "W82071RS",
    status: "Shipped",
    priceMinor: 4500n,
    date: "April 15, 2026",
    platform: "Shopify",
    taxMinor: 405n,
    discountMinor: 650n,
  },
];

export const OverviewTab: React.FC = () => {
  const { currentWorkspace, season, platform, searchQuery, setActiveTab } = useWorkspace();
  const [sortField, setSortField] = useState<keyof TransactionRow>("date");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  const statusRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setIsStatusOpen(false);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const STATUS_OPTIONS = [
    { value: "All", label: "Wszystkie statusy" },
    { value: "Paid", label: "Opłacone (Paid)" },
    { value: "Waiting for payment", label: "Oczekuje na płatność" },
    { value: "Shipped", label: "Wysłane (Shipped)" },
  ];

  const cur = currentWorkspace.default_currency;

  const handleSort = (field: keyof TransactionRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredTransactions = SAMPLE_TRANSACTIONS.filter((row) => {
    const matchesPlatform = platform === "All" || row.platform === platform;
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      row.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.order.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.platform.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesStatus && matchesSearch;
  }).sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "bigint" && typeof bVal === "bigint") {
      return sortAsc ? Number(aVal - bVal) : Number(bVal - aVal);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* 3 KPI Cards row */}
      <div className="cards">
        {/* Card 1: MRR */}
        <Card className="glass">
          <div className="ch">
            <span>
              <svg className="i" viewBox="0 0 24 24">
                <path d="M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" />
              </svg>
              Monthly Recurring Revenue
            </span>
            <span>Avg <b>0,07%</b></span>
          </div>

          <div className="big">
            $87.410
            <span className="chip">0,13%</span>
            <svg className="sun" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          </div>

          <p className="sub">Earnings increase <b>+10% than last month</b></p>

          <Progress
            value={55}
            forecastValue={15}
            tooltip={{ value: "$2.450", chip: "4,02%" }}
          />

          <div className="stats">
            <div>
              New Revenue
              <b>$12,430</b>
            </div>
            <div>
              Expansion
              <b>$4,210</b>
            </div>
            <div>
              Churn
              <b>
                23%
                <span className="mini">
                  <i style={{ width: "23%" }} />
                </span>
              </b>
            </div>
          </div>
        </Card>

        {/* Card 2: Net Revenue Growth */}
        <Card className="glass">
          <div className="ch">
            <span>
              <svg className="i" viewBox="0 0 24 24">
                <path d="M12 2l3 7h7l-5.5 4.5 2 7-6.5-4.5-6.5 4.5 2-7L2 9h7z" />
              </svg>
              Net Revenue Growth
            </span>
            <span>Avg <b>1,01%</b></span>
          </div>

          <div className="big">
            $3.150
            <span className="chip">↓ 0,21%</span>
            <svg className="sun" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
            </svg>
          </div>

          <p className="sub">Earnings increase <b>+2,19% than last month</b></p>

          <div className="lc">
            <div className="yl">
              <span>$5.250,00</span>
              <span>$0.00</span>
            </div>
            <div className="chart relative">
              <div className="tipw">
                <span className="tip glass" style={{ left: "68%" }}>
                  $123.150 <em>4,02%</em>
                </span>
              </div>
              <svg viewBox="0 0 300 100" className="w-full h-24 overflow-visible">
                <defs>
                  <linearGradient id="chartGradOverview" x1="0" x2="1">
                    <stop offset="0%" stopColor="#8C3150" />
                    <stop offset="100%" stopColor="#AF4769" />
                  </linearGradient>
                </defs>
                <path d="M0 90H300" stroke="currentColor" strokeOpacity="0.1" />
                {/* Silver past line */}
                <path
                  d="M10 85 L50 75 L90 70 L130 55 L170 30 L210 20 L250 15 L290 8"
                  fill="none"
                  stroke="#B5B1B5"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Rose current line */}
                <path
                  d="M10 88 L50 72 L90 65 L130 50 L170 25 L210 18 L250 10 L290 5"
                  fill="none"
                  stroke="url(#chartGradOverview)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <line x1="204" y1="19" x2="204" y2="90" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="3 3" />
                <circle cx="204" cy="19" r="4.5" fill="#AF4769" stroke="#fff" strokeWidth="2" />
              </svg>
              <div className="xs">
                <span>Aug 1</span>
                <span>Aug 31</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 3: Active Users */}
        <Card className="glass">
          <div className="ch">
            <span>
              <svg className="i" viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
              Active Users
            </span>
            <span>Avg <b>2,01%</b></span>
          </div>

          <div className="avg">
            <span>Avg User</span>
            <span>→</span>
          </div>

          <div className="ur">
            <div>
              <div className="big">
                97%
                <span className="chip">4,02%</span>
              </div>
              <p className="nu">New User <b>814% ↑</b></p>
            </div>
            <div className="bars">
              {[25, 40, 55, 38, 70, 85, 98, 78, 62, 48, 68].map((h, i) => (
                <i
                  key={i}
                  className={i >= 5 && i <= 8 ? "on" : ""}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="ins">
            <div>
              <span>Golden Hour <b>2:00 PM</b></span>
              <span>Quality <b>Excellent</b></span>
              <span>
                Churn <b>13%</b>
                <span className="mini"><i style={{ width: "13%" }} /></span>
              </span>
            </div>
            <a onClick={() => setActiveTab("Analytics")}>
              See user details more clearly. View user insights
            </a>
          </div>
        </Card>
      </div>

      {/* Product Overview Table */}
      <div className="tbl glass">
        <div className="th">
          <h2>Product Overview</h2>
          <div className="btns">
            <div className="relative" ref={statusRef}>
              <button
                type="button"
                className="btn text-xs bg-[var(--chip)]"
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                aria-label="Filtruj status"
              >
                <span>{STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label || "Wszystkie statusy"}</span>
                <svg className="w-2.5 h-2.5 ml-1 opacity-70" viewBox="0 0 10 10">
                  <path d="M1 3h8L5 8z" fill="currentColor" />
                </svg>
              </button>
              {isStatusOpen && (
                <div className="pop min-w-[13rem] right-0 top-10 shadow-2xl">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className="mi"
                      onClick={() => {
                        setStatusFilter(opt.value);
                        setIsStatusOpen(false);
                      }}
                    >
                      <span className={opt.value === statusFilter ? "text-[var(--rose)] font-semibold" : ""}>
                        {opt.label}
                      </span>
                      {opt.value === statusFilter && <span className="text-[var(--rose)] font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              className="btn dark"
              onClick={() => {
                const csv = [
                  "Product,Order,Status,Price,Date,Platform",
                  ...filteredTransactions.map(
                    (t) =>
                      `"${t.product}","${t.order}","${t.status}","${formatMoney(t.priceMinor, cur)}","${t.date}","${t.platform}"`
                  ),
                ].join("\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `velodrome-orders-${season.replace(/\s+/g, "_")}.csv`;
                a.click();
              }}
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>
                  <button type="button" onClick={() => handleSort("product")}>
                    Product {sortField === "product" && (sortAsc ? "↑" : "↓")}
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => handleSort("order")}>
                    Order {sortField === "order" && (sortAsc ? "↑" : "↓")}
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => handleSort("status")}>
                    Status {sortField === "status" && (sortAsc ? "↑" : "↓")}
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => handleSort("priceMinor")}>
                    Price {sortField === "priceMinor" && (sortAsc ? "↑" : "↓")}
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => handleSort("date")}>
                    Date {sortField === "date" && (sortAsc ? "↑" : "↓")}
                  </button>
                </th>
                <th>
                  <button type="button" onClick={() => handleSort("platform")}>
                    Platform {sortField === "platform" && (sortAsc ? "↑" : "↓")}
                  </button>
                </th>
                <th>Tax</th>
                <th>Discount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((row) => (
                  <tr key={row.order}>
                    <td data-l="Product" className="font-medium text-[var(--text)]">
                      {row.product}
                    </td>
                    <td data-l="Order" className="font-mono text-xs opacity-75">
                      {row.order}
                    </td>
                    <td data-l="Status">
                      <span className={`st ${row.status === "Paid" || row.status === "Shipped" ? "ok" : ""}`}>
                        {row.status}
                      </span>
                    </td>
                    <td data-l="Price" className="tabular-nums font-semibold">
                      {formatMoney(row.priceMinor, cur)}
                    </td>
                    <td data-l="Date" className="opacity-80">
                      {row.date}
                    </td>
                    <td data-l="Platform">
                      <span className="pf">
                        <i />
                        {row.platform}
                      </span>
                    </td>
                    <td data-l="Tax" className="tabular-nums opacity-75">
                      {formatMoney(row.taxMinor, cur)}
                    </td>
                    <td data-l="Discount" className="tabular-nums opacity-75">
                      {formatMoney(row.discountMinor, cur)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="emp">
                    Brak wyników. Zmień filtry lub wyczyść wyszukiwanie.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
