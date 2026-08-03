# Offline-First Notes App

A secure, offline-first notes application built with **React Native**, **Expo SDK 54**, and **SQLite**. It features dual-mode editing (Markdown & rich text), full-text search, tags, folders, hidden notes with biometric lock, note versioning, and a mock on-device AI assistant.

> This project uses native modules (`react-native-mmkv`, `expo-sqlite`, `react-native-reanimated`) and therefore requires a **Development Build** — it will not fully run in Expo Go.

---

## Deep Dive

### High-Level Architecture

The app follows a **layered / clean architecture** split into four concerns:

| Layer | Path | Responsibility |
|---|---|---|
| **Screens / Routing** | `app/`, `src/screens/` | Expo Router navigation, screen composition |
| **Components** | `src/components/` | Reusable UI (notes, folders, common) |
| **Domain** | `src/domain/` | Business entities and repository interfaces |
| **Data** | `src/data/` | Drizzle ORM schema, models, and concrete repositories |
| **Services** | `src/services/` | Encryption, biometrics, AI analysis |
| **State / Hooks** | `src/hooks/` | `zustand` state and custom hooks (auto-save, debounce) |
| **Theme** | `src/theme/` | Restyle theme + design tokens |

Dependency flow points **inward**: screens → components/hooks → repositories (via interface) → database. The domain layer never imports from `src/data`; repositories implement the `I*Repository` interfaces instead.

### Routing (`app/`)

Built with **Expo Router**:

| Route | Purpose |
|---|---|
| `_layout.tsx` | Root layout — initializes DB before rendering, theme + safe-area providers |
| `index.tsx` | Home screen — note list, search, folders |
| `note/[id].tsx` | Note detail / editor screen |
| `+not-found.tsx` | 404 fallback |

`_layout.tsx` blocks UI on a loading spinner until `getDatabase()` resolves, then fires `optimizeDatabase()` asynchronously so startup stays fast.

### Data layer (`src/data/`)

**Database** — `database.ts`
- Opens `notes_v2.db` via `expo-sqlite` and wraps it with **Drizzle ORM** (`drizzle-orm/expo-sqlite`).
- Applies `drizzle` **migrations** (`drizzle/migrations.js`) at startup.
- Tunes performance pragmas:
  - `journal_mode = WAL` — concurrent reads/writes without locking
  - `synchronous = NORMAL`
  - `temp_store = MEMORY`, `cache_size = 10000`
- A single lazily-initialized singleton instance is shared app-wide.
- **Note:** SQLCipher `PRAGMA key` is currently commented out for debugging (`database.ts:24`).

**Schema** — `schema.ts` (Drizzle SQLite tables):
- `notes` — soft-delete flags (`isDeleted`, `isArchived`, `isHidden`, `isPinned`), color, timestamps, `folderId`.
- `note_versions` — append-only content snapshots written on every update (cascades with the note).
- `tags` + `note_tags` — many-to-many tags.
- `attachments` — media (image/video) rows per note.
- `folders` & `smart_folders` — plain and query-driven folders.
- `operation_log` — append-only audit/outbox log for entities.
- **FTS5 full-text search** via `FTS_TRIGGERS_SQL`:
  - Creates a virtual table `notes_fts` mirroring `notes` via triggers (`notes_ai`, `notes_ad`, `notes_au`) so it stays in sync automatically. Search is delegated to `notes_fts MATCH ...` (see `search()` in `NoteRepository`).

**Repositories** — `NoteRepository.ts`
- All writes run inside transactions (note + tags + media atomically).
- `update()` snapshots the previous content into `note_versions` for history/undo.
- `getAll()` orders pinned notes first, then by `updatedAt desc`.
- `enrichNotes()` batch-loads tags and media for a list of notes in one pass (avoids N+1 queries).
- Filtering keeps hidden/deleted notes out of the default list; dedicated `getHidden()` / `getDeleted()` for those views.

### Services

- **Encryption** (`EncryptionService.ts`) — derives a DB key from a master key + salt stored in `expo-secure-store`, persisted with a SHA-256 `digestStringAsync`. Intended for SQLCipher (`PRAGMA key`).
- **Security** (`SecurityService.ts`) — biometric gating via `expo-local-authentication` plus an SHA-256-hashed password stored in Secure Store, used to protect the **hidden notes**.
- **AI** (`AIService.ts`) — mock NLP: keyword tag classification, regex extraction of action items / questions, and template summary generation. Swap for a real LLM/backend later.

### State & Editing experience

- **State:** `zustand` for client-side UI state; all persistent changes go through the repositories.
- **Auto-save:** `useAutoSave` debounces saves by **2 seconds**, with `flush()` on unmount (in `src/hooks/useAutoSave.ts`).
- **Two editor modes** per note: **Markdown** (`markdown-it` + toolbar) and **rich text** (`@10play/tentap-editor`), with color/splitter logic in `conversionUtils.ts` and `CursorMapper.ts`.
- **UI kit:** Restyle + theme tokens for responsive styling, FlashList for the note list, Reanimated + gesture-handler for swipes (`SwipeableNoteCard`), and a glassmorphism / bubble aesthetic.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Android Studio](https://developer.android.com/studio) (for Android emulator/device)
- JDK 17
- For iOS: macOS + Xcode

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run as a **development build** (required — native modules):

   ```bash
   # Android (Windows/Linux/macOS)
   npx expo run:android

   # iOS (macOS only)
   npx expo run:ios
   ```

3. Alternatively, use Metro with a dev client:

   ```bash
   npx expo start
   ```

## Troubleshooting

- **Missing native modules** (e.g., `react-native-mmkv`): always use `npx expo run:android`, not Expo Go.
- **Schema changes:** clear the app data or uninstall the app if you hit stale-schema errors.
- **No data → empty DB:** confirm `notes_v2.db` was created and migrations ran; enable the `PRAGMA key` line only if the DB is actually encrypted.

## Project Structure

```
app/                  # Expo Router screens
src/
  components/         # Reusable UI (common, folders, notes)
  data/               # Database (drizzle), models, repositories
  domain/             # Entities + repository contracts
  hooks/              # useAutoSave, useDebounce
  screens/            # Home, NoteDetail
  services/           # Encryption, Security, AI
  theme/              # Restyle theme tokens
  utils/              # conversions, cursor mapping
drizzle/              # Migrations + snapshots
__tests__/            # Tests
```