export const BRAND = {
  name: "Velodrome",
  shortName: "Velodrome",
  legalName: "Velodrome Suite Sp. z o.o.",
  description: "Platforma do planowania pracy i pilnowania budżetu firmy",
  defaultCurrency: "PLN",
  supportedCurrencies: ["PLN", "EUR", "USD", "GBP"] as const,
  defaultLocale: "pl",
  locales: ["pl", "en"] as const,
} as const;

export const BILLING_ENABLED = process.env.BILLING_ENABLED === "true";
