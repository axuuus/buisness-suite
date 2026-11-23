# PLAN BUDOWY: platforma do zarządzania pracą i budżetem (w stylu ClickUp + finanse)

> Nazwa robocza: **Velodrome** (trzymaj ją w jednym pliku `config/brand.ts`, żeby łatwo zmienić).
> Dokument jest dla agenta kodującego (Antigravity). Czytaj go w całości przed pierwszą linijką kodu.

---

## 0. Prompt startowy (wklej do Antigravity)

```
Przeczytaj w całości plik PLAN-platforma.md w katalogu głównym repo. To jest nadrzędna specyfikacja.
Pracuj fazami (sekcja 11), jedna faza naraz. Na końcu każdej fazy:
1) uruchom aplikację i testy, 2) zrób krótkie podsumowanie co działa i jak to sprawdzić,
3) zaktualizuj CHANGELOG.md i DECISIONS.md, 4) ZATRZYMAJ SIĘ i poczekaj na moje "dalej".
Nie dodawaj funkcji spoza planu. Nie zmieniaj stacku bez pytania.
Kiedy potrzebuję coś zrobić ręcznie (konto Supabase, klucze, terminal), podawaj kroki JEDEN PO JEDNYM
i po każdym czekaj na moje "TAK" (np. "Gotowe? Wpisz TAK").
Zacznij od Fazy 0.
```

---

## 1. Cel i zakres

**Produkt:** jedna platforma do planowania pracy (zadania, widoki, zespół) i pilnowania pieniędzy (budżet, czas, faktury, prognozy).

**Etapy życia produktu:**
1. **Etap A: narzędzie wewnętrzne** dla własnego zespołu (pełne funkcje, bez płatności).
2. **Etap B: SaaS na subskrypcję** (plany, limity, płatności Stripe, strona sprzedażowa).

**Najważniejsza zasada architektury:** aplikacja jest **wielodzierżawna (multi-tenant) od pierwszego dnia**. Każda firma to osobny *workspace*, a każda tabela ma `workspace_id` i zabezpieczenie na poziomie bazy (RLS). Dzięki temu przejście z Etapu A do B to włączenie billingu, a nie przepisywanie aplikacji. Billing ma być za flagą `BILLING_ENABLED=false` (w Etapie A wszystko odblokowane).

**Poza zakresem pierwszej wersji:** aplikacje natywne mobilne, własny edytor dokumentów w stylu Docs, tablice białe, automatyzacje no-code, integracje księgowe. Interfejs ma być w pełni responsywny (telefon działa jako przeglądarka/PWA).

---

## 2. Zasady nadrzędne dla agenta

1. **Najpierw fundament, potem funkcje.** Nie przeskakuj faz.
2. **Pieniądze zawsze jako liczby całkowite** (najmniejsza jednostka, np. grosze) plus kod waluty. Nigdy `float`.
3. **Wszystkie teksty UI przez i18n** (domyślnie PL, drugi język EN). Zero tekstów na sztywno w komponentach.
4. **Wygląd z sekcji 4 jest obowiązkowy.** Żadnych domyślnych stylów bibliotek, wszystko przez tokeny.
5. **Nic nie może na siebie zachodzić** na żadnej szerokości ekranu (lista kontrolna w sekcji 12).
6. **Bezpieczeństwo:** RLS na każdej tabeli, walidacja `zod` na każdym wejściu serwerowym, żadnych sekretów w kodzie.
7. **Każda funkcja ma kryteria akceptacji** (sekcja 11). Funkcja jest skończona, gdy je spełnia i ma test.
8. **Małe commity**, opisowe komunikaty, nowa gałąź na fazę.
9. Gdy czegoś brakuje w specyfikacji: wybierz najprostsze rozwiązanie, zapisz decyzję w `DECISIONS.md` i idź dalej. Pytaj tylko przy zmianie stacku, modelu danych lub zakresu.

---

## 3. Stack technologiczny (rekomendacja, dobrana pod osobę początkującą po stronie serwera)

Cel: jak najmniej własnej infrastruktury, wszystko zarządzane.

| Warstwa | Wybór | Uzasadnienie |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | jeden projekt na front i backend, hosting na Vercel |
| Styl | **Tailwind CSS + własne tokeny CSS** (zmienne z sekcji 4) | pełna kontrola nad wyglądem liquid glass |
| Komponenty bazowe | **Radix UI** (bez gotowych stylów) lub shadcn/ui przestylowane tokenami | dostępność (a11y) za darmo |
| Baza, logowanie, pliki, realtime | **Supabase** (Postgres + Auth + Storage + Realtime) | RLS, bez własnego serwera |
| Dostęp do danych | **Supabase JS + typy generowane z bazy**; migracje SQL w repo | proste i bezpieczne |
| Stan serwera | **TanStack Query** | cache, optymistyczne aktualizacje |
| Formularze | **react-hook-form + zod** | jedna walidacja front i back |
| Tabele | **TanStack Table + TanStack Virtual** | duże listy bez lagów |
| Drag & drop | **dnd-kit** | Kanban, kalendarz, Gantt |
| Kolejność elementów | **fractional-indexing** (pole `position` jako tekst) | przenoszenie bez przeliczania całej listy |
| Wykresy | **Recharts** ostylowane tokenami | KPI, burn-down, prognozy |
| Daty | **date-fns** (+ strefy czasowe) | |
| Edytor tekstu (opisy, komentarze) | **Tiptap** (JSON w bazie) | wzmianki @, listy, linki |
| PDF faktur | **@react-pdf/renderer** (po stronie serwera) | |
| Płatności SaaS | **Stripe** (Checkout, Billing, Customer Portal, webhooki) | Etap B |
| E-maile | **Resend** | zaproszenia, powiadomienia, faktury |
| Testy | **Vitest** (jednostkowe), **Playwright** (E2E + zrzuty ekranu) | |
| Monitoring | **Sentry** | |
| Hosting | **Vercel** + **Supabase** | |

Wzór kodu: `src/` z podziałem na funkcje (`features/tasks`, `features/budget`, `features/time`, `features/invoices`…), wspólne UI w `components/ui`, logika pieniędzy w `lib/money`.

---

## 4. System wyglądu (Velodrome Soft Pink Glass)

Wzór wizualny: dashboard z bannerem z rozmytymi pionowymi paskami, białe szklane karty, duże liczby, tooltipy-bąbelki, tabela produktów. Wersja referencyjna (HTML, działający prototyp): `reference/velodrome-dashboard.html`. **Kod referencyjny ma pierwszeństwo przed opisem.**

### 4.1 Paleta (tokeny)

| Token | Hex | Użycie |
|---|---|---|
| `--baby` | `#F4C2D0` | poświaty, najjaśniejszy akcent, końcówki gradientów słupków |
| `--deep` | `#8C3150` | tło bannera, ciemny akcent, gradienty przycisków |
| `--rose` | `#AF4769` | główny akcent (linki, aktywne elementy, wykresy, przełączniki) |
| `--slate` | `#767078` | tekst drugorzędny (w jasnym motywie używaj `#6b656d` dla kontrastu) |
| `--silver` | `#B5B1B5` | linie referencyjne, wyszarzone dane |
| `--soft` | `#F3F3F4` | tło strony (jasny) |
| `--char` | `#1C1C1E` | tekst główny, tło ciemnego motywu, przyciski ciemne |
| biały | `#FFFFFF` | szkło, tekst na bannerze |

Nie wolno dodawać nowych kolorów akcentowych. Statusy: zielenie/pomarańcze/czerwienie **tylko** dla alertów budżetu (patrz 4.7) i muszą być przytłumione, spójne z paletą.

### 4.2 Tokeny i szkło (wklej do `globals.css`)

```css
:root{
  --baby:#F4C2D0; --deep:#8C3150; --rose:#AF4769; --silver:#B5B1B5; --char:#1C1C1E;
  --px:clamp(1rem,2.4vw,2.5rem);
  --bg:#F3F3F4; --text:#1C1C1E; --muted:#6b656d; --line:rgba(28,28,30,.09); --chip:rgba(28,28,30,.06);
  --g1:rgba(255,255,255,.74); --g2:rgba(255,255,255,.4); --edge:rgba(255,255,255,.75); --hi:rgba(255,255,255,.95);
  --glow:rgba(244,194,208,.95); --glow2:rgba(175,71,105,.3); --shell:rgba(255,255,255,.4); --pop:rgba(255,255,255,.88);
  box-sizing:border-box; padding-top:env(safe-area-inset-top,0px); padding-bottom:env(safe-area-inset-bottom,0px);
}
/* ciemny motyw: ten sam zestaw pod [data-theme="dark"] ORAZ pod prefers-color-scheme (gdy brak data-theme="light") */
:root[data-theme="dark"]{
  --bg:#1C1C1E; --text:#fff; --muted:#B5B1B5; --line:rgba(255,255,255,.11); --chip:rgba(255,255,255,.09);
  --g1:rgba(255,255,255,.14); --g2:rgba(255,255,255,.05); --edge:rgba(255,255,255,.2); --hi:rgba(255,255,255,.3);
  --glow:rgba(140,49,80,.8); --glow2:rgba(175,71,105,.35); --shell:rgba(255,255,255,.04); --pop:rgba(40,32,36,.9);
}
html{font-size:clamp(15px,.5vw + 8.8px,22px)}  /* całe UI w rem: skaluje się od telefonu do 4K */

.glass{
  position:relative;
  background:linear-gradient(135deg,var(--g1),var(--g2));
  backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%);
  border:1px solid var(--edge);
  box-shadow:inset 0 1.5px 1px var(--hi), inset 0 -.6rem 1.5rem rgba(244,194,208,.22), 0 1.1rem 2.5rem -1.1rem rgba(140,49,80,.45);
}
.glass::before{ /* połysk */
  content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none; opacity:.7;
  background:radial-gradient(120% 70% at 15% -10%,rgba(255,255,255,.55),transparent 55%),
             linear-gradient(115deg,transparent 40%,rgba(255,255,255,.18) 50%,transparent 60%);
}
.glass>*{position:relative}
/* szkło na ciemnym banerze (przyciski, pigułki, zakładki) */
.hg{
  background:linear-gradient(135deg,rgba(255,255,255,.26),rgba(255,255,255,.08)); color:#fff;
  backdrop-filter:blur(18px) saturate(190%); border:1px solid rgba(255,255,255,.35);
  box-shadow:inset 0 1.5px 1px rgba(255,255,255,.55), inset 0 -.4rem .9rem rgba(140,49,80,.25), 0 .5rem 1.2rem -.6rem rgba(28,28,30,.5);
}
@supports not (backdrop-filter:blur(1px)){ .glass{background:var(--pop)} }
```

Tło strony: `--bg` + dwie duże różowe poświaty (`radial-gradient` z `--glow` i `--glow2`), żeby szkło miało co załamywać.

### 4.3 Typografia

- Krój: **Inter Tight** (400, 500, 600, kursywa 500). Fallback: system-ui.
- Rozmiary w `rem`. Nagłówek bannera `clamp(1.8rem,3.2vw,2.7rem)`, wagi 500/600, `letter-spacing:-.02em`. Tekst drobny `.62–.8rem`. Duże liczby `clamp(1.7rem,9cqi,2.9rem)` (jednostka `cqi` = szerokość karty).
- Liczby w kartach i tabelach: cyfry tabelaryczne (`font-variant-numeric:tabular-nums`).

### 4.4 Układ aplikacji (shell)

- **Cały ekran.** `100%` wysokości; banner stały u góry, treść pod nim przewija się niezależnie. Na telefonie (≤700 px) lub niskim ekranie (≤620 px wysokości) przewija się cała strona.
- **Banner (hero):** gradient `#5a1d33 → --deep → --rose`, rozmyte pionowe paski (animacja `drift` 40 s, wyłączana w ustawieniach i przy `prefers-reduced-motion`), jasna poświata w środku, ciemny gradient z lewej pod tekstem. Zawiera: datę, powitanie z imieniem (zależne od pory dnia), pigułki-statystyki, ikony (ustawienia, pomoc, powiadomienia z kropką, awatar), **zakładki kontekstowe**, selektory (zakres czasu, filtr) i przycisk Search.
- **Pasek boczny (nowość względem makiety, konieczny dla hierarchii ClickUp):** szklany, zwijany, z drzewem Space → Folder → List, szybkim dodawaniem i przełącznikiem workspace. Na ≤900 px to szuflada otwierana z banera.
- **Zakładki w banerze** zależą od kontekstu:
  - Strona główna: Overview, My work, Inbox, Reports
  - Projekt/lista: Overview, List, Board, Calendar, Timeline, Budget, Settings
  - Finanse: Time, Expenses, Invoices, Clients
- Na stronach wewnętrznych baner przechodzi w **wersję kompaktową** (mniejsza wysokość, bez pigułek), a na stronie głównej jest pełny.
- Kontrolki na ≤1040 px: selektory i Search przechodzą **nad** zakładki, żeby zakładki zawsze stykały się z dolną krawędzią banera.

### 4.5 Komponenty (każdy ma stany: domyślny, hover, focus, aktywny, wyłączony, ładowanie, błąd, pusty)

| Komponent | Opis |
|---|---|
| Karta KPI | szkło, nagłówek z ikoną w kółku i średnią po prawej, duża liczba + chip procentowy + ikona-iskra, podpis, wizualizacja, statystyki przy dolnej krawędzi (`margin-top:auto`) |
| Pasek postępu | gradient `--deep → --rose`, segment kreskowany dla prognozy, podziałka pod spodem |
| Tooltip-bąbelek | szklana pigułka z wartością i różowym chipem. **Ma własny zarezerwowany wiersz** nad/pod wykresem, nigdy nie nakłada się na tekst |
| Wykres liniowy | szara linia (poprzedni okres) + różowy gradient (bieżący), kropka z białą obwódką, przerywana linia pionowa, `vector-effect:non-scaling-stroke`, osie jako HTML (nie tekst w SVG) |
| Słupki | pionowe, zaokrąglone, wyróżnione słupki w gradiencie `--baby → --rose → --deep`, reszta `--chip` |
| Tabela | nagłówek w `--chip` z zaokrągleniem, wiersze z cienką linią, sortowanie po kliknięciu nagłówka, wiersze **bez** backdrop-blur (wydajność). Pod 640 px zamienia się w listę kart (etykieta z lewej, wartość z prawej) |
| Pigułki statusu | `--rose` 16% tła (ok) lub `--baby` 50% (oczekuje); w ciemnym motywie jaśniejszy tekst |
| Przyciski | `btn` (neutralny), `btn dark` (gradient grafitowy), `btn rose` (gradient `--rose → --deep`), pigułka 99px, `:active` skala .97 |
| Menu/popover | szkło `--pop`, otwiera się nad przyciskiem gdy brakuje miejsca, zamyka się przy scrollu i Escape |
| Modal | szkło, `max-height:90dvh`, fokus trafia do pierwszego pola, Escape zamyka |
| Panel zadania | szuflada z prawej (na telefonie pełny ekran), szkło |
| Toast | ciemna pigułka na dole, znika po ~2 s, `role="status"` |
| Przełącznik / segment | `.sw` i `.seg` jak w prototypie |

### 4.6 Zasady skalowania i "nic na siebie nie zachodzi"

- Wszystko w `rem`/`clamp`, kontenery kart z `container-type:inline-size` i regułami `@container`.
- Siatka kart: 3 kolumny (≥1100 px), 2 kolumny z ostatnią kartą na pełną szerokość (700–1100 px), 1 kolumna (<700 px). Zawsze `minmax(0,1fr)`.
- Wszędzie `flex-wrap` tam, gdzie obok siebie stoi więcej niż 2 elementy. Długie teksty: `overflow-wrap:anywhere` lub przycinanie z `title`.
- Elementy absolutne (tooltipy) tylko w zarezerwowanych kontenerach o stałej wysokości.
- Maksymalnie kilka warstw `backdrop-filter` na ekranie naraz; w długich listach używaj półprzezroczystego tła **bez** blur.
- Safe-area (notch) uwzględniona w paddingach.

### 4.7 Kolory statusu budżetu (jedyny wyjątek od palety)

Zużycie budżetu: `<75%` → `--rose`; `75–99%` → przytłumiony bursztyn `#C98A2B`; `≥100%` → `--deep` z ikoną ostrzeżenia i napisem. Zawsze ikona/tekst obok koloru (dostępność).

### 4.8 Dostępność

Kontrast min. 4.5:1 dla tekstu, widoczny focus (`outline:2px solid var(--rose)`), pełna obsługa klawiatury (zakładki, menu, modal z pułapką fokusa, drag & drop z alternatywą przyciskami), `aria-*` na przełącznikach/zakładkach/sortowaniu, `prefers-reduced-motion`.

---

## 5. Model danych (Postgres / Supabase)

Konwencje: `id uuid` (PK), `workspace_id uuid` w każdej tabeli biznesowej, `created_at`, `updated_at`, `created_by`, kwoty jako `bigint` w najmniejszej jednostce + `currency char(3)`, miękkie usuwanie `deleted_at` dla zadań/projektów.

### 5.1 Tenant i użytkownicy
- `workspaces` (name, slug, default_currency, locale, timezone, logo)
- `profiles` (user_id → auth.users, full_name, avatar, locale)
- `memberships` (workspace_id, user_id, role: `owner|admin|manager|member|viewer`, status)
- `invitations` (workspace_id, email, role, token, expires_at, accepted_at)

### 5.2 Struktura pracy (hierarchia jak w ClickUp)
- `spaces` (name, color, icon, position)
- `folders` (space_id, name, position), opcjonalne
- `lists` (space_id, folder_id?, name, position, **project_id?**) lista może być powiązana z projektem budżetowym
- `statuses` (list_id lub space_id, name, color, category: `todo|active|done`, position)
- `tasks` (list_id, parent_id?, title, description jsonb, status_id, priority 1–4, start_date, due_date, estimate_minutes, position text, completed_at, recurring_rule?, custom jsonb)
- `task_assignees` (task_id, user_id)
- `task_dependencies` (task_id, depends_on_id, type: `FS|SS|FF|SF`, lag_days)
- `checklists`, `checklist_items`
- `tags`, `task_tags`
- `custom_fields` (scope, name, type: text|number|money|date|select|multi|person|checkbox, options jsonb), wartości w `tasks.custom`
- `comments` (task_id, author_id, body jsonb, parent_id?), `mentions`
- `attachments` (task_id, storage_path, name, size, mime)
- `activity_log` (entity_type, entity_id, actor_id, action, diff jsonb)
- `saved_views` (scope, owner_id, type, filters jsonb, sort jsonb, group_by, columns)
- `task_templates`

### 5.3 Finanse
- `clients` (name, tax_id, email, address jsonb, default_currency, payment_terms_days)
- `projects` (client_id?, name, status, start_date, end_date, billing_type: `fixed|hourly|retainer|internal`, color)
- `member_rates` (workspace_id, user_id, project_id?, **cost_rate_minor**, **bill_rate_minor**, currency, valid_from, valid_to). Dwie stawki: koszt dla firmy i stawka dla klienta. Wybór stawki: najbardziej szczegółowa obowiązująca w dniu wpisu (projekt > domyślna).
- `time_entries` (task_id?, project_id, user_id, started_at, ended_at, duration_seconds, billable bool, note, **cost_rate_snapshot**, **bill_rate_snapshot**, currency, status: `draft|submitted|approved|invoiced`)
  Stawki zapisujemy jako migawkę w momencie wpisu, żeby późniejsza zmiana stawki nie zmieniała historii.
- `budgets` (project_id lub list_id, name, total_minor, currency, type: `cost|revenue`, period_start, period_end, alert_thresholds int[] domyślnie {50,75,90,100}, include_labor bool)
- `budget_categories` (budget_id, name, planned_minor): np. Praca, Oprogramowanie, Podwykonawcy, Marketing, Inne
- `expenses` (project_id, budget_category_id?, amount_minor, currency, date, vendor, description, billable bool, receipt_path, status: `draft|approved|reimbursed`, created_by)
- `invoices` (client_id, project_id?, number, issue_date, due_date, currency, status: `draft|sent|partially_paid|paid|overdue|void`, subtotal_minor, tax_minor, total_minor, notes, pdf_path)
- `invoice_items` (invoice_id, description, quantity numeric, unit_price_minor, tax_rate_bp, source_type: `time|expense|manual`, source_id?)
- `payments` (invoice_id, amount_minor, paid_at, method, reference)
- `tax_rates` (workspace_id, name, rate_bp) np. 2300 = 23%
- `invoice_number_sequences` (workspace_id, year, last_number)

### 5.4 System
- `notifications` (user_id, type, payload jsonb, read_at)
- `notification_prefs`
- `budget_alert_events` (budget_id, threshold, triggered_at, kind: `actual|forecast`), żeby nie wysyłać tego samego alertu dwa razy
- `api_keys`, `webhooks` (Etap B+)
- **SaaS:** `plans`, `subscriptions` (workspace_id, stripe_customer_id, stripe_subscription_id, plan_id, status, seats, current_period_end, trial_end), `entitlements` (plan_id, key, value), `usage_counters`

### 5.5 RLS (wzorzec)
- Funkcja `is_member(ws uuid)` i `has_role(ws uuid, roles text[])` w SQL.
- Każda tabela: `SELECT` gdy `is_member(workspace_id)`; zapis zależnie od roli.
- **Tabele finansowe** (`member_rates`, `budgets`, `expenses`, `invoices`, `payments`, `time_entries` z stawkami) czytelne tylko dla ról z uprawnieniem finansowym (patrz 6). Widok `time_entries_public` bez stawek dla zwykłych członków.
- Testy RLS: dla każdej tabeli test "użytkownik z innego workspace nie widzi nic".

---

## 6. Role i uprawnienia

| Uprawnienie | Owner | Admin | Manager | Member | Viewer |
|---|---|---|---|---|---|
| Zarządzanie workspace, billing | ✓ | ✓ (bez usuwania workspace) | | | |
| Zaproszenia, role | ✓ | ✓ | | | |
| Tworzenie spaces/projektów | ✓ | ✓ | ✓ | | |
| Zadania: tworzenie/edycja | ✓ | ✓ | ✓ | ✓ | |
| Zadania: podgląd | ✓ | ✓ | ✓ | ✓ | ✓ |
| Własny czas: wpisy | ✓ | ✓ | ✓ | ✓ | |
| Czas innych: podgląd, zatwierdzanie | ✓ | ✓ | ✓ (swoje projekty) | | |
| **Stawki, budżety, koszty** | ✓ | ✓ | ✓ (swoje projekty) | | |
| **Faktury, klienci, płatności** | ✓ | ✓ | | | |
| Raporty finansowe | ✓ | ✓ | ✓ (swoje projekty) | | |

Zasada: zwykły członek **nigdy** nie widzi stawek, kosztów i przychodów (także w API i eksporcie).

---

## 7. Moduły i funkcje (specyfikacja)

### 7.1 Konto i workspace
- Logowanie: e-mail + hasło, magic link, Google. Reset hasła.
- Onboarding: utwórz workspace (nazwa, waluta, strefa czasowa, język) → zaproś zespół → utwórz pierwszy projekt (z szablonem) → przykładowe dane opcjonalnie.
- Przełącznik workspace (jedna osoba może być w wielu).
- Zaproszenia przez e-mail z linkiem (ważność 7 dni), zmiana roli, usunięcie członka.

### 7.2 Zadania
- Szybkie dodawanie (Enter), pełny panel zadania: tytuł, opis (Tiptap), status, priorytet, przypisani (wielu), daty start/termin, estymata, tagi, podzadania (do 3 poziomów), checklisty, załączniki, komentarze z @wzmiankami, historia aktywności, pola niestandardowe, zależności, powtarzanie.
- Operacje zbiorcze (zaznacz wiele → zmień status/przypisanego/termin/przenieś/usuń).
- Filtry, sortowanie, grupowanie (status, przypisany, priorytet, termin, tag), **zapisane widoki** (prywatne/współdzielone).
- Wyszukiwanie globalne i **paleta poleceń** (`Ctrl/Cmd+K`): zadania, listy, osoby, akcje.
- Skróty klawiszowe (`C` nowe zadanie, `/` szukaj, `?` lista skrótów).
- Szablony zadań i list. Duplikowanie. Archiwizacja zamiast twardego usuwania (kosz 30 dni).

### 7.3 Widoki (ta sama logika filtrów dla wszystkich)
1. **Lista:** grupy zwijane, edycja w miejscu, przeciąganie kolejności (fractional index), kolumny konfigurowalne, wirtualizacja (5000+ zadań płynnie).
2. **Kanban:** kolumny = statusy, przeciąganie kart, limity WIP, zwijanie kolumn, opcjonalne swimlane po przypisanym.
3. **Kalendarz:** miesiąc/tydzień, zadania z terminem, przeciągnięcie zmienia termin, boczny panel "bez daty", tworzenie przez kliknięcie dnia.
4. **Oś czasu / Gantt:** skala dzień/tydzień/miesiąc, belki z postępem, przeciąganie i zmiana długości, **strzałki zależności** z walidacją cykli, linia "dziś", grupowanie po liście/osobie, skrót do zadania. (Ścieżka krytyczna i baseline: później.)
5. **Widok osób (workload):** obłożenie godzinowe na tydzień względem estymat i dostępności (Faza 8).

Wszystkie widoki: realtime (zmiany kolegów widać od razu), aktualizacje optymistyczne, stany pustych list z wezwaniem do działania.

### 7.4 Czas pracy
- Stoper (jeden aktywny na użytkownika, widoczny w banerze na każdej stronie), ręczne wpisy, edycja, usuwanie.
- **Karta czasu** tygodniowa (wiersze = zadania/projekty, kolumny = dni), szybkie wpisywanie.
- Flaga *billable*. Przy wpisie system zapisuje migawkę stawek (koszt i sprzedaż).
- Zatwierdzanie przez managera (statusy `draft → submitted → approved → invoiced`).
- Przypomnienia o brakującym czasie (e-mail/in-app, konfigurowalne).

### 7.5 Budżet i koszty (serce różnicy względem ClickUp)

**Definicje (muszą być identyczne w całej aplikacji):**
- `koszt pracy` = Σ (godziny wpisu × `cost_rate_snapshot`) po zatwierdzonych/wysłanych wpisach
- `koszty rzeczywiste` = koszt pracy + zatwierdzone wydatki
- `zużycie budżetu %` = koszty rzeczywiste / `budgets.total_minor`
- `burn rate` = koszty rzeczywiste z ostatnich N dni / N (N domyślnie 14, konfigurowalne)
- `prognoza kosztu końcowego (EAC)`:
  - **metoda A (gdy są estymaty):** koszty rzeczywiste + pozostałe godziny estymat × średnia stawka kosztu + zaplanowane przyszłe wydatki
  - **metoda B (gdy brak estymat):** koszty rzeczywiste / (upłynięta część okresu projektu)
  - aplikacja pokazuje obie, a jako główną używa A, jeśli estymaty pokrywają ≥60% otwartych zadań
- `odchylenie` = budżet − prognoza kosztu końcowego
- `marża` = przychód zafakturowany − koszty rzeczywiste; `marża %` = marża / przychód
- `przychód niezafakturowany (WIP)` = zatwierdzone godziny billable × `bill_rate_snapshot` nieprzypisane do faktury

**Ekrany:**
1. **Budget (zakładka projektu):** karty KPI (Budżet, Wydano, Pozostało, Prognoza), pasek postępu z odcinkiem kreskowanym prognozy, wykres burn-down/burn-up (plan vs rzeczywistość vs prognoza), podział po kategoriach, podział koszt pracy vs wydatki, top 5 osób/zadań wg kosztu, tabela wydatków.
2. **Wydatki:** dodawanie (kwota, kategoria, data, dostawca, paragon jako załącznik), zatwierdzanie, filtry, eksport.
3. **Budżety zbiorcze (strona główna finansów):** wszystkie projekty w jednej tabeli ze statusem (kolory z 4.7), sortowanie po zagrożeniu.
4. **Alerty:** progi (domyślnie 50/75/90/100%) i alert **prognozy** ("przy obecnym tempie przekroczysz budżet ok. DD.MM"). Powiadomienie in-app + e-mail do managera projektu i właściciela, bez duplikatów (`budget_alert_events`).
5. **Planowanie:** przy tworzeniu budżetu podpowiedź z estymat zadań × stawki.
6. Multi-waluta: każdy budżet w jednej walucie; przeliczenia po kursie ustawionym ręcznie w workspace (kursy automatyczne: później).

### 7.6 Faktury i przychody
- Klienci (dane firmy, NIP/VAT ID, adres, warunki płatności).
- Tworzenie faktury: ręcznie albo **z niezafakturowanych godzin billable i wydatków billable** (zaznacz pozycje → utworzy linie, oznaczy źródła jako `invoiced`).
- Numeracja automatyczna z formatem konfigurowalnym (np. `FV/2026/0001`), stawki VAT z `tax_rates`.
- Statusy: draft → sent → partially_paid → paid; `overdue` ustawiane codziennym zadaniem cron, gdy `due_date < dziś` i faktura nieopłacona.
- Generowanie **PDF** (logo, dane sprzedawcy i nabywcy, pozycje, podsumowanie VAT), wysyłka e-mailem przez Resend.
- Rejestrowanie płatności (częściowe też), saldo faktury.
- Przyszłość (poza MVP): ustalić wymagania lokalne dla e-faktur i zgodności księgowej przed wdrożeniem rynkowym. Nie zakładaj ich spełnienia bez weryfikacji.

### 7.7 Dashboardy i raporty
- **Strona główna** (jak makieta): KPI zależne od roli. Manager/Admin: Budżet łącznie, Marża, Przychód niezafakturowany, Przeterminowane faktury; Member: Moje zadania na dziś, Godziny w tym tygodniu, Zbliżające się terminy.
- Raporty: czas (osoba/projekt/klient), koszty vs budżet, rentowność projektów/klientów, przychody miesięcznie, przeterminowane faktury, obciążenie zespołu, prędkość (zadania ukończone/tydzień).
- Selektory zakresu (sezon/okres) i filtr w banerze działają na wszystkie wykresy.
- **Eksport CSV/PDF** (w prawdziwej aplikacji jako pobranie pliku).

### 7.8 Powiadomienia
In-app (dzwonek z kropką, skrzynka Inbox), e-mail (natychmiast dla przypisań/wzmianek, dzienne podsumowanie), preferencje per typ. Typy: przypisanie, wzmianka, komentarz, zmiana terminu, alert budżetu, faktura po terminie, zaproszenie.

### 7.9 Ustawienia
Workspace (nazwa, logo, waluta, strefa, język), członkowie i role, stawki, statusy, pola niestandardowe, kategorie budżetu, stawki VAT, numeracja faktur, motyw (auto/jasny/ciemny), kompaktowe tabele, wyłączenie animacji banera, powiadomienia, klucze API (później).

### 7.10 Integracje (po MVP)
Kalendarz Google (dwukierunkowo terminy), Slack (powiadomienia), GitHub (powiązanie zadań z PR), publiczne API + webhooki, import z CSV oraz z ClickUp.

---

## 8. Warstwa SaaS (Etap B)

Budowana **po** Fazie 8, ale model danych (5.4) i flaga `BILLING_ENABLED` istnieją od Fazy 0.

- **Plany (propozycja do zatwierdzenia):** Free (do 3 osób, 2 projekty, bez faktur), Pro (cena za osobę/miesiąc, pełne widoki i budżety), Business (role, zatwierdzanie czasu, eksporty, priorytetowe wsparcie). Ceny i limity ustala właściciel produktu. Trzymaj je w `plans` i `entitlements`, nie w kodzie.
- **Rozliczanie:** Stripe Billing z ceną za miejsce (seat); automatyczne dopasowanie liczby miejsc przy zapraszaniu/usuwaniu; 14-dniowy trial; Customer Portal do zmiany karty/planu/faktur; webhooki (`checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`) zapisujące stan do `subscriptions` (idempotentnie).
- **Egzekwowanie limitów:** jedna funkcja `can(workspace, feature)` używana w UI i na serwerze; ładne ekrany "Odblokuj w planie Pro" w stylu szkła, nigdy blokada bez wyjaśnienia.
- **Strona sprzedażowa** (landing, cennik, FAQ) w tym samym stylu; strony prawne (regulamin, polityka prywatności, umowa powierzenia danych), baner cookies.
- **RODO:** eksport danych workspace, usunięcie konta i danych, rejestr zgód, okres retencji kopii.
- **Panel administratora platformy** (tylko Ty): lista workspace'ów, plany, wykorzystanie, impersonacja z logiem audytu.
- **Wsparcie i onboarding:** widżet pomocy, checklista "pierwsze kroki", pusta stan z demo danymi.

---

## 9. Architektura i bezpieczeństwo

- **Trasy:** `/[locale]/(marketing)` publiczne; `/[locale]/app/[workspaceSlug]/...` aplikacja: `home`, `inbox`, `my-work`, `p/[projectId]/(overview|list|board|calendar|timeline|budget|settings)`, `time`, `expenses`, `invoices`, `clients`, `reports`, `settings`.
- **Logika po stronie serwera:** Server Actions / route handlers z walidacją `zod`; obliczenia finansowe (EAC, marża) jako funkcje czyste w `lib/finance` z testami jednostkowymi (to najważniejsze testy w całym projekcie).
- **Zadania cykliczne** (Vercel Cron lub Supabase pg_cron): oznaczanie faktur po terminie, sprawdzanie progów budżetu, dzienne podsumowania, przypomnienia o czasie, powtarzające się zadania.
- **Realtime:** Supabase Realtime na `tasks`, `comments`, `notifications` (subskrypcja per widok, nie per tabela globalnie).
- **Wydajność:** indeksy na `(workspace_id, list_id, position)`, `(workspace_id, due_date)`, `(project_id, started_at)`; paginacja kursorowa; wirtualizacja list; cel LCP < 2,5 s na stronie głównej.
- **Bezpieczeństwo:** RLS wszędzie, uprawnienia ról sprawdzane też w kodzie serwera, limity zapytań (rate limiting) na logowaniu i zaproszeniach, bezpieczne URL-e plików (podpisane, krótkoterminowe), nagłówki CSP, logi audytu dla operacji finansowych (kto, co, kiedy).
- **Zmienne środowiskowe** (`.env.example` obowiązkowy): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`, `BILLING_ENABLED`, `SENTRY_DSN`.
- **Kopie zapasowe:** codzienne kopie bazy (Supabase), test odtworzenia przed startem sprzedaży.

---

## 10. Dane demonstracyjne

Skrypt `seed` tworzy workspace "Demo Studio": 6 osób z różnymi rolami i stawkami, 3 klientów, 5 projektów (stały budżet, godzinowy, retainer, wewnętrzny), ~120 zadań w różnych statusach z zależnościami, wpisy czasu z ostatnich 8 tygodni, wydatki, 8 faktur w różnych statusach (w tym po terminie), jeden projekt blisko przekroczenia budżetu i jeden z prognozą przekroczenia. Dzięki temu każdy ekran wygląda dobrze od pierwszego uruchomienia.

---

## 11. Plan fazami (kolejność obowiązkowa)

> Po każdej fazie: uruchom aplikację, testy, krótkie podsumowanie, aktualizacja `CHANGELOG.md`/`DECISIONS.md`, **stop i czekaj na "dalej"**.

### Faza 0: Fundament
- Repo, Next.js + TS, Tailwind, ESLint/Prettier, Vitest, Playwright, CI (lint + testy + build).
- Projekt Supabase (krok po kroku z użytkownikiem), migracje, generowanie typów, `.env.example`.
- i18n (PL/EN), `config/brand.ts`, flaga `BILLING_ENABLED`.
- **System wyglądu:** tokeny, `.glass`, typografia, motyw jasny/ciemny/auto, strona `/design` z wszystkimi komponentami z 4.5 w każdym stanie.
- Skopiuj prototyp do `reference/velodrome-dashboard.html`.
- **Akceptacja:** `/design` wygląda jak prototyp w 3 szerokościach (360, 1024, 1440) i w obu motywach; testy i build przechodzą.

### Faza 1: Konta, workspace, shell
- Auth, onboarding, workspace, zaproszenia, role, RLS dla tabel z 5.1 + testy RLS.
- Shell: baner (pełny i kompaktowy), zakładki kontekstowe, pasek boczny, szuflada na mobile, przełącznik workspace, motyw, szkielet palety poleceń.
- **Akceptacja:** dwóch użytkowników w dwóch workspace'ach nie widzi swoich danych; zaproszenie działa end-to-end; nawigacja bez nakładania się na 360/768/1024/1440/2560.

### Faza 2: Zadania i widok Lista
- Spaces/Folders/Lists/Statuses/Tasks, panel zadania (pola, opis, podzadania, checklisty, tagi, przypisani), widok Lista z grupowaniem, filtrami, sortowaniem, zapisanymi widokami, wirtualizacją, przeciąganiem kolejności.
- **Akceptacja:** utworzenie, edycja, przeniesienie i usunięcie zadania działa; 5000 zadań przewija się płynnie; wszystkie zmiany zapisane po odświeżeniu.

### Faza 3: Kanban, Kalendarz, współpraca
- Widoki Kanban i Kalendarz, komentarze + wzmianki, załączniki, aktywność, powiadomienia in-app i e-mail, realtime.
- **Akceptacja:** przeciągnięcie karty u jednego użytkownika pojawia się u drugiego w ≤2 s; wzmianka wysyła powiadomienie.

### Faza 4: Oś czasu / Gantt
- Zależności (FS/SS/FF/SF, lag), walidacja cykli, belki z przeciąganiem i zmianą długości, strzałki, linia "dziś", skale, grupowanie.
- **Akceptacja:** przesunięcie zadania nadrzędnego pokazuje wpływ na zależne (ostrzeżenie lub auto-przesunięcie wg ustawienia); cykl zablokowany z komunikatem.

### Faza 5: Czas pracy i stawki
- Stoper w banerze, wpisy ręczne, karta czasu, billable, stawki (koszt/sprzedaż) z migawką, zatwierdzanie, przypomnienia.
- **Akceptacja:** zmiana stawki nie zmienia kosztu historycznych wpisów; zwykły członek nie widzi żadnych stawek (test API + UI).

### Faza 6: Budżety, wydatki, prognozy, alerty
- Tabele z 5.3, `lib/finance` (wszystkie formuły z 7.5 z testami jednostkowymi i przypadkami brzegowymi), zakładka Budget, wydatki z paragonami, kategorie, zbiorczy widok budżetów, alerty progowe i prognozy (cron, bez duplikatów).
- **Akceptacja:** dla danych z seeda liczby zgadzają się z ręcznym przeliczeniem w teście; alert 90% wysyła się raz; projekt z prognozą przekroczenia jest oznaczony.

### Faza 7: Klienci i faktury
- Klienci, faktury (ręczne i z godzin/wydatków), numeracja, VAT, PDF, e-mail, płatności, status `overdue` (cron), marża i przychód niezafakturowany.
- **Akceptacja:** utworzenie faktury z godzin oznacza wpisy jako `invoiced` i nie pozwala zafakturować ich drugi raz; PDF czytelny i poprawnie sumuje VAT w groszach (bez błędów zaokrągleń).

### Faza 8: Dashboardy, raporty, wyszukiwanie, workload
- Strona główna wg ról, raporty z 7.7, eksport CSV/PDF, pełne wyszukiwanie i paleta poleceń, widok obłożenia, importy CSV, onboarding z checklistą, puste stany.
- **Akceptacja:** każdy ekran ma stan ładowania, pusty i błędu; raporty zgodne z danymi źródłowymi.

> **Tu kończy się Etap A (narzędzie dla zespołu). Używaj go na co dzień, zbierz uwagi, dopiero potem Faza 9.**

### Faza 9: SaaS
- Plany/entitlements, Stripe (checkout, portal, webhooki), trial, limity (`can()`), ekrany odblokowania, landing + cennik, strony prawne, RODO (eksport/usunięcie), panel admina.
- **Akceptacja:** nowa firma przechodzi rejestracja → trial → płatność → plan odblokowuje funkcje; nieudana płatność degraduje plan zgodnie z regułą; webhooki idempotentne (test podwójnego dostarczenia).

### Faza 10: Hartowanie i start
- Audyt dostępności, wydajności i bezpieczeństwa; testy E2E kluczowych ścieżek (rejestracja, zadanie, czas, budżet, faktura, płatność); testy wizualne (zrzuty Playwright 360/768/1024/1440/2560 × jasny/ciemny); monitoring i alerty; test odtworzenia kopii; lista startowa.

---

## 12. Kontrola jakości

**Definition of Done dla każdej funkcji:** działa na telefonie i desktopie, oba motywy, PL i EN, stany (ładowanie/pusty/błąd), klawiatura, testy, brak błędów w konsoli.

**Lista kontrolna "nic na siebie nie zachodzi"** (sprawdzaj każdy nowy ekran na 360, 768, 1024, 1440, 2560 px):
- brak poziomego przewijania strony,
- teksty i liczby nie wychodzą poza karty (zawijanie lub przycinanie z `title`),
- tooltipy i popovery nie przykrywają kontrolek, którymi się steruje,
- tabele na <640 px jako karty, bez ucięć,
- baner: zakładki zawsze stykają się z krawędzią, kontrolki zawijają się, nie nachodzą na tytuł,
- szkło czytelne: kontrast tekstu ≥4.5:1 na jasnym i ciemnym tle.

**Testy obowiązkowe:** jednostkowe dla `lib/finance` i `lib/money`, RLS dla każdej tabeli, E2E ścieżek z Fazy 10, zrzuty wizualne dla komponentów z `/design`.

---

## 13. Do ustalenia później (nie blokuje startu)

Ostateczna nazwa i domena; plany cenowe i limity; wymagany język interfejsu dla klientów poza Polską; zasady e-faktur i zgodności księgowej na rynkach docelowych; czy faktury mają być też wystawiane przez integrację z zewnętrznym systemem księgowym; kursy walut automatyczne; aplikacja mobilna natywna.
