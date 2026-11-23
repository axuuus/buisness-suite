/**
 * Fractional Indexing Generator
 * Umożliwia generowanie kluczy sortowania pozycji (stringów) pomiędzy dowolnymi dwoma elementami
 * bez konieczności reindeksowania pozostałych tysięcy wierszy w bazie danych.
 * Alfabet: 0-9, a-z (36 znaków bazowych).
 */

const BASE_DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";
const MID_CHAR = "n";

/**
 * Zwraca unikalny string pozycji pomiędzy prev a next w porządku leksykograficznym.
 * - Jeśli prev i next są null/undefined: zwraca "n"
 * - Jeśli prev jest null: generuje string mniejszy od next
 * - Jeśli next jest null: generuje string większy od prev
 * - Jeśli oba są podane: generuje string leksykograficznie pomiędzy prev a next
 */
export function generatePositionBetween(
  prev?: string | null,
  next?: string | null
): string {
  // Pusta lista
  if (!prev && !next) {
    return MID_CHAR;
  }

  // Wstawienie przed pierwszym elementem
  if (!prev && next) {
    for (let i = 0; i < next.length; i++) {
      const idx = BASE_DIGITS.indexOf(next[i]);
      if (idx > 1) {
        return next.slice(0, i) + BASE_DIGITS[Math.floor(idx / 2)];
      }
    }
    return "0" + next;
  }

  // Wstawienie za ostatnim elementem
  if (prev && !next) {
    const lastChar = prev[prev.length - 1];
    const idx = BASE_DIGITS.indexOf(lastChar);
    if (idx < BASE_DIGITS.length - 2) {
      return prev.slice(0, -1) + BASE_DIGITS[idx + 1];
    }
    return prev + MID_CHAR;
  }

  // Wstawienie pomiędzy dwoma elementami
  if (prev && next) {
    if (prev >= next) {
      return prev + MID_CHAR;
    }

    let i = 0;
    while (true) {
      const pChar = prev[i] ?? "0";
      const nChar = next[i] ?? "z";

      const pIdx = BASE_DIGITS.indexOf(pChar);
      const nIdx = BASE_DIGITS.indexOf(nChar);

      if (pIdx === nIdx) {
        i++;
        continue;
      }

      if (nIdx - pIdx > 1) {
        const mid = Math.floor((pIdx + nIdx) / 2);
        return prev.slice(0, i) + BASE_DIGITS[mid];
      }

      // nIdx - pIdx === 1
      let j = i + 1;
      while (j < prev.length && prev[j] === "z") {
        j++;
      }
      if (j < prev.length) {
        const charAtJ = prev[j];
        const idxJ = BASE_DIGITS.indexOf(charAtJ);
        if (idxJ < BASE_DIGITS.length - 1) {
          const midJ = Math.floor((idxJ + BASE_DIGITS.length) / 2);
          const candidate = prev.slice(0, j) + BASE_DIGITS[midJ];
          if (candidate > prev && candidate < next) {
            return candidate;
          }
        }
      }

      return prev + MID_CHAR;
    }
  }

  return MID_CHAR;
}

/**
 * Sortuje tablicę obiektów z polem `position`
 */
export function sortByPosition<T extends { position: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.position.localeCompare(b.position));
}
