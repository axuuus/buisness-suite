export const BRAND = {
  name: "Velodrome",
  shortName: "Velodrome",
  legalName: "Velodrome Suite Sp. z o.o.",
  description: "Platforma do planowania pracy i pilnowania budżetu firmy",
  defaultCurrency: "PLN",
  supportedCurrencies: ["PLN", "EUR", "USD", "GBP"] as const,
  defaultLocale: "pl",
  locales: ["pl", "en"] as const,
  palette: {
    primary: "#2F6BFF",
    secondary: "#1B3FD0",
    accent: "#2F6BFF",
    neutral: "#0B0B0C",
    background: "#F2F2F2",
    surface: "#FFFFFF",
    positive: "#139A38",
    warning: "#F59A3D",
    negative: "#D93A3A",
  },
} as const;

export const BILLING_ENABLED = process.env.BILLING_ENABLED === "true";
