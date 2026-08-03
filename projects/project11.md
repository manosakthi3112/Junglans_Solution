# Expense Tracker — React Native (Expo)

A **fully offline** mobile expense tracker built with **React Native (Expo) + TypeScript**. Users log expenses under categories (some in quantity mode: unit price × quantity → auto-calculated total) and view spending summaries by **month, year, and lifetime**, in a **claymorphism UI** with a white + light-green theme.

> No backend. No login. No cloud sync. All data lives on-device in SQLite.

## Features

- 9 default categories (Petrol, Grocery, Food, Transport, Bills, Entertainment, Health, Shopping, Other) seeded on first launch
- Custom categories with icon, color accent, and field mode (`simple` or `quantity`)
- Expense entry in two modes: simple (amount + note) or quantity (unit price × quantity → live auto-total)
- Dashboard with Month / Year / Lifetime segmented toggle, totals card, category breakdown, and trend charts
- Calendar month-grid view: tap any day to see that day's expenses, with quick add
- Expense history list, grouped by date, with filters, swipe-to-delete, and edit
- Category drill-down and delete-category reassignment flow ("Other" or delete)
- Claymorphism design system (dual-shadow, pastel fills, large radii, soft type)

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Expo (React Native), TypeScript, expo-router |
| Local storage | expo-sqlite (SQLite) |
| State | React Context + hooks |
| Charts | react-native-gifted-charts (or victory-native) |
| Styling | StyleSheet + shared `theme.ts` design tokens |
| Shadows | react-native-shadow-2 (dual light/dark clay shadow) |
| Dates | date-fns |
| Icons | @expo/vector-icons |
| Haptics | expo-haptics (button press feedback) |

## Getting Started

```bash
npx create-expo-app expense-tracker --template blank-typescript
npm install expo-router expo-sqlite react-native-shadow-2 date-fns @expo/vector-icons expo-haptics
# charts: npm install react-native-gifted-charts react-native-svg
# web preview: npm install react-native-web react-dom @expo/metro-runtime  (+ metro.config.js pushes 'wasm' to assetExts for expo-sqlite)
npx expo start
```

See `IMPLEMENTATION.md` for step-by-step build instructions.

> **Troubleshooting:** web preview intentionally shows a "Web preview unsupported" screen — expo-sqlite needs `SharedArrayBuffer`, which requires COOP/COEP headers only a real web server (e.g. EAS Hosting) can send; the dev server can't. Use Expo Go on Android/iOS for the full app.

## Project Structure (planned)

```
app/
  _layout.tsx                 -- root layout, theme provider, DB init
  index.tsx                   -- Dashboard (Home) - monthly/yearly/lifetime toggle
  calendar.tsx                -- calendar month-grid view: per-day expenses
  add-expense.tsx             -- modal/screen for adding an expense
  expense/[id].tsx            -- view/edit a single expense
  history.tsx                 -- full expense list with filters
  categories/index.tsx        -- manage categories
  categories/new.tsx          -- create/edit category form
  category/[id].tsx           -- drill-down view for one category's expenses
components/                   -- shared clay components (ClayCard, ClayButton, ...)
db/                           -- SQLite schema, seed, service layer
lib/                          -- formatCurrency, date helpers, theme.ts
```

## Documentation

| Doc | Purpose |
|---|---|
| `CLAUDE.md` | **Single source of truth — READ THIS FIRST before any edit** |
| `IMPLEMENTATION.md` | Detailed implementation guide (architecture, data layer, components) |
| `SPRINT.md` | Sprint-by-sprint delivery plan |
| `TASKS.md` | Task checklist, mapped to build order |
| `CHANGELOG.md` | Line-by-line edit log — file, line(s), what changed, why |

## Edit-Tracking Policy (REQUIRED)

- **Before editing any file, read `CLAUDE.md` first.**
- Every edited line **must** be recorded in `CHANGELOG.md` with: **file name, line(s), what changed, why**.
- Significant changes are summarized in the "Recent Changes" section below (kept in sync with `CHANGELOG.md`).

## Recent Changes

- **2026-08-01 — Downgraded Expo SDK 57 → 56 (Expo Go compatibility).** Expo Go on the Play Store doesn't support SDK 57 yet (store approval pending per the official SDK 57 changelog), so the app showed "Project is incompatible with this version of Expo Go" even on the latest store build. Per user choice, downgraded to SDK 56: `expo@~56.0.0`, `expo-router@~56.2.17`, `expo-sqlite@~56.0.5`, `react-native@0.85.3` (plus all other expo packages via `npx expo install --fix`). Verified: `sdkVersion: 56.0.0` and `tsc --noEmit` clean. Re-run `npx expo start` and reopen in Expo Go — no reinstall of Expo Go needed.
- **2026-08-01 — Web preview fix (graceful fallback).** Web was crashing on `SharedArrayBuffer is not defined` (expo-sqlite web requirement). Root cause researched: COOP/COEP headers are needed on the HTML document, but `expo start`'s dev server can't send them (the `expo-router` `headers` plugin needs `expo-server`/EAS hosting). Solution per user choice: `AppContext` now surfaces DB init errors → root layout renders a friendly `WebUnsupportedScreen` ("use Expo Go on Android/iOS") instead of hanging. Also: metro config now sets COOP/COEP on bundle/worker responses and ignores `dist-verify*` (fixes a Metro watcher crash), `app.json` carries the expo-router `headers` plugin for future hosted deployment. Verified: `tsc` + smoke + android/web `expo export` all clean.
- **2026-08-01 — Web bundling fixed.** `expo start` → `w` previously failed (`react-native-web` not installed + `wa-sqlite.wasm` unresolvable). Added `react-native-web`, `react-dom`, `@expo/metro-runtime` via `npx expo install` and created `metro.config.js` (pushes `wasm` to `assetExts`). Verified: web + android `expo export` both clean.
- **2026-08-01 — Sprint 7 done.** Calendar: `app/calendar.tsx` (month grid with per-day totals, nav arrows + Today chip, selected-day expense list with tap-view/long-press-edit, add-expense preselected to the day, empty state), `components/Calendar.tsx` (clay month grid: selected/today highlight, expense dots), `lib/calendar.ts` (getMonthGrid, isSameDay, toISODate — history filters now reuse it), `add-expense.tsx` `date` param, dashboard header calendar button. Verified: `tsc` + `expo export` + smoke (new calendar assertions) all clean.
- **2026-08-01 — Sprint 6 done — project complete.** Polish & QA: `ClayPressable` (haptics + pressed states on every flat pressable: back buttons, arrows, trash, icon/color pickers, rows), `lib/haptics.ts`, upgraded dashboard/history empty states with CTA buttons, `roundTo2` moved to `lib/format.ts` with smoke QA (98.4×10, 0.1×0.2, 33.333, ₹ formatting). T-042 (category reorder) intentionally skipped as optional. Verified: `tsc` + `expo export` + smoke all clean. Remaining manual step: visual check on a physical device.
- **2026-08-01 — Sprint 5 done.** Dashboard & charts: `app/index.tsx` (Month/Year/Lifetime `SegmentedControl`, hero total card, donut category breakdown + daily/monthly/yearly bar charts via gifted-charts, prev/next period arrows, FAB) + `app/category/[id].tsx` drill-down (period total, grouped expenses, add-with-preselected-category). New: `lib/period.ts`, `SegmentedControl`, service `getMonthlyTotals`/`getYearlyTotals` (smoke-tested). Verified: `tsc` + `expo export` + smoke all clean.
- **2026-08-01 — Sprint 4 done.** Expense entry & history: `add-expense.tsx` (both entry modes — simple + quantity with live price×qty auto-total, editable override; edit mode; category chips; native date picker), `expense/[id].tsx` (view/edit/delete), `history.tsx` (grouped-by-date list, swipe-to-delete, long-press edit, category + date-range filters). New deps: datetimepicker, gesture-handler, reanimated. Verified: `tsc` + `expo export` + smoke all clean.
- **2026-08-01 — Sprint 3 done.** Category management: `categories/index.tsx` (tile grid, tap-to-edit, trash → "Move to Other"/"Delete expenses too" prompt, defaults read-only) + `categories/new.tsx` (name, 24-icon picker, palette color picker, required field_mode chips, unit label with presets). Added shared `ClayInput` + `lib/icons.ts`. Verified: `tsc` + `expo export` + smoke all clean.
- **2026-08-01 — Sprint 2 done.** Clay component library: `ClayShadow` (central dual light+dark shadow recipe with press inversion), `ClayCard`, `ClayButton` (4 variants + haptics), `ClayChip`, `ClayIconWell`, `Fab` — all in `components/`, demoed on `app/design-system.tsx`. Verified: `tsc --noEmit` clean + `expo export` OK (physical-device shadow check pending).
- **2026-08-01 — Sprint 1 done.** SQLite data layer: schema (`db/schema.ts` incl. `meta` table per CLAUDE.md §4), 9-category seed guarded by `seeded_v1` flag (`db/seed.ts`), full CRUD + totals service (`db/service.ts`), `lib/format.ts` currency/date helpers, DB init wired into root layout via React Context (`context/AppContext.tsx`). Verified: `npm run smoke` (node:sqlite harness, all assertions pass), `tsc --noEmit` clean, `expo export` OK.
- **2026-08-01 — Sprint 0 done.** Scaffolded Expo SDK 57 app in place (expo-router, TypeScript), all 8 route stubs from CLAUDE.md §6, full dependency set installed, `lib/theme.ts` design tokens created. Verified: `tsc --noEmit` clean + `expo export` bundle OK.
- **2026-08-01** — Created documentation suite: `README.md`, `IMPLEMENTATION.md`, `SPRINT.md`, `TASKS.md`, `CHANGELOG.md`; added §9 edit-tracking convention to `CLAUDE.md`.
