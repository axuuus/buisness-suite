# Changelog

Wszystkie istotne zmiany w projekcie będą dokumentowane w tym pliku.
Format bazuje na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.3.0] - Faza 2: Zadania i widok Lista - 2026-11-24

### Dodano
- Migracja bazy danych `supabase/migrations/20261124000002_phase2_tasks_lists.sql`:
  - Tabele: `spaces`, `folders`, `lists`, `statuses`, `tasks`, `task_assignees`, `checklists`, `checklist_items`, `tags`, `task_tags`, `saved_views`.
  - Indeksy wydajnościowe na `(workspace_id, list_id, position)`, `(workspace_id, due_date)`, `(parent_id)`.
  - Reguły Row Level Security (RLS) weryfikujące `is_member(workspace_id)` oraz uprawnienia ról RBAC.
- Moduł `src/lib/fractional-indexing.ts`:
  - Algorytm indeksowania ułamkowego w alfabecie base-36 (`0-9a-z`), umożliwiający stabilne wstawianie elementów pomiędzy dowolnymi dwoma węzłami bez reindeksowania bazy.
  - Testy jednostkowe weryfikujące wielokrotne wstawienia bez kolizji.
- Kontekst zadań `src/context/task-context.tsx`:
  - Zarządzanie stanem hierarchii ClickUp (Spaces -> Folders -> Lists -> Tasks).
  - Operacje CRUD na zadaniach, podzadaniach (do 3 poziomów), checklistach z postępem, tagach i przypisanych osobach.
  - Persystencja w `localStorage` z kluczem workspace.
  - Wbudowany benchmark / stress test generujący 5000 realistycznych zadań.
- Komponenty widoku zadań:
  - `TaskListView`: wirtualizowany widok listy z kalkulacją okna scrolla (overscan), zwijanymi grupami (status, priorytet, przypisany), szybkim tworzeniem zadania inline (Enter), sortowaniem i filtrowaniem.
  - `TaskRow`: lekki wiersz zadania bez powtarzanego filtru `backdrop-filter` (gwarantujący 60 fps na długich listach), ze zmianą statusu jednym kliknięciem, wskaźnikami podzadań/checklist i flagami priorytetów.
  - `TaskDrawer`: szuflada szczegółów zadania w stylu Liquid Glass wysuwana z prawej krawędzi (pełnoekranowa na urządzeniach mobilnych <640px) z pełną edycją pól, terminem, estymatą, tagami i checklistami.
  - Pasek zapisanych widoków (Saved Views) z możliwością zapisania bieżących filtrów.
- Testy:
  - 24 testy jednostkowe Vitest (`tasks.test.ts`, `tasks-performance.test.ts`, `fractional-indexing.test.ts`).
  - Stress test wydajności: wygenerowanie, posortowanie, przefiltrowanie i zwirtualizowanie 5000 zadań w 32 ms (<250 ms cel DoD).
  - 60 testów E2E Playwright (`e2e/tasks.spec.ts`) obejmujących 5 rozdzielczości (360px, 768px, 1024px, 1440px, 2560px).

## [0.2.0] - Faza 1: Konta, workspace, shell - 2026-11-23

### Poprawiono & Dopracowano (UI Polish)
- Pasek boczny (`Sidebar`): rozciągnięty na pełną wysokość widoku (`100% / h-full`) bez odcięć i zaokrągleń u dołu ekranu.
- Popovery i menu rozwijane: dodano klasy `.pop`, `.mi`, `.pt`, `.nt` zapewniające mrożone szkło Liquid Glass z rozmyciem `blur(28px)`, cieniem i eleganckim tłem `var(--pop)`.
- Zastąpiono systemowe elementy `<select>` przeglądarki spójnymi komponentami Liquid Glass z obsługą zamykania poza obszarem i wskaźnikami zaznaczenia.
- Stylowanie selektorów sezonu, platformy oraz powiadomień w `HeroBanner`.

### Dodano
- Migracja bazy danych `supabase/migrations/20261123000001_phase1_auth_workspaces.sql`:
  - Tabele: `profiles`, `workspaces`, `memberships`, `invitations`.
  - Funkcje RLS: `is_member(ws_id)`, `has_role(ws_id, allowed_roles)`, `get_user_role(ws_id)`.
  - Ścisłe reguły Row Level Security dla wielotenantowości i ról.
- Moduł uprawnień `src/lib/permissions.ts` z macierzą uprawnień dla 5 ról (Owner, Admin, Manager, Member, Viewer) i regułą izolacji stawek finansowych.
- Kontekst i zarządzanie stanem `src/context/workspace-context.tsx` (przełączanie przestrzeni roboczych, motywy, animacje, filtry).
- Shell Dashboardu z referencji:
  - `HeroBanner` z animowanymi pasami Liquid Glass, powitaniem zależnym od pory dnia, pigułkami KPI i selektorami.
  - Pasek boczny `Sidebar` z drzewem ClickUp (Spaces -> Folders -> Lists), szybkim dodawaniem zadania, przełącznikiem workspace i szufladą mobilną.
  - Paleta poleceń `CommandPalette` aktywowana skrótem `Ctrl+K` / `Cmd+K` lub przyciskiem w wyszukiwarce.
  - 6 zakładek widoków: `Overview`, `Analytics`, `Customers`, `Billing`, `Reports`, `Settings`.
  - Kafelki KPI z wykresami liniowymi, słupkami i tabelą zamówień/produktów z sortowaniem i eksportem CSV.
- Testy jednostkowe:
  - `src/lib/permissions.test.ts` (weryfikacja uprawnień i restrykcji finansowych).
  - `src/lib/workspace.test.ts` (izolacja tenantów, brak widoczności danych między workspace'ami).
- Testy E2E (`e2e/shell.spec.ts`) obejmujące 5 viewportów (360px, 768px, 1024px, 1440px, 2560px).

## [0.1.0] - Faza 0: Fundament - 2026-11-23

### Dodano
- Nadrzędna specyfikacja `PLAN-platforma.md` w katalogu głównym repozytorium.
- Działający prototyp HTML w `reference/velodrome-dashboard.html`.
- Repozytorium Git i plik `.gitignore`.
- Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- Konfiguracja tokenów systemowych Liquid Glass w `src/app/globals.css` (`--baby`, `--deep`, `--rose`, `--silver`, `--char`, `--soft` oraz `.glass`, `.hg`, `.stripes`).
- Tryb ciemny i jasny sterowany atrybutem `data-theme` oraz `prefers-color-scheme`.
- Strona `/design` prezentująca komponenty z sekcji 4.5 we wszystkich stanach (default, hover, focus, active, disabled, loading, error, empty).
- Komponenty bazowe: `Button`, `Card`, `Badge` (w tym reguły progów budżetu z sekcji 4.7), `Progress`, `Switch`, `SegmentedControl`, `Modal`.
- Moduł `src/lib/money.ts` operujący na liczbach całkowitych (najmniejszych jednostkach, np. groszach) z testami jednostkowymi Vitest.
- Pakiet i18n (`src/lib/i18n/`) ze słownikami PL i EN.
- Plik marki `src/config/brand.ts` z flagą `BILLING_ENABLED=false`.
- Testy E2E Playwright (`e2e/design.spec.ts`) w 3 widokach: 360px (mobile), 1024px (tablet/laptop), 1440px (desktop).
- Konfiguracja CI (`.github/workflows/ci.yml`) obejmująca typecheck, lint, testy jednostkowe i build.
- Klient Supabase (`src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`), `.env.example` oraz wstępna migracja SQL.
