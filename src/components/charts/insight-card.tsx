"use client";

import React from "react";

interface InsightCardProps {
  dateOrValue?: string;
  title?: string;
  description?: string;
  tagLabel?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  dateOrValue = "14.12",
  title = "Projekt „Rebranding Atlas” przekroczy budżet przy obecnym tempie.",
  description = "Burn rate wzrósł o 18% w ostatnich 14 dniach. Zmniejszenie zakresu o 40 godzin utrzyma projekt w budżecie.",
  tagLabel = "Insights",
}) => {
  return (
    <section className="ins" aria-labelledby="h-ins">
      <span className="tg" id="h-ins">
        {tagLabel}
      </span>
      <div className="big">{dateOrValue}</div>
      <p>{title}</p>
      <small>{description}</small>
      <div className="ci" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </section>
  );
};
