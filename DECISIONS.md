# Architecture Decision Records (ADR) - DECISIONS.md

Ten plik gromadzi kluczowe decyzje architektoniczne i technologiczne podjęte podczas budowy platformy Velodrome.

---

## 004 - Model hierarchii zadań ClickUp, Fractional Indexing oraz wirtualizacja widoku listy
- **Data:** 2026-11-24
- **Status:** Zaakceptowano
- **Kontekst:** Wdrożenie Fazy 2 (Zadania i widok Lista) według specyfikacji `PLAN-platforma.md`. Wymóg płynnego przewijania 5000+ zadań oraz bezkonfliktowego przeciągania kolejności bez blokad i reindeksacji tysięcy wierszy w bazie.
- **Decyzja:**
  1. **Hierarchia ClickUp:** Przestrzenie robocze (`spaces`) zawierają opcjonalne foldery (`folders`) i listy (`lists`). Listy agregują zadania (`tasks`), które mogą posiadać statusy, priorytety (1–4), tagi, przypisania, podzadania (do 3 poziomów) oraz checklisty z wyliczanym paskiem postępu.
  2. **Fractional Indexing:** Wdrożono algorytm pozycji ułamkowych w alfabecie base-36 (`0-9a-z`). Przestawianie kolejności lub wstawianie zadania pomiędzy dwa inne generuje ciąg leksykograficznie pośredni (`generatePositionBetween`), co eliminuje konieczność aktualizowania pozycji pozostałych zadań.
  3. **Wirtualizacja okna scrolla:** Zgodnie z sekcją 4.6 (unikanie wielokrotnych warstw `backdrop-filter` na długich listach), wiersze `TaskRow` renderowane są z półprzezroczystym tłem bez filtru `backdrop-blur`. Dla grup powyżej 25 zadań stosowana jest wirtualizacja bazująca na pozycji scrolla i stałej wysokości wiersza (44 px) z buforem overscan, co redukuje liczbę węzłów DOM z 5000 do poniżej 50 elementów.
  4. **Panel zadania (Drawer):** Zgodnie ze specyfikacją szuflada wysuwa się z prawej krawędzi (`.pop` z `blur(28px)`), a na ekranach mobilnych (<640 px) wypełnia 100% ekranu.
  5. **Akceptacja wydajnościowa:** Test jednostkowy symulujący 5000 zadań wykonuje generowanie, sortowanie i wirtualizację w 32 ms (znacznie poniżej limitu 250 ms).

---

## 003 - Architektura komponentów nakładkowych (Popovers) i spójność kontrolek formularzy
- **Data:** 2026-11-23
- **Status:** Zaakceptowano
- **Kontekst:** Domyślne kontrolki systemowe przeglądarki (`<select>`, menu systemowe) naruszały estetykę Soft Pink Liquid Glass i renderowały się w stylach platformowych (np. niebieskie zaznaczenia Windows/macOS, brak rozmycia). Popovery na tle banera z animacją traciły czytelność bez dedykowanej warstwy szkła.
- **Decyzja:**
  1. Wszystkie selektory i filtry są implementowane jako customowe kontrolki Liquid Glass (`.pop`, `.mi`) z `backdrop-filter: blur(28px)`, wewnętrznym podświetleniem (`inset 0 1px 1px var(--hi)`) i kolorem tła `var(--pop)`.
  2. Pasek boczny (`Sidebar`) przyjmuje konstrukcję kolumny na pełną wysokość strony (`h-full items-stretch`), stając się integralnym elementem strukturalnym ramki zamiast pływającej karty.
  3. Wszystkie menu rozwijane posiadają wskaźnik wybranej opcji (ptaszek/kolor akcentu) oraz obsługę kliknięcia poza obszar (`mousedown` listener).

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
