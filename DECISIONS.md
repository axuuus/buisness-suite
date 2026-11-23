# Architecture Decision Records (ADR) - DECISIONS.md

Ten plik gromadzi kluczowe decyzje architektoniczne i technologiczne podjęte podczas budowy platformy Velodrome.

---

## 002 - Architektura wielotenantowa, role RBAC i implementacja Shella
- **Data:** 2026-11-23
- **Status:** Zaakceptowano
- **Kontekst:** Wdrożenie Fazy 1 (Konta, workspace, shell) według specyfikacji `PLAN-platforma.md`.
- **Decyzja:**
  1. **Multi-tenancy:** Każda jednostka biznesowa powiązana z `workspace_id`. W SQL zaimplementowano funkcje bezpieczeństwa `is_member` oraz `has_role` ze statusem `active`.
  2. **Role i uprawnienia (RBAC):** Wprowadzono 5 ról: `owner`, `admin`, `manager`, `member`, `viewer`. Zwykły członek (`member`) i obserwator (`viewer`) nie mają dostępu do stawek godzinowych, kosztów i budżetów (`rates_budgets_costs:view = false`).
  3. **Shell i Banner z referencji:** Zbudowano komponent `HeroBanner` z gradientem Liquid Glass, animacją pionowych pasów (`drift 40s`), adaptacyjnymi zakładkami kontekstowymi i responsywnym zachowaniem kontrolek (na ekranach <=1040px kontrolki zawijają się nad zakładki).
  4. **Pasek boczny:** Szklany pasek zwijany na pulpicie (do 4.5rem), a na urządzeniach mobilnych (<=900px) zamieniający się w szufladę (drawer) wysuwaną z banera.
  5. **Paleta poleceń:** Dostępna globalnie pod skrótem `Ctrl+K`/`Cmd+K`.
  6. **Weryfikacja responsywności:** Testy E2E rozszerzone o 5 standardowych szerokości widoku (360px, 768px, 1024px, 1440px, 2560px).

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
