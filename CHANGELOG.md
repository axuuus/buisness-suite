# Changelog

Wszystkie istotne zmiany w projekcie będą dokumentowane w tym pliku.
Format bazuje na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.2.0] - Faza 1: Konta, workspace, shell - 2026-11-23

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
