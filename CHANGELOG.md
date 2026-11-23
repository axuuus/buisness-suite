# Changelog

Wszystkie istotne zmiany w projekcie będą dokumentowane w tym pliku.
Format bazuje na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
