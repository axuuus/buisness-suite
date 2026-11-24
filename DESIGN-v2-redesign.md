# DESIGN v2: nowy wygląd Velodrome ("Clean Data Light")

> Ten plik **zastępuje sekcję 4 (System wyglądu) z PLAN-platforma.md**. Reszta planu (stack, model danych, role, moduły, fazy 3–10, zasady jakości) obowiązuje bez zmian.
> **Hierarchia źródeł prawdy (od najważniejszego):**
> 1. `reference/new-look/velodrome-new-look.html`: działający prototyp (otwórz w przeglądarce; widoki `#` = Przegląd, `#budget` = projekt/Budget; przełącznik motywu w górnym pasku). **Kod ma pierwszeństwo przed opisem.** Skopiuj z niego CSS, geometrię wykresów i proporcje, nie przepisuj od zera.
> 2. Obrazki `reference/new-look/01…04*.png` (inspiracja i kierunek, gdy prototyp czegoś nie pokrywa).
> 3. Ten opis (tokeny, zasady, mapowanie na dane).
> Prototyp jest statyczny: nie ma i18n, prawdziwych danych, RLS ani Recharts. Wygląd i zachowanie (hover, focus, klawiatura, sortowanie, responsywność) odtwarzasz w komponentach React, a dane podpinasz z warstwy aplikacji.
> Referencje są **inspiracją stylu**. Nie kopiuj logo, nazwy "zentra", zdjęcia awatara ani treści tekstowych.

---

## 1. Co się zmienia, a co zostaje

| Zmienia się | Zostaje |
|---|---|
| Banner z różowym gradientem i paskami → **jasny nagłówek strony** (logo, nawigacja pigułkowa, tytuł, pasek narzędzi) | Hierarchia Space → Folder → List, zakładki kontekstowe projektu |
| Różowe szkło na wszystkim → **solidne, miękkie białe karty**; szkło tylko na elementach pływających | Wszystkie tokeny jako zmienne CSS, motyw jasny/ciemny/auto, i18n, rem/clamp, container queries |
| Paleta róż/bordo → **neutralna baza + akcenty danych** (niebieski, zielony, róż, pomarańcz) | Zasada "nic na siebie nie zachodzi", lista kontrolna z sekcji 12 planu |
| Wykresy gładkie → **słupki kreskowane, wykres schodkowy, histogram z kropek, kreskowane paski postępu** | Formuły finansowe, kolory statusu budżetu (z nową paletą, p. 3.2) |
| Krój Inter Tight → **grotesk z większym kontrastem wag** (p. 4) | Dostępność (4.8 planu) |

Nazwę `Velodrome` i `config/brand.ts` zostawiamy. Paleta marki trafia do `brand.ts` (p. 3).

---

## 2. Analiza referencji (co dokładnie widać)

**01 (cały ekran):** szara ramka strony (#CFCFCF) tylko na potrzeby prezentacji. Aplikacja to duży zaokrąglony panel #F2F2F2. U góry: logo po lewej, **nawigacja w środku jako pigułki** (aktywna = czarna pigułka z białym tekstem, reszta bez tła), po prawej trzy okrągłe przyciski (szukaj, powiadomienia z pomarańczową kropką, awatar z gradientową obwódką). Niżej wielki tytuł strony ("Overview") z małym okrągłym przyciskiem-linkiem, a po prawej **pasek narzędzi**: zakres dat, "compared to", zakres porównawczy, selektor granulacji (Daily), "Add widget". Poniżej siatka 3 kolumn: szeroka karta wykresu (2 kol.), wąska karta KPI (1 kol.), dół: karta z wykresem, dwie małe karty KPI jedna nad drugą, karta "Insights" z gradientem.

**02 (lejek + pasek poleceń):** wykres lejka z 5 kolumnami. Nagłówek każdej kolumny: mała etykieta + duża liczba (nieaktywne jasnoszare, aktywna czarna). Słupki: aktywny pełny niebieski gradient, pozostałe **kreskowane po przekątnej**. Między słupkami **miękki skos** (trapez przechodzący w przezroczystość) pokazujący spadek. Nad słupkiem mała błyszcząca kapsułka (znacznik celu). Aktywna kolumna ma jasnoniebieskie tło od góry. Tooltip: szklana pigułka "48.6k transactions | Conversion: 89% | Drop-off: -11%". Na dole **pływający pasek poleceń** (szkło z niebieską poświatą): ikona iskry, podpis, pole tekstowe z pomarańczowym tagiem encji (`/successful payments`).

**03 (wykresy małe):** wykres **schodkowy** (różowa linia 2 px, pod nią bardzo delikatne pionowe paski w różu), kropka na maksimum z bąbelkiem "42%". Karty KPI: duża liczba po lewej, w środku **histogram z kropek** (szczyt ciemny i nasycony, reszta jasny odcień, nad szczytem bąbelek "Peak: Wed"), po prawej "vs last period" i różnica.

**04 (nagłówek + Gross Volume):** zakres dat w białych segmentach, "compared to" jako szary tekst między nimi, przyciski "Daily" i "Add widget +" w szarej pigułce. Karta: tytuł, okrągły przycisk "⋯", ogromna liczba, **chip delta** (zielony trójkąt + "15%", biała pigułka z cieniem), cienka linia, wiersze etykieta/kwota z **kreskowanym paskiem postępu** (zielony, niebieski, różowy).

**Karta Insights (01):** gradient siatkowy (pomarańcz → żółć → niebieski → granat) z ziarnem, szklany tag "Insights", ogromne "75%" w bieli, dwuzdaniowy opis, na dole 3-segmentowy wskaźnik karuzeli.

---

## 3. Tokeny

### 3.1 Jasny motyw (domyślny)

```css
:root{
  /* powierzchnie */
  --bg:#F2F2F2;            /* panel aplikacji */
  --bg-page:#E9E9EA;       /* tło za panelem na dużych ekranach */
  --surface:#FFFFFF;       /* karty */
  --surface-2:#F7F7F7;     /* wewnętrzne pola, nieaktywne segmenty */
  --line:rgba(0,0,0,.08);
  --line-strong:rgba(0,0,0,.14);

  /* tekst */
  --text:#0B0B0C;
  --muted:#6E6E73;         /* min. 4.5:1 na białym */
  --faint:#A3A3A8;         /* tylko dekoracja / stany nieaktywne (liczby w lejku), nigdy tekst informacyjny */

  /* akcenty danych */
  --blue-700:#1B3FD0; --blue-500:#2F6BFF; --blue-200:#BFD3FF; --blue-100:#E3ECFF;
  --green-600:#139A38; --green-500:#22B84A; --green-200:#A7E3B7; --green-100:#E2F6E8;
  --pink-500:#F0287F;  --pink-200:#F9B8D3; --pink-100:#FDE6F0;
  --orange-500:#F59A3D; --orange-100:#FFE8C7; --orange-ink:#8A4B00;
  --red-500:#D93A3A;   --red-100:#FBE3E3;

  /* semantyka (używaj tych, nie surowych kolorów) */
  --accent:var(--blue-500);          /* główny akcent, aktywny wykres */
  --positive:var(--green-600);
  --negative:var(--red-500);
  --warning:var(--orange-500);
  --series-1:var(--blue-500); --series-2:var(--green-500); --series-3:var(--pink-500); --series-4:var(--orange-500);
  --ink-btn:#1C1C1E;                 /* aktywna pigułka nawigacji, przyciski ciemne */

  /* kształt */
  --r-card:1.75rem; --r-shell:2.25rem; --r-inner:1rem; --r-pill:999px;
  --px:clamp(1rem,2.4vw,2.5rem);

  /* cienie */
  --sh-card:inset 0 1px 0 rgba(255,255,255,.9), 0 .125rem .5rem rgba(0,0,0,.04), 0 1.25rem 2rem -1.5rem rgba(0,0,0,.14);
  --sh-float:inset 0 1px 0 rgba(255,255,255,.95), 0 .5rem 1.25rem -.5rem rgba(0,0,0,.22);
  --sh-glow:0 0 3rem -.5rem rgba(47,107,255,.45);   /* pasek poleceń */

  /* szkło (tylko elementy pływające) */
  --glass-bg:linear-gradient(180deg,rgba(255,255,255,.82),rgba(255,255,255,.6));
  --glass-edge:rgba(255,255,255,.9);
  --stripe:rgba(255,255,255,.85);    /* kolor kresek na kreskowanych słupkach */
}
```

### 3.2 Status budżetu (zastępuje 4.7 planu)
`<75%` → `--accent` (niebieski); `75–99%` → `--warning`; `≥100%` lub prognoza ≥100% → `--red-500` z ikoną ⚠ i tekstem (np. „+12% ponad budżet”). Pigułki statusu: `.sp.ok/.wait/.paid/.bad` z prototypu (tła `rgba` koloru + ciemniejszy tekst, w ciemnym motywie jasny tekst). Zawsze ikona lub tekst obok koloru. Nie wprowadzaj innych kolorów statusu.

### 3.3 Ciemny motyw
Ten sam zestaw nazw pod `[data-theme="dark"]` i `prefers-color-scheme` (gdy brak `data-theme="light"`):
`--bg:#0E0E10; --bg-page:#08080A; --surface:#17171A; --surface-2:#1F1F23; --line:rgba(255,255,255,.08); --text:#F5F5F7; --muted:#A1A1A8; --faint:#5C5C63; --blue-500:#5B8CFF; --green-500:#3DDC6B; --pink-500:#FF5FA2; --orange-500:#FFAE5C; --red-500:#FF6B6B; --ink-btn:#F5F5F7` (aktywna pigułka jasna z ciemnym tekstem), `--stripe:rgba(0,0,0,.45)`, szkło `rgba(40,40,46,.75)`. Karty bez cienia zewnętrznego, za to z 1 px `--line`.

### 3.4 Aliasy migracyjne
Na czas migracji w `globals.css` zostaw aliasy: `--rose→--accent`, `--deep→--ink-btn`, `--baby→--blue-100`, `--soft→--bg`, `--char→--text`, `--slate→--muted`, `--silver→--faint`. Usuń je na końcu Fazy R, gdy `grep` nie znajdzie użyć.

---

## 4. Typografia

- Krój: **Geist** (next/font, wagi 400/500/600) z fallbackiem `system-ui`. Alternatywa gdyby nie pasował: Instrument Sans. Referencja używa grotesku w stylu Neue Montreal/Suisse: dopasuj proporcje i ciasne śledzenie, nie nazwę.
- Tytuł strony: `clamp(2rem,3.6vw,3.25rem)`, waga 500, `letter-spacing:-.03em`.
- Tytuł karty: `1.125rem`, waga 500.
- **Duża liczba KPI:** `clamp(2.25rem,12cqi,4.5rem)`, waga 400–500, `letter-spacing:-.04em`, `font-variant-numeric:tabular-nums`.
- Etykieta: `.8125rem`, kolor `--muted`. Liczby w tabelach zawsze tabelaryczne.

---

## 5. Układ aplikacji (shell)

- **Panel:** na ≥1024 px aplikacja siedzi w zaokrąglonym panelu `--bg` (`--r-shell`) z marginesem `1rem` od `--bg-page`; poniżej 1024 px pełna szerokość, bez ramki.
- **Górny pasek (zastępuje banner):** logo (lewo), nawigacja pigułkowa (środek), okrągłe przyciski 2.5 rem: szukaj (otwiera pasek poleceń), powiadomienia z kropką `--orange-500`, awatar z cienką obwódką gradientową (prawo). Aktywna pozycja = `--ink-btn` + biały tekst, reszta przezroczysta, hover `--surface` z cieniem. Na ≤900 px nawigacja zwija się do przycisku-menu (szuflada).
- **Nawigacja globalna:** Home, Work (projekty), Time, Budget, Invoices, Clients, Reports. Ustawienia z menu awatara.
- **Nagłówek strony:** wielki tytuł + okrągły przycisk akcji (kopiuj link) + **pasek narzędzi** po prawej (zakres, "compared to", granulacja, Add widget). Na ≤1040 px pasek narzędzi schodzi pod tytuł i zawija się.
- **Zakładki kontekstowe projektu** (Overview, List, Board, Calendar, Timeline, Budget, Settings) jako **segmentowa pigułka pod tytułem**, w tym samym stylu co nawigacja (aktywna czarna). Na wąskich ekranach przewijana poziomo wewnątrz własnego kontenera.
- **Panel boczny z drzewem Space → Folder → List:** tylko w obszarze Work. Wąski (15 rem), `--surface` z zaokrągleniem, zwijany do ikon, na ≤900 px szuflada. Poza Work go nie ma (czysty układ jak w referencji).
- **Stoper** (Faza 5) mieszka w górnym pasku jako pigułka obok ikon.
- **Siatka widgetów:** 12 kolumn logicznych, odstęp `1rem`; ≥1100 px układ jak na 01 (2+1 / 1+1+1), 700–1100 px 2 kolumny, <700 px 1 kolumna. Zawsze `minmax(0,1fr)`.

---

## 6. Komponenty

Każdy ma stany: domyślny, hover, focus (`outline:2px solid var(--accent); outline-offset:2px`), aktywny, wyłączony, ładowanie (szkielet w kształcie komponentu), błąd, pusty.

| Komponent | Specyfikacja |
|---|---|
| **Karta** (`.card`) | `--surface`, `--r-card`, `--sh-card`, padding `1.25rem 1.5rem`. Nagłówek: tytuł po lewej, okrągły przycisk "⋯" (2.25 rem, obwódka 1 px `--line-strong`, tło przezroczyste) po prawej. Kontener `container-type:inline-size`. **Bez `backdrop-filter`.** |
| **Element pływający** (`.float`) | tylko tooltipy, popovery, menu, pasek poleceń, chip delta, toasty: `--glass-bg`, `blur(16px) saturate(160%)`, `--sh-float`, obwódka `--glass-edge`. Alternatywa bez blur dla `@supports not`. |
| **Przycisk okrągły** | 2.5 rem, obwódka `--line-strong`, ikona 1.1 rem, hover `--surface` + cień |
| **Pigułka nawigacji / segment** | wysokość 2.25 rem, padding 0 1rem, `--r-pill`, aktywna `--ink-btn` |
| **Pole zakresu dat** | biały segment (`--surface`, `--r-inner`) z ikoną kalendarza, tekst, szewron; "compared to" jako `--muted` bez tła między segmentami; granulacja i "Add widget +" w szarej pigułce `--surface-2` |
| **Chip delta** | `.float`, trójkąt ▲/▼ + wartość; kolor trójkąta `--positive`/`--negative`. Dla kosztów kolor zależy od tego, czy wzrost jest dobry (parametr `goodWhen="up"\|"down"`) |
| **Tag encji** | pomarańczowy: tło `--orange-100`, obwódka `#F2B96B`, tekst `--orange-ink`, `--r-inner`, `.8125rem` |
| **Kreskowany pasek postępu** | wysokość .75 rem, tor `--surface-2`, wypełnienie gradient koloru serii + kreski `repeating-linear-gradient(135deg,var(--stripe) 0 2px,transparent 2px 6px)`, zaokrąglone. Prognoza = segment jaśniejszy z innym wzorem kresek (nie tylko kolor) |
| **Tooltip** | `.float`, pigułka, `.8125rem`, wartości `font-weight:500`, separatory `|` w `--faint`. Tooltip żyje w kontenerze wykresu (nie w `body`), jest wyśrodkowany nad aktywną kolumną i przy skrajnych kolumnach przesuwa się do środka, żeby nie wyjść poza kartę (patrz `set()` w prototypie); na <700 px może się zawijać. Nigdy nie zasłania kontrolki, którą obsługujemy i nie powoduje poziomego przewijania |
| **Wskaźnik karuzeli** | 3 segmenty 2 px wysokości, aktywny biały |
| **Tabela** | bez ramek kart wewnątrz, nagłówek `.75rem` `--muted`, wiersze z linią `--line`, **bez blur**, sortowanie klikalne z `aria-sort`; <640 px lista kart etykieta/wartość |
| **Modal / panel zadania** | `.float` większy promień, panel zadania jako szuflada z prawej (na telefonie pełny ekran), `max-height:90dvh`, pułapka fokusa, Escape |
| **Toast** | ciemna pigułka na dole (`--ink-btn`), `role="status"`, ~2 s |
| **Przełącznik / segment / checkbox / pola** | pole: `--surface-2`, `--r-inner`, focus ring `--accent`; przełącznik aktywny `--accent` |
| **Pusty stan** | ikona w okrągłym przycisku, tytuł, jedno zdanie, przycisk akcji (czarna pigułka) |

### 6.1 Wykresy (Recharts + własne kształty, kolory wyłącznie z tokenów, osie jako HTML tam gdzie to możliwe)

1. **Lejek kreskowany (`FunnelBars`)**: N kolumn (3–6) rozdzielonych pionowymi liniami `--line`. Nagłówek kolumny: etykieta + liczba (`--faint` gdy nieaktywna, `--text` gdy aktywna). Słupek nieaktywny: gradient `--blue-700→--blue-500` + kreski `--stripe`, aktywny: pełny gradient bez kresek. Skos między słupkami: SVG `path` z gradientem do przezroczystości. Kapsułka-cel nad słupkiem (`.float`, 1.1 rem × .35 rem). Aktywna kolumna: tło `linear-gradient(var(--blue-100),transparent)`. Hover/focus przełącza aktywną kolumnę, klawiaturą strzałki. Tooltip z konwersją i spadkiem (%).
2. **Wykres schodkowy (`StepLine`)**: `curveStepAfter`, linia 2 px `--series-3`, pod nią cienkie pionowe paski (1 px co 4 px, `--pink-200` → przezroczystość), kropka na maksimum z białą obwódką i bąbelkiem wartości, oś X z etykietami miesięcy/tygodni. `vector-effect:non-scaling-stroke`.
3. **Histogram z kropek (`DotHistogram`)**: kolumny kropek `.5rem`, odstęp `.2rem`, wartość = liczba kropek (zaokrąglona do skali), szczyt w `--series-2` lub `--series-1` pełny, reszta ten sam kolor 35% krycia. Bąbelek "Peak: …" nad szczytem w zarezerwowanym wierszu. Dostępność: `role="img"` z `aria-label` opisującym szczyt i listę wartości w ukrytej tabeli.
4. **Kreskowane paski (`StripeBar`)**: jw. w kartach z listą kategorii (etykieta po lewej, kwota po prawej, pasek pod spodem).
5. **Wykresy liniowe/burn-down (budżet):** schodkowy styl jak 2, seria "plan" w `--faint` przerywana, "rzeczywistość" w `--accent`, "prognoza" kreskowana w `--warning`.
6. **Karta Insights (`InsightCard`)**: tło gradient siatkowy z 4–5 `radial-gradient` (pomarańcz `#F59A3D`, żółć `#FFD27A`, niebieski `#2F6BFF`, granat `#0E1B66`), nakładka ziarna `feTurbulence` (opacity .12), **ciemny scrim u dołu**, żeby biały tekst miał ≥4.5:1. Ogromna liczba, 2 zdania, tag "Insights" jako `.float` ciemniejszy, 3-segmentowy wskaźnik. Treść **generowana regułami z `lib/finance`** (nie AI), np. "Projekt X przekroczy budżet ok. 14.12 przy obecnym tempie".
7. Wszystkie wykresy: stany ładowania (szkielet), pusty, błąd; `prefers-reduced-motion` wyłącza animacje wejścia; wzorzec kresek jest **dodatkowym** kanałem informacji obok koloru (dostępność dla daltonistów).

### 6.2 Pasek poleceń (zastępuje "AI prompt bar")
Pływający `.float` z poświatą `--sh-glow`, dostępny z ikony szukaj i `Ctrl/Cmd+K`, na stronie głównej opcjonalnie dokowany na dole karty lejka. Wpisanie `/` otwiera listę encji (projekt, klient, lista, osoba, faktura) i wstawia **pomarańczowy tag** w pole. Akcje: nawigacja, utworzenie zadania, filtr, szybkie wyszukiwanie. **Bez LLM w tej fazie.** Gdy kiedyś dojdzie AI, ma być za flagą `AI_ENABLED=false` (zapisz w DECISIONS.md).

---

## 7. Mapowanie widgetów na dane Velodrome

**Strona główna, Manager/Admin/Owner**

| Widget (jak w referencji) | Treść w Velodrome |
|---|---|
| Lejek (szeroka karta) | **Pipeline przychodu:** Godziny wpisane → Zatwierdzone → Billable → Zafakturowane → Opłacone (kwoty `bill_rate_snapshot`), konwersja i spadek między etapami |
| Gross Volume (wąska karta) | **Przychód w okresie** + chip delta vs okres porównawczy + 3 kreskowane paski wg `billing_type` (Fixed, Hourly, Retainer) |
| Retention (schodkowy) | **Burn rate** (koszty rzeczywiste / tydzień) ze schodkową linią, szczyt z bąbelkiem |
| Transactions (kropki) | **Godziny w tym tygodniu** z histogramem po dniach, "vs poprzedni okres" |
| Customers (kropki) | **Ukończone zadania** (histogram po dniach) lub **Aktywni klienci** |
| Insights | Reguły: prognoza przekroczenia budżetu, faktury po terminie, spadek marży, niedoszacowane estymaty |

**Strona główna, Member:** Moje zadania na dziś (karta z listą), Godziny w tym tygodniu (kropki), Zbliżające się terminy (kreskowane paski), Insights bez danych finansowych. Zwykły członek **nigdy** nie widzi stawek ani kwot (reguła z sekcji 6 planu bez zmian).

**"Add widget +":** w tej fazie tylko panel włącz/wyłącz i zmiana kolejności z zestawu gotowych widgetów roli (zapis w `user_dashboard_layouts` jsonb, jedna tabela z RLS po `user_id`). Bez swobodnego układania.

**Zakres dat i "compared to":** sterują wszystkimi widgetami i deltami; granulacja Daily/Weekly/Monthly zmienia agregację wykresów.

---

## 8. Wydajność i responsywność
- Szkło tylko na elementach pływających (max kilka naraz). Karty i wiersze tabel bez blur.
- Wykresy: osie i etykiety w HTML, SVG tylko na kształty; wirtualizacja list bez zmian.
- Wszystko w `rem`/`clamp`, `@container` w kartach, `flex-wrap` przy więcej niż 2 elementach w rzędzie.
- Safe-area w paddingach górnego paska i dolnych elementów.
- Lista kontrolna "nic na siebie nie zachodzi" (sekcja 12 planu) obowiązuje: 360, 768, 1024, 1440, 2560 px × jasny/ciemny.

---

## 9. Plan: Faza R (Redesign), potem kontynuacja

> Gałąź `redesign/clean-data-light`. Po fazie: uruchom aplikację i testy, podsumowanie, CHANGELOG/DECISIONS, **stop i czekaj na "dalej"**.

### Faza R: Redesign całej dotychczasowej aplikacji (Fazy 0–2)
- **R1 Tokeny:** nowy `globals.css` z sekcji 3, aliasy migracyjne, `brand.ts` zaktualizowany, font Geist, usunięcie klas `.glass`/`.hg` z kart (szkło tylko `.float`).
- **R2 Biblioteka:** przenieś CSS i geometrię z prototypu do komponentów React i zbuduj `/design` wg sekcji 13, ze wszystkimi komponentami z sekcji 6 w każdym stanie i w obu motywach, w tym `FunnelBars`, `StepLine`, `DotHistogram`, `StripeBar`, `InsightCard`, pasek poleceń, tabelę z trybem kart i pigułki statusu. Dane z mocków.
- **R3 Shell:** górny pasek, nagłówek strony z paskiem narzędzi, zakładki kontekstowe, panel boczny tylko w Work, szuflady mobilne. Usuń banner.
- **R4 Przeskórkowanie ekranów z Faz 1–2:** logowanie, onboarding, ustawienia, zaproszenia, widok Lista, panel zadania, filtry, zapisane widoki, puste stany. **Bez zmian logiki i bazy.**
- **R5 Strona główna i widok Budget (szkielet):** oba ekrany odwzorowują prototyp (`#home` i `#budget`) na danych mockowych; układ jak w referencji z widgetami na mockowych danych (prawdziwe dane podepniemy w Fazach 6–8), przełączniki zakresu działające na mockach.
- **R6 Dokumentacja i testy:** uruchom `scripts/visual-compare.ts` (sekcja 12), zapisz pary zrzutów w `reference/compare/`; w `PLAN-platforma.md` oznacz sekcję 4 jako zastąpioną i dodaj wskaźnik do `DESIGN-v2-redesign.md`; zaktualizuj zrzuty Playwright; skopiuj referencje do `reference/new-look/`; stary prototyp przenieś do `reference/legacy/`; usuń aliasy migracyjne.
- **Akceptacja:** `/design` i strona główna porównane ze zrzutami referencyjnymi w 1440 px (zrzuty obok siebie w katalogu `reference/compare/`); brak nakładania na 360/768/1024/1440/2560; obie wersje motywu; kontrast ≥4.5:1 (axe bez błędów); wszystkie dotychczasowe testy zielone; `grep` nie znajduje starych tokenów.

### Kontynuacja: Fazy 3–10 (bez zmian zakresu, nowy wygląd)
Zasady wyglądu na kolejne fazy:
- **Faza 3 (Kanban, Kalendarz, współpraca):** karty zadań `--surface` z `--r-inner`, kolumny na `--surface-2`; przeciągana karta dostaje `--sh-float`; wzmianki jako pomarańczowy tag; komentarze w szufladzie; kalendarz: dni jako białe komórki, zadania jako małe pigułki w kolorze serii.
- **Faza 4 (Gantt):** belki: wykonana część pełna, pozostała **kreskowana**; zależności cienkie strzałki `--faint`; linia "dziś" `--accent`; belka zagrożona `--warning`.
- **Faza 5 (Czas):** stoper jako pigułka w górnym pasku; karta czasu w stylu tabeli; histogram kropek na podsumowaniu tygodnia.
- **Faza 6 (Budżet):** karty KPI z dużą liczbą + chip delta; pasek zużycia kreskowany z segmentem prognozy; burn-down jako `StepLine`; kolory statusu z 3.2; alerty w Insights.
- **Faza 7 (Faktury):** lista faktur jako tabela z pigułkami statusu; PDF faktury w neutralnym stylu (czerń/biel/jeden akcent), bez gradientów.
- **Faza 8 (Dashboardy):** pełna strona główna na danych z seeda, raporty z tymi samymi komponentami wykresów, pasek poleceń z pełnym wyszukiwaniem, "Add widget".
- **Faza 9–10:** landing i cennik w tym samym języku (jasny, duże liczby, kreskowane wykresy w hero), ekrany "Odblokuj w planie" jako `.float` na rozmytej treści; testy wizualne 360/768/1024/1440/2560 × jasny/ciemny.

---

## 10. Wpisy do DECISIONS.md (agent ma je dodać)
1. Sekcja 4 planu zastąpiona przez `DESIGN-v2-redesign.md`; marka zachowuje nazwę Velodrome.
2. Paleta: neutralna baza + niebieski jako akcent główny; zielony/różowy/pomarańcz jako serie danych; różowa marka z v1 wycofana.
3. Szkło tylko na elementach pływających (wydajność i czytelność).
4. Pasek poleceń bez LLM, AI za flagą `AI_ENABLED=false`.
5. "Add widget" ograniczone do włącz/wyłącz i kolejności; tabela `user_dashboard_layouts`.
6. Insights generowane regułami z `lib/finance`.
7. Font Geist (zmiana z Inter Tight).


---

## 11. Widok projektu / Budget (uzupełnienie, w prototypie: `#budget`)

- **Nagłówek:** tytuł projektu (ta sama skala co "Przegląd"), po prawej przycisk drugorzędny ("Eksport") i **główny przycisk ciemny** ("Dodaj wydatek +", `.btn`, `:active` skala .97).
- **Zakładki projektu:** segmentowa pigułka `.tabs` (tło `--surface-2`, aktywna czarna), `role="tablist"`, `aria-selected`, przewijana poziomo w swoim kontenerze na wąskich ekranach. Aktywna pozycja globalnej nawigacji ("Work") pozostaje podświetlona.
- **Rząd KPI (`.g4`):** 4 karty `auto-fit minmax(13rem,1fr)`: etykieta, liczba `clamp(2rem,13cqi,3rem)`, pigułka statusu (Stała cena / 82% budżetu / 18% / ⚠ +12% ponad budżet). Kolor pigułki wynika z progów w 3.2, nigdy sam kolor: zawsze też tekst lub ikona.
- **Zużycie budżetu:** pasek `.use` w skali 0–125%: wypełnienie kreskowane `--warning` (wydano), segment prognozy w pionowe czerwone kreski (inny wzorzec niż wydano, żeby nie polegać tylko na kolorze), przerywany znacznik "Budżet 100%", legenda pod spodem, pod nią rozbicie na kategorie jako kreskowane paski z kwotą "X z Y".
- **Burn-down:** wykres schodkowy pozostałego budżetu: plan (przerywana `--faint`), rzeczywistość (`--accent`, schodki), prognoza (przerywana `--red-500`), linia zera; przekroczenie widać jako zejście poniżej zera.
- **Tabela wydatków:** nagłówek jako zaokrąglony pasek `--surface-2`, sortowanie przyciskiem w `<th>` z `aria-sort`, kwoty wyrównane do prawej, cyfry tabelaryczne i spacja niełamliwa jako separator tysięcy, status jako pigułka. **Poniżej 640 px wiersze zamieniają się w karty** (etykieta z `data-l` po lewej, wartość po prawej), bez ukrytego przewijania.

## 12. Weryfikacja wizualna (obowiązkowa w Fazie R i w każdej kolejnej fazie)

1. **Skrypt Playwright** `scripts/visual-compare.ts`: renderuje `reference/new-look/velodrome-new-look.html` oraz odpowiadające im ekrany aplikacji (`/design`, strona główna, widok Budget na danych mockowych) w 360, 768, 1024, 1440 i 2560 px, w obu motywach, i zapisuje pary zrzutów do `reference/compare/`.
2. **Przegląd obok siebie:** agent otwiera pary zrzutów i **sam wypisuje różnice** (odstępy, promienie, wagi fontów, kolory, cienie, wzorce kresek) oraz poprawia je, aż pozostaną tylko różnice wynikające z danych. Dopuszczalne odchylenie: ±2 px w odstępach i promieniach, kolory z tokenów bez odchyłek.
3. **Test automatyczny:** brak poziomego przewijania (`scrollWidth <= clientWidth`) na wszystkich szerokościach, brak błędów konsoli, axe bez naruszeń kontrastu, nawigacja klawiaturą po lejku (strzałki), zakładkach i sortowaniu tabeli.
4. **Kontrola zachowania z prototypu:** hover/focus na kolumnie lejka przesuwa aktywną kolumnę i tooltip; przełącznik motywu działa i zapamiętuje wybór; tabela sortuje; `prefers-reduced-motion` wyłącza mruganie karetki i przejścia.
5. **Stany:** każdy komponent z sekcji 6 ma w `/design` wariant ładowania (szkielet o kształcie komponentu), pusty i błędu, których prototyp nie pokazuje: zaprojektuj je w tym samym języku (szare kreskowane szkielety, okrągła ikona, jedno zdanie, czarna pigułka akcji).

## 13. Struktura strony `/design` (R2)

Sekcje w tej kolejności: Tokeny (próbki kolorów, skala typografii, promienie, cienie) → Przyciski i pigułki → Pola i przełączniki → Karty i nagłówki kart → Chipy, pigułki statusu, tagi → Wykresy (`FunnelBars`, `StepLine`, `DotHistogram`, `StripeBar`, burn-down, `InsightCard`) → Tabela (z trybem kart) → Elementy pływające (tooltip, popover, modal, toast, pasek poleceń) → Stany (ładowanie, pusty, błąd) → Shell (górny pasek, zakładki projektu). Przełącznik motywu i przełącznik szerokości podglądu (360/768/1024/1440) na górze strony.
