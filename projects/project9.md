# CALENDER

A modern, cross-platform **calendar + task management** mobile app built with **Expo (React Native)** and **TypeScript**. It combines a monthly calendar view, a daily agenda, a Kanban-style task board with a Pomodoro-style Focus Mode, local persistence via SQLite/WatermelonDB, local push notifications, streak gamification, and holiday tracking — all wrapped in a clean green-themed UI powered by NativeWind (Tailwind CSS).

## Features

### Calendar (Month View)
- Paged month navigation (`subMonths` / `addMonths`).
- Day selection with single tap; double-tap a day to jump straight to the Day view.
- Events rendered per day, auto-refreshed every 5 seconds.
- **🔥 Streak pill** showing your global streak.
- **Holiday Banner** and **"Holidays & Observances"** list for the visible month (hardcoded Indian holidays, 2024–2026, with public/bank/observance type badges).
- **Daily GK Banner** — a general-knowledge widget.

### Day View
- Per-day agenda with prev/next day chevron navigation (`MMMM d` / `EEEE`).
- Create, edit, and delete events via a modal (`EventModal`).
- Events fetched per day with the same 5-second auto-refresh.

### Kanban Task Board
- Three horizontally-snapped columns: **To Do / In Progress / Done** with empty states.
- Search bar, add-task input, task cards with:
  - Priority badge (high / medium / low),
  - Estimated minutes badge,
  - Daily habit badge (🔥),
  - Subtask list (JSON-backed, editable one-per-line, tap to toggle) with progress bar.
- Optimistic status transitions with Reanimated (`LinearTransition`, `FadeInDown`, `FadeOut`).
- **Edit modal**: title, priority, estimated minutes, subtasks, and a "Daily Habit 🔥" toggle; delete with confirmation.

### Focus Mode Timer (Pomodoro)
- Countdown from a task's `estimatedMinutes` (defaults to 25 minutes).
- 10-second warning via notification + alert ("🔥 Keep Going!").
- On completion: confetti celebration (200 pieces), **+2 global streak** (once per day), and "Focus Session Complete! 🍅".
- Daily habits award **+1 streak per day** (guarded by `lastCompletedDate`).

### Auto-Schedule
- One-tap button that converts a task into a calendar event at the **next full hour**, styled in purple (`#9333EA`) with the description "Auto-scheduled task".

### Event Creation Modal
- Title, description, start/end datetime pickers (`@react-native-community/datetimepicker`), color picker, location, all-day toggle, recurrence rule field.
- Swipe-to-close support.
- Saves via `database.addEvent(...)` and schedules a local **event reminder** when permissions allow.

### Notifications (expo-notifications)
- Runtime permission request and notification init on app launch.
- **Daily 9:00 AM reminder** scheduled automatically at startup.
- **Per-event reminders** (`reminderMinutes` before event start).
- **Focus-mode warnings** (`sendFocusWarning()`).

### Streaks & Gamification
- Global streak counter persisted in SQLite, displayed across Calendar, Day, and Tasks screens.
- Earn points by completing focus sessions and daily habits; rewards are once-per-day guarded.

### Responsive UI
- Mobile / tablet / desktop breakpoints (`useBreakpoints`).
- Floating capsule-shaped tab bar (90% width on mobile, auto width on desktop) with a separate round **FAB** (+ button) for quick event creation.
- Desktop content is centered with a `maxWidth: 1024` container.

### Local Persistence
- **WatermelonDB** (0.28.0) on top of **expo-sqlite** — no backend required; all data lives on-device.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 54 (`~54.0.33`), React Native 0.81.5, React 19.1.0 |
| Navigation | expo-router 6 (file-based routing, typed routes) |
| Language | TypeScript (strict) |
| Styling | NativeWind 4 + Tailwind CSS 3, `tailwind-merge`, `clsx` |
| Database | WatermelonDB 0.28 + expo-sqlite 16 |
| Notifications | expo-notifications 0.32 |
| Date handling | date-fns 4 |
| Animations | react-native-reanimated 4, react-native-gesture-handler |
| Extras | expo-linear-gradient, expo-confetti (`react-native-confetti-cannon`), Outfit + SpaceMono fonts |

## Project Structure

```
CALENDER/
├── app/                          # expo-router routes
│   ├── _layout.tsx               # Root layout: fonts, splash, DB init, notifications, daily reminder
│   ├── +html.tsx                 # Web-only HTML shell (SSR)
│   ├── +not-found.tsx            # 404 screen
│   ├── modal.tsx                 # Event creation modal
│   └── (tabs)/
│       ├── _layout.tsx           # Tabs config: custom tab bar + header, FAB routing
│       ├── index.tsx             # Calendar month view
│       ├── add_event.tsx         # Dummy screen — tab press is intercepted → opens modal
│       ├── day.tsx               # Day agenda view
│       └── tasks.tsx             # Kanban task board
├── assets/                       # Icons, fonts, images
├── components/                   # Shared UI components
│   ├── ResponsiveContainer.tsx   # Desktop centering (maxWidth 1024)
│   ├── ResponsiveHeader.tsx      # Custom tab header
│   ├── ResponsiveTabBar.tsx      # Floating capsule tab bar + FAB
│   ├── EmptyState.tsx            # Empty-column state
│   ├── ExternalLink.tsx          # In-app browser link
│   ├── StyledText.tsx / Themed.tsx  # Themed text/view helpers
│   └── __tests__/                # Jest snapshot tests
├── constants/
│   ├── Colors.ts                 # Light/dark theme palette
│   └── Holidays.ts               # Indian holidays 2024–2026 + getUpcomingHoliday()
├── hooks/
│   └── useBreakpoints.ts         # Mobile / tablet / desktop breakpoints
├── app.json                      # Expo config (plugins, EAS project id, icons)
├── eas.json                      # EAS build profiles
├── tailwind.config.js            # Custom theme (green palette, radii, shadows, fonts)
├── babel.config.js               # babel-preset-expo + nativewind (jsxImportSource: nativewind)
├── metro.config.js               # Metro + NativeWind CSS input
├── global.css                    # Tailwind directives
└── tsconfig.json                 # Strict TS + @/* path alias (./*, ./src/*)
```

## Screens

| Route | Purpose |
|---|---|
| `/(tabs)/index` | Calendar month view with events, holidays, streak pill, GK banner |
| `/(tabs)/tasks` | Kanban task board + Focus Mode + Auto-Schedule |
| `/(tabs)/day` | Day agenda (create/edit/delete events) |
| `/modal` | Event creation modal (opened via the FAB or `add_event` tab) |

## Data Model

**Events** (`CalendarEvent`)
| Field | Type | Notes |
|---|---|---|
| `title` | string | |
| `description` | string | |
| `startAt` / `endAt` | epoch ms | |
| `status` | string | e.g. `'confirmed'` |
| `color` | string | Tailwind class (e.g. `bg-green-500`) or hex (e.g. `#9333EA`) |
| `isAllDay` | boolean | |
| `location` | string | |
| `recurrenceRule` | string | unused in current code |

**Tasks** (`Task`)
| Field | Type | Notes |
|---|---|---|
| `title` | string | |
| `status` | `'todo' \| 'in-progress' \| 'done'` | legacy `isCompleted` boolean also present |
| `priority` | `'low' \| 'medium' \| 'high'` | |
| `estimatedMinutes` | number | used by Focus Mode |
| `subtasks` | JSON string | `{ title, isCompleted }[]` |
| `isHabit` | boolean | awards +1 streak/day |
| `streak` | number | |
| `lastCompletedDate` | `'YYYY-MM-DD'` | once-per-day guard |

**Global streak** — a single aggregate counter (`addGlobalStreak(points)`) shown as the 🔥 pill.

**Holidays** — static dataset in `constants/Holidays.ts` (not persisted).

## Notifications System

All notification logic lives in `utils/notifications` (referenced from the app):
- `requestPermissions()` — runtime permission request.
- `initNotifications()` — notification channel/handler init.
- `scheduleDailyReminder(hour, minute)` — daily 9:00 AM reminder at startup.
- `scheduleEventReminder(title, startAt, reminderMinutes)` — per-event reminders.
- `sendFocusWarning()` — 10-second Focus Mode warning.

## Styling

NativeWind v4 with a custom green-centric theme (`tailwind.config.js`):

| Token | Value |
|---|---|
| `primary` | `#22C55E` |
| `accent` | `#16A34A` |
| `background` | `#FFFFFF` |
| `surface` | `#F8FFF9` |
| `text` / `soft` | `#1F2937` / `#6B7280` |
| `border` / `bubble` | `#E5F7EA` / `#DCFCE7` |
| Radius | `main 18px`, `card 22px`, `input 14px`, `button 999px` |
| Shadows | `bubble` (green glow), `soft` |
| Fonts | Outfit 400/500/700 (`font-sans/medium/bold`) |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app on a device, or Android/iOS simulator

### Install & Run

```bash
# Install dependencies
npm install

# Start the Expo dev server
npm start

# Platform-specific
npm run android
npm run ios
npm run web
```

### Building (EAS)

```bash
# Install EAS CLI
npm install -g eas-cli

# Development build
eas build --profile development

# Preview APK
eas build --profile preview --platform android

# Production build
eas build --profile production

# Production APK
eas build --profile production-apk --platform android
```

Profiles defined in `eas.json`:
- `development` — development client, internal distribution.
- `preview` — Android APK.
- `production` — store builds.
- `production-apk` — production APK.

## Configuration Notes

- **Typed routes** are enabled (`experiments.typedRoutes`) — route strings are type-checked.
- **New Architecture** is enabled (`newArchEnabled: true`).
- Android package: `com.manos.calender`; URL scheme: `calender://`.
- `tsconfig.json` path alias: `@/*` resolves to `./*` then `./src/*`.

## ⚠️ Important: Missing `src/` Directory

The codebase currently imports from `@/src/database`, `@/src/hooks/...`, `@/src/components/Calendar/...`, `@/src/utils/notifications` (and `@/database`), but **no `src/` directory exists in the repository**. As a result, the app will **not compile or run** until these modules are restored:

- `src/database` — WatermelonDB schema, models (`CalendarEvent`, `Task`), and API (`initDatabase`, `addEvent`, `addTask`, `updateTask`, `deleteTask`, `addGlobalStreak`).
- `src/hooks/` — `useEvents`, `useTasks`, `useGlobalStreak`.
- `src/components/Calendar/` — `CalendarHeader`, `WeekDaysHeader`, `MonthView`, `HolidayBanner`, `DailyGKBanner`, `DayView`, `EventModal`, `EventForm`.
- `src/utils/notifications` — `requestPermissions`, `initNotifications`, `scheduleDailyReminder`, `scheduleEventReminder`, `sendFocusWarning`.

## Roadmap

- Restore the missing `src/` database / hooks / components layer.
- Recurring event support (the `recurrenceRule` field is already in the model).
- Replace the hardcoded holiday dataset with a real holiday API.
- Push notification backend (remote notifications via EAS).

## License

Private project — all rights reserved.
