# Junglans Leads

A mobile CRM app built with **React Native (Expo)** for managing leads imported from Excel files. Designed for sales teams to import, track, call, and follow up on leads offline.

## Features

- **Excel Import** — Pick `.xlsx`/`.csv` files via the document picker, then map spreadsheet columns to lead fields (name, phone, course, etc.) with a visual mapping modal
- **Lead Management** — Browse leads per file with search, status filtering, and pagination
- **Lead Status Workflow** — Track leads through `Not Called`, `Called`, `Interested`, `Not Interested`, and `Follow Up` statuses
- **Call Integration** — Tap-to-call leads directly from the app
- **Notes & Activity Log** — Update notes and view a full activity history per lead (calls, status changes, note updates)
- **Excel Export** — Export any file's leads back to `.xlsx`
- **Backup & Restore** — Export a full JSON backup (files, leads, activities) and restore it on any device
- **Offline-first** — All data stored locally in SQLite (WAL mode, batched inserts, 10s query cache)
- **Haptics & Animations** — Native-feel interactions and polished UI animations

## Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Framework | Expo SDK 54, React Native 0.81, React 19    |
| Routing   | expo-router (typed routes)                  |
| Database  | expo-sqlite (SQLite with versioned migrations) |
| State     | zustand                                     |
| Excel     | xlsx (SheetJS)                              |
| Language  | TypeScript                                  |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- Expo Go app on your device, or an Android/iOS emulator

### Installation

```bash
npm install
```

### Run

```bash
npm start        # start Metro bundler
npm run android  # run on Android
npm run ios      # run on iOS
npm run web      # run in browser
```

Scan the QR code with Expo Go (Android) or the camera app (iOS) to launch the app.

## Project Structure

```
app/                    # expo-router screens
  (tabs)/               # tab navigation (Files, About)
    index.tsx           # Excel file list + import flow
    about.tsx           # About screen + backup/restore
  leads/[fileId].tsx    # leads list for a file
  lead/[leadId].tsx     # lead detail (status, notes, activity log)
  _layout.tsx           # root layout (DB init)
src/
  db/                   # SQLite layer
    database.ts         # schema + migrations
    excelFiles.ts       # file CRUD
    leads.ts            # lead CRUD, status counts, activity log
  utils/
    excelParser.ts      # pick + parse + column mapping
    exportToExcel.ts    # export leads to .xlsx
    backup.ts           # backup/restore JSON
    phoneCall.ts        # tel: link integration
    haptics.ts          # vibration helpers
    notifications.ts    # follow-up reminders (dev-build only)
  components/           # UI components (FileCard, LeadCard, FilterBar, ...)
  store/                # zustand app store
components/             # shared UI primitives
constants/              # theme/colors
```

## Database Schema

- `excel_files` — imported files (`id`, `file_name`, `upload_date`)
- `leads` — leads per file (`id`, `file_id` FK, `name`, `phone`, `course`, `status`, `notes`, `extra_fields` JSON, `created_date`, `last_called_date`)
- `activity_log` — per-lead history (`id`, `lead_id` FK, `action`, `details`, `created_at`)

Deleting a file cascades to its leads and activity logs. Schema is versioned via `PRAGMA user_version` with automatic column migrations.

## Known Limitations

- **Push notifications**: `expo-notifications` is unavailable in Expo Go on SDK 54+; follow-up reminders are stubbed to a friendly alert. Use a development build to enable them.
- Android 13+ (SDK 53/54) restricts the document picker from opening during splash/background — import must be triggered from a user tap.

## License

Private project.
