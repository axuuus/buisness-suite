export interface Money {
  amountMinor: bigint | number;
  currency: string;
}

/**
 * Format money with correct locale and currency symbol.
 * Always handles money in minor units (cents, grosze).
 */
export function formatMoney(
  amountMinor: bigint | number,
  currency: string = "PLN",
  locale: string = "pl-PL"
): string {
  const majorValue = Number(amountMinor) / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(majorValue);
}

/**
 * Parses user input string (e.g. "123,45" or "123.45") into minor units (integer).
 */
export function parseMoneyToMinor(input: string): number {
  const sanitized = input.replace(/\s+/g, "").replace(",", ".");
  const val = parseFloat(sanitized);
  if (isNaN(val)) return 0;
  return Math.round(val * 100);
}
