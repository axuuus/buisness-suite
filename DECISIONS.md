# Architecture Decision Records (ADR) - DECISIONS.md

Ten plik gromadzi kluczowe decyzje architektoniczne i technologiczne podjęte podczas budowy platformy Velodrome.

---

## 001 - Inicjalizacja projektu i wybór stacku Fazy 0
- **Data:** 2026-11-23
- **Status:** Zaakceptowano
- **Kontekst:** Wdrożenie Fazy 0 według nadrzędnej specyfikacji `PLAN-platforma.md`.
- **Decyzja:**
  1. Next.js 14 z App Router i TypeScript jako fundament Full-stack.
  2. Tailwind CSS z dedykowanymi tokenami CSS zdefiniowanymi w sekcji 4 specyfikacji (`globals.css`).
  3. Vitest do testów jednostkowych i integracyjnych, Playwright do testów E2E i responsywności.
  4. i18n z domyślnym językiem polskim (PL) i wsparciem angielskim (EN).
  5. Flaga `BILLING_ENABLED=false` w Etapie A (wewnętrzne narzędzie multi-tenant).
  6. Wszelkie wartości pieniężne przechowywane i przetwarzane jako liczby całkowite (`minor units` - grosze/cents) w `src/lib/money.ts`.
