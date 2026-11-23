"use client";

import React from "react";
import { useWorkspace } from "@/context/workspace-context";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const AnalyticsTab: React.FC = () => {
  const { currentWorkspace, season } = useWorkspace();
  const cur = currentWorkspace.default_currency;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Szczegółowa Analityka i KPI</h2>
          <p className="text-xs text-[var(--muted)]">Analiza przychodów, konwersji i retencji dla {season}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="glass">
          <div className="ch">
            <span>Retencja użytkowników (Retention)</span>
            <span>Avg <b>94.2%</b></span>
          </div>
          <div className="big">88.4% <span className="chip">+3.1%</span></div>
          <p className="sub">Kohorta 30-dniowa stabilna</p>
          <Progress value={88} tooltip={{ value: "88.4%", chip: "Stable" }} />
          <div className="stats mt-auto pt-3">
            <div>Kohorta D1<b>96%</b></div>
            <div>Kohorta D7<b>92%</b></div>
            <div>Kohorta D30<b>88%</b></div>
          </div>
        </Card>

        <Card className="glass">
          <div className="ch">
            <span>Customer Acquisition Cost (CAC)</span>
            <span>Avg <b>32 zł</b></span>
          </div>
          <div className="big">28.50 {cur} <span className="chip">↓ -12%</span></div>
          <p className="sub">Koszt pozyskania klienta maleje</p>
          <Progress value={45} tooltip={{ value: `28.50 ${cur}`, chip: "Optymalne" }} />
          <div className="stats mt-auto pt-3">
            <div>Wydatki ads<b>4 200 {cur}</b></div>
            <div>Pozyskani<b>147</b></div>
          </div>
        </Card>

        <Card className="glass">
          <div className="ch">
            <span>Customer Lifetime Value (LTV)</span>
            <span>Avg <b>420 zł</b></span>
          </div>
          <div className="big">1 480 {cur} <span className="chip">+18%</span></div>
          <p className="sub">Stosunek LTV:CAC = 5.2 (Doskonały)</p>
          <Progress value={78} forecastValue={12} tooltip={{ value: `1 480 ${cur}`, chip: "+18%" }} />
          <div className="stats mt-auto pt-3">
            <div>Śr. czas trwania<b>14 mies.</b></div>
            <div>Śr. marża<b>74%</b></div>
          </div>
        </Card>
      </div>
    </div>
  );
};
