import pl from "./dictionaries/pl.json";
import en from "./dictionaries/en.json";

export type Locale = "pl" | "en";

export const dictionaries = {
  pl,
  en,
} as const;

export function getDictionary(locale: Locale = "pl") {
  return dictionaries[locale] || dictionaries.pl;
}

export type Dictionary = typeof pl;
