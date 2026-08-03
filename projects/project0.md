# Junglans Project Manager — Deep-Dive Technical Documentation

> **A local-first Electron desktop application for cataloging, analyzing, and documenting software projects.**
>
> This README is a comprehensive, line-level technical reference for the codebase. It documents every module, every IPC channel, every database table and migration, every service method, every Zustand store action, every page and component, plus the AI pipeline, testing strategy, build pipeline, troubleshooting guide, and FAQ. If you are a new contributor, start with [Part 1](#part-1-overview--architecture). If you are debugging a specific subsystem, jump straight to the part that covers it (the table of contents below links to each).

---

## Table of Contents

**Part 1 — Overview & Architecture**
1. [Project Identity](#11-project-identity)
2. [What This Application Does](#12-what-this-application-does)
3. [Feature Overview](#13-feature-overview)
4. [Technology Stack](#14-technology-stack)
5. [High-Level System Architecture](#15-high-level-system-architecture)
6. [Process Model: Main vs. Renderer](#16-process-model-main-vs-renderer)
7. [The IPC Contract Pattern](#17-the-ipc-contract-pattern)
8. [Repository Layout](#18-repository-layout)
9. [Getting Started (Development)](#19-getting-started-development)
10. [Configuration & Environment Variables](#110-configuration--environment-variables)

**Part 2 — Electron Main Process, IPC & Database**
11. [Electron Main Process (`electron/main.ts`)](#211-electron-main-process-electronmaints)
12. [Preload Bridge (`electron/preload.ts`)](#212-preload-bridge-electronpreloadts)
13. [IPC Handler Groups (`electron/ipc/`)](#213-ipc-handler-groups-electronipc)
14. [Database Layer (`database/db.ts`)](#214-database-layer-databasedbts)
15. [Schema & Row Types (`database/schema.ts`)](#215-schema--row-types-databaseschematsts)
16. [Migrations Folder — Contents & Drift](#216-migrations-folder--contents--drift)

**Part 3 — Services Layer**
17. [Services: Common Patterns](#317-services-common-patterns)
18. [ActivityService](#318-activityservice)
19. [ProjectScannerService](#319-projectscannerservice)
20. [AnalyticsService](#320-analyticsservice)
21. [NotificationService](#321-notificationservice)
22. [ProjectManager](#322-projectmanager)
23. [OllamaService](#323-ollamaservice)
24. [GitHubService](#324-githubservice)
25. [TimelineService](#325-timelineservice)
26. [MarkdownExporter](#326-markdownexporter)
27. [GitService](#327-gitservice)
28. [HealthService](#328-healthservice)
29. [FileWalker](#329-filewalker)
30. [GeminiService](#330-geminiservice)
31. [OpenRouterService](#331-openrouterservice)
32. [TeamService](#332-teamservice)
33. [ProjectNotesService & ProjectTemplateManager](#333-projectnoteservice--projecttemplatemanager)
34. [AnalysisService](#334-analysisservice)
35. [CriticalPathCalculator](#335-criticalpathcalculator)
36. [Service Tests](#336-service-tests)

**Part 4 — Stores, Types & UI**
37. [State Management with Zustand](#437-state-management-with-zustand)
38. [Type Modules (`src/types/`)](#438-type-modules-srctypes)
39. [Pages (`src/pages/`)](#439-pages-srcpages)
40. [Components (`src/components/`)](#440-components-srccomponents)
41. [Theming System (`src/index.css`)](#441-theming-system-srcindexcss)
42. [GlobalSearch & App Shell](#442-globalsearch--app-shell)

**Part 5 — AI, Notifications, Testing, Build, Troubleshooting, FAQ**
43. [The AI Pipeline](#543-the-ai-pipeline)
44. [The Notification System](#544-the-notification-system)
45. [Testing Strategy](#545-testing-strategy)
46. [Build, Packaging & Distribution](#546-build-packaging--distribution)
47. [Troubleshooting Guide](#547-troubleshooting-guide)
48. [Frequently Asked Questions (FAQ)](#548-frequently-asked-questions-faq)
49. [Known Issues & Gotchas](#549-known-issues--gotchas)
50. [Roadmap](#550-roadmap)

---

# PART 1 — OVERVIEW & ARCHITECTURE

---

## 1.1 Project Identity

| Field | Value |
|---|---|
| Product name | **Junglans Project Manager** |
| Package name | `project-manager` (see `package.json`) |
| Version | `1.2.0` |
| License | MIT |
| Author | Manosakthi |
| Main entry | `dist-electron/main.js` (compiled Electron main process) |
| App userData directory | `%APPDATA%\project-manager` on Windows |
| Database file | `%APPDATA%\project-manager\project-manager.db` (SQLite via sql.js WASM) |
| Release homepage | GitHub Releases — download the installer `.exe` |
| Architecture docs | This README supersedes `PROJECT_MANAGEMENT_ARCHITECTURE_FINAL.md` (see §16.3 for inaccuracies in that file) |

The application is branded **"Junglans"** throughout the UI (sidebar brand text "Junglans / Project Manager", window title `Junglans Project Manager`, X-Title header sent to OpenRouter, localStorage key `junglans-settings`, backup file names `junglans-backup-<date>.db`, and the User-Agent `ProjectManager-HealthCheck/1.0` used for health checks).

### 1.1.1 The name

The `package.json` `name` field is `project-manager`, and because the `productName` field is absent, Electron derives the app name from `name` — which is why the userData path and the electron-log folder are named `project-manager` rather than `Junglans Project Manager`. If you rename the app in the future, remember that the userData path, database path, and log path all depend on this value; changing it silently creates a brand-new, empty data folder for existing users.

---

## 1.2 What This Application Does

Junglans Project Manager is a **local-first desktop tool** aimed at developers and students who juggle many side projects and need a single place to:

1. **Catalog projects** — keep a central registry of every software project on disk (name, folder path, project type, category, tags, GitHub link, hosting link, docs).
2. **Track time** — log daily working hours per project and per team member, summarized weekly, exportable to Excel.
3. **Plan milestones** — build a milestone/timeline plan per project, with dependencies, phases, workflow statuses, priorities, and critical-path analysis.
4. **Analyze codebases** — scan a folder to get a file tree, storage statistics, language breakdown, code metrics (LOC, function/class/import counts), duplicate-file detection, dead-file detection, and Mermaid dependency graphs.
5. **Monitor web health** — check hosted URLs for uptime, response time, HTTP status codes, and SSL certificate expiry; store a rolling history of checks.
6. **Integrate with GitHub** — link repos, fetch metadata (stars, forks, language, visibility), browse branches/commits/files via the GitHub API, and detect GitHub Pages.
7. **Generate AI reports** — produce comprehensive Markdown project documentation from the source tree using one of three engines: local **Ollama**, cloud **Gemini**, or **OpenRouter**.
8. **Notify** — a background scheduler polls hosted projects, GitHub repos, and daily activity, then raises in-app + native OS notifications with priorities.
9. **Export** — Markdown project reports (summary/tech-stack/architecture/health/full) and multi-sheet Excel reports (activity weekly log, analytics overview).

Everything is stored **locally**. There is no account system, no telemetry, and no cloud synchronization. External network calls are made only for: GitHub API requests (explicit user actions or the background GitHub check), health checks against user-provided URLs, and AI report generation when the user chooses a cloud engine (Gemini/OpenRouter).

---

## 1.3 Feature Overview

### 1.3.1 Dashboard (`/`)
- Project cards with staggered entry animation, status/health badges, tech stack chips, tags, GitHub stars, document counts.
- Project filtering: search by name/folder path/tech stack/category/tags, filter by type, toggle archived visibility (see `Dashboard.tsx`, `ProjectCard.tsx`).

### 1.3.2 Add Project (`/add`)
- Full creation form: name, folder path (native folder picker), type (webapp/desktop/mobile/api/library), primary category, predefined + custom tags, GitHub URL, hosted URL + hosted flag, optional documents, estimated hours, priority.
- Project template picker (`window.api.template.list()`) that pre-fills the form from a saved template (see `AddProject.tsx`, `ProjectTemplateManager`).

### 1.3.3 Project Detail (`/project/:id`)
A tabbed page (`ProjectDetail.tsx`, 1,386 lines) with up to ten tabs:

| Tab | Contents |
|---|---|
| Overview | Metadata, status, category, tags, tech stack, dates, priority, estimated hours, GitHub metadata panel, hosting info, notes, documents list |
| Git | `GitHubPanel` — stars/forks/issues/visibility/language/license/last push/topics + link |
| Worktime | `InteractiveWorkTimeTrend` — hours/commits trend (area/bar/line, metric switch) |
| Storage | `CodebaseCompositionTreemap` — category distribution + storage stats |
| Health | `HealthPanel` — live health check, SSL, response-time history chart, health logs |
| Analysis | Webpage analysis result (SEO/performance/tech stack) + codebase audit |
| AI Report | `AIPanel` — streaming AI report generation with three engines |
| Export | `ExportButtons` — all Markdown export formats with per-type state machine |
| Documents | `DocumentList` — attached docs, add/read/delete, AI-generated badge |
| (Activity / Milestones) | Per-project activity logs and milestone planning controls |

### 1.3.4 Activity Log (`/activity`)
- Weekly view (Monday–Sunday navigation), per-day rows with in/out times (defaults 09:00 / 17:00), statuses working/holiday/leave, project + member assignment.
- Summary block: total hours, working days, holiday days, leave days (priority `working > holiday > leave` per date).
- Excel export `Weekly_Activity_Log_<start>_to_<end>.xlsx` with styled rows and a formula-based hours total.

### 1.3.5 Kanban Board (`/kanban`)
- Six workflow columns (Backlog, Planned, In Progress, Testing, Deployment Ready, Completed) with HTML5 drag-and-drop; cards grouped by milestone; clicking a card opens its detail (see `KanbanBoard.tsx`).

### 1.3.6 Analytics (`/analytics`)
- `DashboardSummary` from the main process: project metrics (totals, hosted, GitHub-connected, docs coverage, attention-required), team metrics (contributors, weekly/monthly hours, productivity score), dev metrics (commit counts, recent commits, doc/AI coverage), category + tag distributions.
- Visuals: category donut (`InteractiveCategoryDistribution`), GitHub-style activity heatmap (`InteractiveActivityHeatmap`), work-time trend (`InteractiveWorkTimeTrend`).
- Multi-sheet Excel export (`Analytics_Report_<start>_to_<end>.xlsx`: Overview Summary, Projects List, Team Timesheet, Recent Commits).

### 1.3.7 Timeline & Planning (`/timeline`)
- `PHASES` lifecycle pipeline (10 phases: Idea → Completed) with milestone counts and click-to-filter.
- `InteractiveGanttChart` — pure-CSS Gantt with days/weeks/months zoom, hover cross-highlighting, progress overlays.
- `TeamWorkloadMatrix` — per-member workload vs. 40h weekly capacity with overload detection.
- `MilestoneBudgetTracker` — planned vs. logged cost with an hourly rate (default $65/h).
- `AIWBSGeneratorModal` — simulated AI Work Breakdown Structure generator (client-side mock, 6 waterfall items, 32 days total).
- Milestone CRUD with dependencies, phases, workflow statuses, priorities, and critical-path analytics (`calculateCriticalPath`).

### 1.3.8 Project Explorer (`/explorer`)
- Full recursive file tree with per-folder/file stats (size, counts, dates), hidden-file toggle.
- File detail drawer: SHA-256, permissions, owner, line/function/class/import counts, last git author/date, syntax-highlighted content (mono/plain), Mermaid dependency graph.
- Codebase audits: duplicate files (SHA-256 groups) and dead files (zero inward imports).
- AI file explanation via the selected provider (Gemini/OpenRouter), streamed nowhere — returned as plain text.

### 1.3.9 Documentation (`/docs`)
- A static in-app documentation page describing the product (74 lines; content-only, no interactivity).

### 1.3.10 GitHub Integration (`/github`)
- Three view modes: **Scopes** (token validation, rate limits, user profile), **Repos** (paginated repo browser with search), **Repo Detail** (files/commits/branches tabs with directory navigation).
- Token management: paste token → `window.api.github.setToken` → validated via `checkTokenScopes`.

### 1.3.11 Notifications (`/notifications`)
- Inbox with category/priority filters, mark read/all-read, delete/clear, live push updates, desktop `Notification` permission flow, Web-Audio synthesized sounds per priority, toast stack (5.5 s auto-dismiss).

### 1.3.12 Settings (`/settings`)
- GitHub token + expiry, Gemini API key, OpenRouter API key — persisted via zustand `persist` in localStorage (`junglans-settings`), pushed to main via `window.api.github.setToken` on change.
- Database info/backup/restore actions are available from the DB section of the UI (via `window.api.database.*`).

---

## 1.4 Technology Stack

### 1.4.1 Runtime & framework

| Layer | Technology | Version (from `package.json`) |
|---|---|---|
| Desktop shell | Electron | ^29.1.0 |
| UI framework | React | ^18.2.0 |
| Language | TypeScript | ^5.3.3 |
| Build tool | Vite | ^5.1.4 |
| Electron integration | vite-plugin-electron | ^0.28.4 |
| State management | Zustand | ^4.5.0 |
| Routing | react-router-dom (HashRouter) | ^6.22.0 |
| Styling | Tailwind CSS | ^3.4.1 |
| Database | sql.js (SQLite compiled to WebAssembly) | ^1.10.0 |
| HTTP client | Axios | ^1.6.7 |
| Charts | Recharts | ^2.12.0 |
| Markdown rendering | react-markdown + remark-gfm | ^9.0.1 / ^4.0.0 |
| Icons | lucide-react | ^0.344.0 |
| Excel export | exceljs | ^4.4.0 |
| AI | @google/generative-ai | ^0.24.1 |
| Logging | electron-log | ^5.1.1 |
| Testing | Vitest | ^4.1.8 |

### 1.4.2 Noteworthy dependency decisions

- **sql.js instead of better-sqlite3.** The original architecture document describes `better-sqlite3` (a native module), but the shipped app uses **sql.js** — SQLite compiled to WebAssembly. This means **no native module compilation** on install (`npm install` works everywhere), but also means the whole database lives in RAM and every write re-exports the full file to disk (see §2.14.5 for the deep dive and performance implications).
- **Radix UI primitives.** `@radix-ui/react-dialog`, `dropdown-menu`, `label`, `select`, `slot`, `switch`, `tabs`, `toast`, `tooltip` are installed and used by various pages (e.g. dialogs/modals, tabs in `ProjectDetail`).
- **class-variance-authority + clsx + tailwind-merge.** Installed for the `cn()` class-merge utility pattern (though the codebase mostly uses plain template literals).
- **gray-matter + unified/remark-parse/remark-stringify.** Installed for Markdown front-matter parsing/generation (used in report generation flows).
- **dotenv** loads a `.env` file from `process.cwd()` at the very top of `electron/main.ts` — the only runtime env source besides the OS environment.
- **vite-plugin-electron-renderer** allows the renderer to import Electron-only modules during development (though the app is architected around the preload bridge, so this is rarely exercised).

### 1.4.3 Scripts

| Script | Command | What it does |
|---|---|---|
| `dev` | `vite` | Start the Vite dev server only (renderer) |
| `build` | `tsc && vite build` | Typecheck-and-compile main + build renderer |
| `preview` | `vite preview` | Preview the built renderer |
| `electron:dev` | `concurrently "vite" "wait-on http://localhost:5173 && electron ."` | Full dev mode: Vite + Electron loading `http://localhost:5173` |
| `electron:build` | `npm run build && electron-builder` | Production build + package (see `electron-builder.yml`) |
| `typecheck` | `tsc --noEmit` | Static type checking |
| `lint` | `eslint src/ electron/ services/ database/` | Lint all TypeScript source trees |
| `test` | `vitest run` | Run the unit tests (Vitest) |

---

## 1.5 High-Level System Architecture

The application follows the canonical **Electron three-layer architecture**, with a strict one-way data flow enforced through the preload bridge:

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        RENDERER PROCESS (React)                            │
│                                                                            │
│   Pages (Dashboard, ProjectDetail, Timeline, Explorer, ...)                │
│        │                                                                   │
│        ▼                                                                   │
│   Zustand Stores (activity, project, timeline, analytics, health,          │
│                   explorer, settings, notification, team, report)          │
│        │                                                                   │
│        ▼                                                                   │
│   window.api.*   ← typed bridge (contextBridge, contextIsolation ON)       │
└────────────────────────────────┬───────────────────────────────────────────┘
                                 │  ipcRenderer.invoke(channel, args)
                                 │  ipcRenderer.on('ai:chunk' | 'notification:received')
                                 ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                        MAIN PROCESS (Node/Electron)                        │
│                                                                            │
│   electron/main.ts ── registers ──► electron/ipc/*Handlers.ts (16 files)   │
│        │                                       │                           │
│        │                                       ▼                           │
│        │                           services/* (18 services, singletons)    │
│        │                                       │                           │
│        │                                       ▼                           │
│        │                          database/db.ts (sql.js wrapper)          │
│        │                                       │                           │
│        ▼                                       ▼                           │
│   NotificationScheduler ──► ┌────────────── SQLite (WASM) ──────────────┐  │
│                             │  %APPDATA%\project-manager\project-manager.db│
│                             └──────────────────────────────────────────┘  │
└────────────────────────────────┬───────────────────────────────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
   GitHub API (REST)      Ollama (localhost:11434)   Target websites
   api.github.com         Gemini / OpenRouter        (health checks)
```

### 1.5.1 The unidirectional contract

1. The **renderer never touches Node.js APIs, the filesystem, or the network directly.** All privileged work happens in the main process.
2. Every capability is exposed through `window.api` (typed in `electron.d.ts` as `ElectronAPI`), which is built by `contextBridge.exposeInMainWorld('api', ...)` in `electron/preload.ts`.
3. Almost every method is a **request/response** call: `ipcRenderer.invoke(channel, ...args)` → `ipcMain.handle(channel, handler)` → returns a promise.
4. Two channels are **push/event** (main → renderer, one-way `webContents.send`):
   - `ai:chunk` — streamed AI report text chunks.
   - `notification:received` — a newly created notification.
5. **State flows downward** from stores to components; mutations flow upward through `window.api` to services to SQLite.

### 1.5.2 Why the preload bridge matters

`webPreferences` in `main.ts` set:
- `contextIsolation: true` — the preload runs in an isolated world; the page cannot access the bridge internals.
- `nodeIntegration: false` — the page has no Node globals.
- `sandbox: false` — the preload can use full Node (needed for `require` of the project modules; see §2.11.3 for security notes).

This is the standard modern Electron security posture: **the renderer is treated as untrusted and can only do what `window.api` explicitly exposes.**

---

## 1.6 Process Model: Main vs. Renderer

### 1.6.1 Main process responsibilities

| Responsibility | Implementation |
|---|---|
| Window lifecycle | `app.whenReady()`, `createWindow()`, `window-all-closed`, `before-quit`, `activate` (macOS) |
| Native dialogs | Folder picker, file picker, save dialogs (Markdown, Excel, DB backup/restore) |
| Database | `initDatabase()` at startup, all migrations, synchronous query wrapper |
| Business logic | 18 services (see Part 3) |
| IPC | 90 `ipcMain.handle` channels across 17 registration functions (16 files + main.ts) |
| Background scheduler | `notificationService.startScheduler()` — health/SSL/GitHub/reminder checks every 5 minutes |
| OS integration | Native notifications, taskbar flash (`flashFrame`), app badge count, frameless-window overlay controls |
| Logging | electron-log → console (debug) + file (`%APPDATA%\project-manager\logs\main.log`) |

### 1.6.2 Renderer responsibilities

- Rendering all pages and components (React + Tailwind).
- Keeping UI state in Zustand stores.
- Orchestrating IPC calls through `window.api`.
- Managing local UI preferences: theme (light/dark, `localStorage['theme']`), notification audio flag (`pm_audio_notifications`), global search history (`global_search_history`), and persisted settings (`junglans-settings`).

### 1.6.3 Window characteristics

| Property | Value |
|---|---|
| Width / Height | 1400 × 900 |
| Min width / height | 1000 × 700 |
| Frame | `false` (frameless) with `titleBarStyle: 'hidden'` and `titleBarOverlay` (36 px white strip, dark symbols `#1f2937`) |
| Background | `#ffffff` (avoids white flash, shown only after `ready-to-show`) |
| DevTools | Auto-opened detached in dev mode |
| URL (dev) | `http://localhost:5173` (from `VITE_DEV_SERVER_URL`) |
| URL (prod) | `file://…/dist/index.html` |

---

## 1.7 The IPC Contract Pattern

### 1.7.1 Anatomy of a channel

Every feature follows the same 5-step pattern:

1. **Service** implements the logic (e.g. `activityService.getLogs(start, end)`).
2. **Handler** file (`electron/ipc/activityHandlers.ts`) registers `ipcMain.handle('activity:list', …)`, wraps in try/catch, logs failures with `[IPC] <channel> failed:`, and mostly rethrows.
3. **Preload** exposes `window.api.activity.list(startDate?, endDate?)` → `ipcRenderer.invoke('activity:list', …)`.
4. **Type declarations** (`electron.d.ts`) declare the `ElectronAPI` interface so the renderer is fully typed.
5. **Store** calls `window.api.activity.list(...)` in an async action and updates state.

### 1.7.2 Channel naming conventions

- Namespaces mirror domains: `project:`, `github:`, `git:`, `health:`, `ai:`, `export:`, `dialog:`, `activity:`, `team:`, `analytics:`, `notification:`, `search:`, `database:` (channels `db:*`), `timeline:`, `explorer:`, `template:`, `note:`, `window:`.
- Channel names are **camelCase for the action** after the namespace (e.g. `project:hardDelete`, `timeline:updateProjectPlanning`, `notification:markAllRead`).

### 1.7.3 Error propagation contract

- Handlers **rethrow** after logging → the renderer promise rejects with an `Error` whose message comes from the service (or the generic IPC error wrapper).
- A few handlers **swallow** errors and return default values instead (documented per-channel in Part 2): `github:validateRepo` → `false`, `github:detectPages` → `{ hasPages: false }`, `git:*` → falsy defaults, `health:ssl` → `{ valid: false, expiry: null }`, `notification:list` → `[]`, `analytics:getProjectAnalytics` → `null`, `search:global` → `[]`, `template:list` → `[]`, `note:get` → `null`, `activity:getTotalHoursByProject` → `0`.

### 1.7.4 The two push channels (detail)

**`ai:chunk`** — set up in `electron/ipc/aiHandlers.ts`:
```ts
const window = BrowserWindow.fromWebContents(event.sender);
// inside the streaming callback:
if (!isCancelled) window.webContents.send('ai:chunk', chunk);
```
The renderer subscribes via `window.api.ai.onChunk(cb)` and must remember to call `window.api.ai.removeChunkListener()` (the reportStore does this in a `finally` block). Cancellation (`ai:cancelStream`) flips a module-global `isCancelled` flag — the underlying HTTP stream is NOT aborted (see §5.43.5 for the gap analysis).

**`notification:received`** — sent from `NotificationService.broadcast()` after every `create()`, to every `BrowserWindow` in `BrowserWindow.getAllWindows()` that is not destroyed. The renderer appends it to the inbox, plays a synthesized sound, shows a browser `Notification`, and pushes a toast.

---

## 1.8 Repository Layout

```
PROJECT_MANAGEMENT/
├── assets/                      # icon.png (window icon)
├── database/
│   ├── db.ts                    # 821 lines — sql.js bootstrap, wrapper classes, 13 migrations
│   ├── schema.ts                # 99 lines — TypeScript row interfaces (NOT DDL)
│   └── migrations/              # 5 orphaned .sql files (NOT read at runtime — see §2.16)
│       ├── 001_create_projects.sql
│       ├── 002_create_health_logs.sql
│       ├── 003_create_documents.sql
│       ├── 004_create_activity_logs.sql
│       └── 005_add_project_status_and_team_members.sql
├── dist/                        # Vite renderer build output (generated)
├── dist-electron/               # Compiled main-process output (generated)
├── dist-app/                    # electron-builder installer output (generated)
├── electron/
│   ├── main.ts                  # 180 lines — app lifecycle, window, dialog + window IPC
│   ├── preload.ts               # 173 lines — contextBridge → window.api (88 methods, 2 listeners)
│   ├── sql.d.ts                 # 19 lines — minimal hand-written sql.js type shim
│   ├── electron.d.ts            # 236 lines — ElectronAPI types for the renderer
│   └── ipc/                     # 16 handler files, 85 channels
│       ├── aiHandlers.ts        # Gemini/OpenRouter/Ollama streaming + cancel (168 lines)
│       ├── activityHandlers.ts  # activity CRUD + weekly Excel export (93 lines)
│       ├── analyticsHandlers.ts # summary, project analytics, Excel export (55 lines)
│       ├── dbHandlers.ts        # DB info/backup/restore (106 lines)
│       ├── explorerHandlers.ts  # scan, file details, explain, audit, mermaid (77 lines)
│       ├── exportHandlers.ts    # 5 Markdown reports + save dialog (91 lines)
│       ├── gitHandlers.ts       # local git introspection (43 lines)
│       ├── githubHandlers.ts    # GitHub REST proxy (130 lines)
│       ├── healthHandlers.ts    # check, ssl, analyze, logs (63 lines)
│       ├── notificationHandlers.ts (90 lines)
│       ├── noteHandlers.ts      # project notes (34 lines)
│       ├── projectHandlers.ts   # project + document CRUD (122 lines)
│       ├── searchHandlers.ts    # global search (134 lines)
│       ├── teamHandlers.ts      # team members (51 lines)
│       ├── templateHandlers.ts  # project templates (43 lines)
│       └── timelineHandlers.ts  # milestones + planning (73 lines)
├── services/                    # 18 services + 3 test files (~6,300 lines)
│   ├── ActivityService.ts       # 447  — work log CRUD + weekly Excel
│   ├── AnalysisService.ts       # 223  — HTTP webpage analysis (SEO/tech/links)
│   ├── AnalyticsService.ts      # 671  — dashboard aggregation + 4-sheet Excel
│   ├── FileWalker.ts            # 268  — source discovery + LLM context builder
│   ├── GeminiService.ts         # 83   — Google Gemini streaming reports
│   ├── GitHubService.ts         # 388  — GitHub REST wrapper
│   ├── GitService.ts            # 111  — local git CLI wrapper
│   ├── HealthService.ts         # 192  — HTTP + TLS health checks
│   ├── MarkdownExporter.ts      # 269  — Markdown report generators
│   ├── NotificationService.ts   # 508  — inbox, scheduler, checks
│   ├── OllamaService.ts         # 451  — local LLM streaming reports
│   ├── OpenRouterService.ts     # 132  — OpenRouter streaming reports
│   ├── ProjectManager.ts        # 385  — project + document CRUD
│   ├── ProjectNotesService.ts   # 50   — per-project notes (object literal)
│   ├── ProjectScannerService.ts # 713  — FS tree, stats, metrics, audits
│   ├── ProjectTemplateManager.ts# 113  — templates (object literal)
│   ├── TeamService.ts           # 131  — team member CRUD
│   ├── TimelineService.ts       # 410  — milestones, deps, planning, analytics
│   ├── GitHubService.test.ts    # 115  — Vitest
│   ├── HealthService.test.ts    # 89   — Vitest
│   └── ProjectManager.test.ts   # 120  — Vitest
├── src/                         # renderer (React)
│   ├── App.tsx                  # 156 lines — routes, shell, toasts, IPC listeners
│   ├── main.tsx                 # 10 lines — createRoot entry
│   ├── index.css                # 581 lines — Tailwind + theming system
│   ├── components/              # 20 components (~3,400 lines)
│   │   ├── AIPanel.tsx          # 235
│   │   ├── AIWBSGeneratorModal.tsx # 239
│   │   ├── CodebaseCompositionTreemap.tsx # 135
│   │   ├── DependencyGraph.tsx  # 212
│   │   ├── DocumentList.tsx     # 106
│   │   ├── ErrorBoundary.tsx    # 60
│   │   ├── ExportButtons.tsx    # 93
│   │   ├── GitHubPanel.tsx      # 120
│   │   ├── GlobalSearch.tsx     # 261
│   │   ├── HealthPanel.tsx      # 163
│   │   ├── InteractiveActivityHeatmap.tsx # 375
│   │   ├── InteractiveCategoryDistribution.tsx # 164
│   │   ├── InteractiveGanttChart.tsx # 223
│   │   ├── InteractiveWorkTimeTrend.tsx # 207
│   │   ├── MilestoneBudgetTracker.tsx # 100
│   │   ├── ProjectCard.tsx      # 143
│   │   ├── ProjectPhasePipeline.tsx # 157
│   │   ├── Sidebar.tsx          # 116
│   │   ├── TeamWorkloadMatrix.tsx # 119
│   │   └── TechStackBadges.tsx  # 46
│   ├── pages/                   # 12 pages (~8,000 lines)
│   │   ├── ActivityLog.tsx      # 684
│   │   ├── AddProject.tsx       # 488
│   │   ├── AnalyticsDashboard.tsx # 431
│   │   ├── Dashboard.tsx        # 194
│   │   ├── Documentation.tsx    # 74
│   │   ├── Explorer.tsx         # 1002
│   │   ├── GitHubIntegration.tsx# 1007
│   │   ├── KanbanBoard.tsx      # 344
│   │   ├── Notifications.tsx    # 505
│   │   ├── ProjectDetail.tsx    # 1386
│   │   ├── Settings.tsx         # 190
│   │   └── Timeline.tsx         # 1326
│   ├── store/                   # 10 Zustand stores (~1,600 lines)
│   │   ├── activityStore.ts     # weekly logs, week range
│   │   ├── analyticsStore.ts    # dashboard summary + dates
│   │   ├── explorerStore.ts     # tree, stats, file details, audits, AI explain
│   │   ├── healthStore.ts       # per-project health/analysis results
│   │   ├── notificationStore.ts # inbox, unread count, toasts, audio
│   │   ├── projectStore.ts      # project list + selection
│   │   ├── reportStore.ts       # AI streaming state, engines, models
│   │   ├── settingsStore.ts     # persisted API keys/token (persist middleware)
│   │   ├── teamStore.ts         # team members
│   │   └── timelineStore.ts     # milestones, analytics, zoom/filters
│   ├── types/                   # 10 type modules
│   │   ├── Activity.ts  Analytics.ts  Explorer.ts  GitHub.ts  Health.ts
│   │   ├── Milestone.ts Notification.ts  Project.ts  Report.ts  Team.ts
│   └── utils/
│       ├── CriticalPathCalculator.ts # 113 — CPM forward/backward pass
│       └── CriticalPathCalculator.test.ts # 61 — Vitest
├── .env.example                 # GITHUB_TOKEN etc. (template)
├── electron-builder.yml         # packaging config
├── vite.config.ts               # Vite + electron plugin config
├── vitest.config.ts             # Vitest config
├── tsconfig.json                # TypeScript config
├── eslint.config.js             # ESLint 9 flat config
├── package.json                 # v1.2.0, scripts, dependencies
├── PROJECT_MANAGEMENT_ARCHITECTURE_FINAL.md  # legacy arch doc (1086 lines, partly outdated)
├── testing_report.md            # QA summary (59 lines)
├── report.md                    # technical report (1445 lines)
└── README.md                    # this file
```

### 1.8.1 Directory conventions

| Directory | Process | Purpose |
|---|---|---|
| `electron/` | Main | App lifecycle, window management, IPC, preload |
| `services/` | Main | All business logic (singletons, see Part 3) |
| `database/` | Main | DB bootstrap, migrations, schema types |
| `src/` | Renderer | React application (pages, components, stores, types, css) |
| `assets/` | Both | Static assets (window icon) |
| `dist/`, `dist-electron/` | Build | Generated outputs (never committed) |
| `dist-app/` | Build | Packaged installers (generated) |

### 1.8.2 What does NOT exist (important for orientation)

- No `src/lib/`, no `src/hooks/` directories.
- No `src/types/Timeline.ts` — timeline types live in `src/types/Milestone.ts`.
- No `src/types/Settings.ts` — the settings store imports no type module.
- No `hooks/` directory in the architecture doc's directory tree (it describes `store/` and `types/` only).
- No `report.ipc.ts` — report generation is handled by `exportHandlers.ts` + `aiHandlers.ts`.

---

## 1.9 Getting Started (Development)

### 1.9.1 Prerequisites

| Tool | Version | Why |
|---|---|---|
| Node.js | ≥ 18 | Vite 5 requires it; Electron 29 bundles Node 20 |
| npm | ≥ 9 | package manager |
| Git | any | for `git` service features (commit counts, contributors, file history) |
| Ollama | optional | local AI engine (`ollama serve`, `ollama pull llama3`) |

### 1.9.2 Setup commands

```bash
git clone <repository-url>
cd PROJECT_MANAGEMENT
npm install
```

If you want GitHub integration without pasting a token in Settings:
```bash
cp .env.example .env
# edit .env — set GITHUB_TOKEN=ghp_...
```

### 1.9.3 Run in development

```bash
npm run electron:dev
```

This starts the Vite dev server on `http://localhost:5173`, waits for it, then launches Electron pointing at it. Detached DevTools open automatically (`webContents.openDevTools({ mode: 'detach' })`).

**Important:** the first `electron:dev` run creates the SQLite database at `%APPDATA%\project-manager\project-manager.db`. The 13 migrations run automatically. If the app never opens a window, see §5.47 (Troubleshooting) — startup is all-or-nothing: any migration failure aborts the entire launch.

### 1.9.4 Run tests, typecheck, lint

```bash
npm test              # Vitest unit tests (GitHubService, HealthService, ProjectManager, CriticalPathCalculator)
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint (currently: 8 errors + ~288 warnings, mostly no-explicit-any)
```

### 1.9.5 Build for production

```bash
npm run electron:build
```

This runs `tsc && vite build` (compiling the main process to `dist-electron/` and the renderer to `dist/`), then `electron-builder` packages the app (see §5.46 for the electron-builder.yml details).

---

## 1.10 Configuration & Environment Variables

### 1.10.1 `.env` file

Loaded by `dotenv.config()` at the top of `electron/main.ts` — **before any other import executes** — so environment values are available when services are constructed (OllamaService reads env in its constructor).

| Variable | Default | Used by | Purpose |
|---|---|---|---|
| `GITHUB_TOKEN` | — | `main.ts` → `githubService.setToken()` | Pre-seeded GitHub token for the session (in-memory only) |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | `OllamaService` | Where Ollama is served |
| `OLLAMA_DEFAULT_MODEL` | `llama3` | `OllamaService` | Default model when none selected |
| `LOG_LEVEL` | `info` | `main.ts` | electron-log file transport level (error/warn/info/debug) |

### 1.10.2 Where things live at runtime (Windows)

| Item | Path |
|---|---|
| Database | `%APPDATA%\project-manager\project-manager.db` |
| Logs | `%APPDATA%\project-manager\logs\main.log` |
| AI reports (IPC handler path) | `<project folder>\.junglans\reports\Architecture_Report_<timestamp>.md` |
| AI reports (OllamaService path) | `<project folder>\.pm-reports\auto-report.md` (versioned) |
| Backups | user-chosen via save dialog (`junglans-backup-<date>.db`) |

---

## 1.11 How the Pieces Fit Together (a worked example)

To ground the architecture, trace one complete feature end-to-end — **creating an activity log entry**:

1. **UI** — `ActivityLog.tsx` renders the week grid; the user clicks "Add entry" and submits a form with date, in/out times, description, status, project, member.
2. **Store** — `useActivityStore.createLog(payload)` sets `isLoading`, calls `window.api.activity.create(payload)`.
3. **Preload** — `window.api.activity.create` → `ipcRenderer.invoke('activity:create', payload)`.
4. **Handler** — `activityHandlers.ts` catches errors, calls `activityService.create(payload)`.
5. **Service** — `ActivityService.create` generates a UUID, inserts into `activity_logs` (synchronous sql.js write = full-file flush), then reads the row back via `getLogs(date, date)` and returns the mapped `ActivityLog`.
6. **Store** — the store clears loading and refreshes the list (`fetchWeeklyLogs()`), then returns the created log.
7. **UI** — the week grid re-renders with the new row; the summary block recomputes hours/days.

Every other feature follows this same skeleton: **Page → Store → window.api → Handler → Service → Database** (and back).

---

# PART 2 — ELECTRON MAIN PROCESS, IPC & DATABASE

This part covers the entire main-process plumbing: `electron/main.ts` (180 lines), `electron/preload.ts` (173 lines), the 16 IPC handler files (85 channels + 5 in main.ts = 90 total), `database/db.ts` (821 lines), `database/schema.ts` (99 lines), and the on-disk migration files. If you need to know "which channel does what", "what table has which columns", or "how does the database actually persist", this is the section.

---

## 2.11 Electron Main Process (`electron/main.ts`)

**Path:** `electron/main.ts` — 180 lines.

### 2.11.1 Imports & module bootstrap

```ts
import dotenv from 'dotenv';
// Load environment variables immediately
dotenv.config();
```

- `dotenv.config()` runs at the **very top of the file, before any other import**, so `.env` values exist before `app.whenReady()` and before `githubService` reads `process.env.GITHUB_TOKEN` at startup.
- dotenv reads `.env` from `process.cwd()` — in dev that is the project root; in packaged apps it is the executable's directory (so shipping a `.env` next to the `.exe` works).

Only four Electron APIs are used anywhere in the main process:

| API | Used for |
|---|---|
| `app` | lifecycle, paths, quit, badge count |
| `BrowserWindow` | window creation, `fromWebContents` resolution, `flashFrame` |
| `ipcMain` | 90 channel registrations |
| `dialog` | folder/file/save dialogs |

**Explicitly NOT used:** `Menu`, `Tray`, `globalShortcut`, `autoUpdater`, `powerMonitor`, `nativeImage`, `session`, `shell`, `clipboard`, `crashReporter`, `net`. There is no tray icon, no application menu customization, no auto-update flow, no global hotkeys, no power-monitor resume handling, and no single-instance lock (`app.requestSingleInstanceLock()` is absent — launching a second instance opens a second window).

**Logging:** `electron-log` v5 is configured with `log.transports.file.level` from `LOG_LEVEL` (default `'info'`) and `log.transports.console.level = 'debug'`. All `log.*` calls land in both the console (debug level) and a rotating file at `%APPDATA%\project-manager\logs\main.log`.

### 2.11.2 Global state

```ts
let mainWindow: BrowserWindow | null = null;
```

A module-level singleton window reference, nulled in the `closed` event. Note that IPC handlers resolve the sending window per-call with `BrowserWindow.fromWebContents(event.sender)` rather than using this variable, so the variable is effectively only a lifecycle existence flag (used by the macOS `activate` handler).

### 2.11.3 `createWindow()` — window options

| Option | Value | Notes |
|---|---|---|
| `width` | 1400 | default size |
| `height` | 900 | |
| `minWidth` | 1000 | |
| `minHeight` | 700 | |
| `title` | `'Junglans Project Manager'` | |
| `icon` | `path.join(__dirname, '../assets/icon.png')` | compiled path → project root `assets/icon.png` |
| `webPreferences.preload` | `path.join(__dirname, 'preload.js')` | compiled preload |
| `webPreferences.contextIsolation` | `true` | renderer isolated from Node |
| `webPreferences.nodeIntegration` | `false` | |
| `webPreferences.sandbox` | `false` | preload gets full Node |
| `frame` | `false` | frameless — custom chrome in renderer |
| `titleBarStyle` | `'hidden'` | |
| `titleBarOverlay` | `{ color: '#ffffff', symbolColor: '#1f2937', height: 36 }` | OS-native min/max/close drawn on a 36 px white strip |
| `backgroundColor` | `'#ffffff'` | prevents white flash with dark themes |
| `show` | `false` | shown on `ready-to-show` |

**Show-on-ready pattern:**
```ts
mainWindow.once('ready-to-show', () => { mainWindow?.show(); });
```

**URL source:**
```ts
if (process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER_URL) {
  const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
  mainWindow.loadURL(devUrl);
  mainWindow.webContents.openDevTools({ mode: 'detach' });
} else {
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
}
```

- Dev: loads the Vite dev server and auto-opens detached DevTools.
- Prod: loads the built `dist/index.html` relative to the compiled main bundle.

### 2.11.4 `registerDialogHandlers()` — channels registered in main.ts itself

| Channel | Signature | Behavior |
|---|---|---|
| `dialog:selectFolder` | `(event) → string \| null` | Sync folder picker, title "Select Project Folder", returns first selected path or null |
| `dialog:selectFiles` | `(event, filters?) → string[] \| null` | Multi-select file picker, title "Select Documents", default filters Documents (pdf/md/docx/txt) + All Files |
| `window:minimize` | `(event) → void` | `BrowserWindow.fromWebContents(event.sender)?.minimize()` |
| `window:maximize` | `(event) → void` | toggle maximize/unmaximize |
| `window:close` | `(event) → void` | closes the window |

> **Dead channels:** the three `window:*` channels are registered but **never exposed in the preload and never called from the renderer** — the `titleBarOverlay` provides native controls instead. They are dead code (verified by grep).

### 2.11.5 `app.whenReady()` — startup sequence

The entire ready flow is **asynchronous and strictly ordered**; the window is not created until the database is fully initialized:

1. Log startup.
2. If `process.env.GITHUB_TOKEN` is set → `githubService.setToken(...)` immediately (before DB init; the service is token-only).
3. `await initDatabase()` — loads the WASM, opens/creates `project-manager.db`, runs all pending migrations. **A throw here means no window is ever created and the app shows nothing** (there is no `.catch()` on `whenReady()`).
4. Register the 16 handler groups (order: project, github, git, health, export, activity, team, analytics, notification, ai, timeline, explorer, database, search, template, note) — all synchronous `ipcMain.handle` calls.
5. `registerDialogHandlers()`.
6. `notificationService.startScheduler()` — first check 5 s after startup, then every 5 minutes.
7. `createWindow()`.
8. `app.on('activate', ...)` — macOS: recreate window if none open.
9. Final success log.

### 2.11.6 Shutdown sequence

```ts
app.on('window-all-closed', () => {
  notificationService.stopScheduler();
  closeDatabase();
  if (process.platform !== 'darwin') { app.quit(); }
});
app.on('before-quit', () => {
  notificationService.stopScheduler();
  closeDatabase();
});
```

Both events fire on Windows (window-all-closed → quit → before-quit), so `closeDatabase()` and `stopScheduler()` run twice. Both are idempotent (the wrapper is nulled after close; the scheduler clears a possibly-null interval), so this is redundant but safe. `closeDatabase()` performs a final `save()` (full DB file flush) before closing the sql.js instance.

### 2.11.7 Startup failure modes

- No `.catch()` on `whenReady()` → an unhandled promise rejection; the user sees nothing.
- If `sql-wasm.wasm` is missing at runtime, `initSqlJs()` fails → same silent failure.
- If a migration fails (e.g. a partial `ALTER TABLE` from a crashed previous run), startup aborts permanently until the DB file is repaired or deleted (see §5.47).

---

## 2.12 Preload Bridge (`electron/preload.ts`)

**Path:** `electron/preload.ts` — 173 lines.

### 2.12.1 Setup

```ts
contextBridge.exposeInMainWorld('api', { ... });
```

The global is `window.api`, typed by `electron.d.ts` (`declare global { interface Window { api: ElectronAPI } }`). **17 top-level namespaces, 88 invoke methods, 2 event-listener helpers.**

- Every invoke method follows the same shape: `(args) => ipcRenderer.invoke('<channel>', args)`.
- Two subscription helpers use `ipcRenderer.on(...)`: `ai.onChunk` and `notification.onNotificationReceived`.
- Two cleanup helpers call `ipcRenderer.removeAllListeners(...)` — note this removes **all** listeners for the channel, including ones added by other code.
- No `ipcRenderer.send` or `sendSync` anywhere — 100% invoke-based.
- **Zero validation in the bridge** — payloads are passed through as-is; validation (if any) happens in the services.

### 2.12.2 Full `window.api` reference

#### `project` (11 methods)

| Method | Channel | Returns |
|---|---|---|
| `create(payload)` | `project:create` | `Project` |
| `list(includeArchived?)` | `project:list` | `Project[]` |
| `get(id)` | `project:get` | `Project \| null` |
| `update(id, data)` | `project:update` | `Project` |
| `delete(id)` | `project:delete` | `void` |
| `archive(id)` | `project:archive` | `Project` |
| `restore(id)` | `project:restore` | `Project` |
| `hardDelete(id)` | `project:hardDelete` | `void` |
| `addDocument(projectId, filePath)` | `project:addDocument` | `void` |
| `removeDocument(documentId)` | `project:removeDocument` | `void` |
| `readDocument(filePath)` | `project:readDocument` | `string` (raw file text) |

#### `github` (12 methods)

| Method | Channel |
|---|---|
| `validateRepo(url)` | `github:validateRepo` |
| `getMetadata(url)` | `github:getMetadata` |
| `detectPages(url)` | `github:detectPages` |
| `setToken(token)` | `github:setToken` |
| `checkTokenScopes()` | `github:checkTokenScopes` |
| `getUser()` | `github:getUser` |
| `getUserRepos(page?, perPage?)` | `github:getUserRepos` |
| `getBranches(owner, repo)` | `github:getBranches` |
| `getCommits(owner, repo, branch?, page?)` | `github:getCommits` |
| `getFileTree(owner, repo, branch?)` | `github:getFileTree` |
| `getDirContents(owner, repo, path, branch?)` | `github:getDirContents` |
| `getFileContent(owner, repo, path, branch?)` | `github:getFileContent` |

#### `git` (4 methods)

| Method | Channel |
|---|---|
| `isRepo(folderPath)` | `git:isRepo` |
| `commitCount(folderPath)` | `git:commitCount` |
| `recentCommits(folderPath, projectName, limit?)` | `git:recentCommits` |
| `contributorsCount(folderPath)` | `git:contributorsCount` |

#### `health` (4 methods)

| Method | Channel |
|---|---|
| `check(url, projectId?)` | `health:check` |
| `ssl(url)` | `health:ssl` |
| `analyze(url)` | `health:analyze` |
| `getLogs(projectId, limit?)` | `health:getLogs` |

#### `ai` (6 methods + 2 listener helpers)

| Method | Channel |
|---|---|
| `generateGeminiReport(projectId, folderPath, model, apiKey)` | `ai:generateGeminiReport` |
| `generateOpenRouterReport(projectId, folderPath, model, apiKey)` | `ai:generateOpenRouterReport` |
| `generateOllamaReport(projectId, folderPath, model)` | `ai:generateOllamaReport` |
| `checkOllama()` | `ai:checkOllama` |
| `listOllamaModels()` | `ai:listOllamaModels` |
| `cancelStream()` | `ai:cancelStream` |
| `onChunk(callback)` | `ipcRenderer.on('ai:chunk', ...)` |
| `removeChunkListener()` | `ipcRenderer.removeAllListeners('ai:chunk')` |

#### `export` (7 methods)

| Method | Channel | Notes |
|---|---|---|
| `summary(projectId)` | `export:summary` | Markdown string |
| `techstack(projectId)` | `export:techstack` | |
| `architecture(projectId)` | `export:architecture` | |
| `health(projectId)` | `export:health` | |
| `full(projectId)` | `export:full` | |
| `'ai-generated'(projectId)` | `export:ai-generated` | **⚠ dangling — no handler registered (see §2.13.5)** |
| `save(content, defaultName)` | `export:save` | opens save dialog, writes file |

#### `dialog` (2 methods)

| Method | Channel |
|---|---|
| `selectFolder()` | `dialog:selectFolder` |
| `selectFiles(filters?)` | `dialog:selectFiles` |

#### `activity` (7 methods)

| Method | Channel |
|---|---|
| `list(startDate?, endDate?)` | `activity:list` |
| `getByProject(projectId, limit?)` | `activity:getByProject` |
| `getTotalHoursByProject(projectId)` | `activity:getTotalHoursByProject` |
| `create(payload)` | `activity:create` |
| `update(id, payload)` | `activity:update` |
| `delete(id)` | `activity:delete` |
| `exportWeekly(startDate, endDate)` | `activity:exportWeekly` |

#### `team` (4 methods)

| Method | Channel |
|---|---|
| `list()` | `team:list` |
| `create(payload)` | `team:create` |
| `update(id, payload)` | `team:update` |
| `delete(id)` | `team:delete` |

#### `analytics` (3 methods)

| Method | Channel |
|---|---|
| `getSummary(startDate?, endDate?)` | `analytics:getSummary` |
| `getProjectAnalytics(projectId)` | `analytics:getProjectAnalytics` |
| `export(startDate?, endDate?)` | `analytics:export` |

#### `notification` (6 methods + 2 listener helpers)

| Method | Channel |
|---|---|
| `list(filters?)` | `notification:list` |
| `markRead(id, isRead?)` | `notification:markRead` |
| `markAllRead()` | `notification:markAllRead` |
| `delete(id)` | `notification:delete` |
| `clearAll()` | `notification:clearAll` |
| `simulate(payload)` | `notification:simulate` |
| `onNotificationReceived(callback)` | `ipcRenderer.on('notification:received', ...)` |
| `removeNotificationListener()` | `ipcRenderer.removeAllListeners('notification:received')` |

#### `search` (1 method)

| Method | Channel |
|---|---|
| `global(query)` | `search:global` |

#### `database` (3 methods)

| Method | Channel |
|---|---|
| `getInfo()` | `db:getInfo` |
| `backup()` | `db:backup` |
| `restore()` | `db:restore` |

#### `timeline` (6 methods)

| Method | Channel |
|---|---|
| `listMilestones(projectId)` | `timeline:listMilestones` |
| `createMilestone(payload)` | `timeline:createMilestone` |
| `updateMilestone(id, payload)` | `timeline:updateMilestone` |
| `deleteMilestone(id)` | `timeline:deleteMilestone` |
| `updateProjectPlanning(projectId, payload)` | `timeline:updateProjectPlanning` |
| `getAnalytics(projectId)` | `timeline:getAnalytics` |

#### `explorer` (5 methods)

| Method | Channel |
|---|---|
| `scanProject(dirPath, includeHidden?)` | `explorer:scanProject` |
| `getFileDetails(filePath)` | `explorer:getFileDetails` |
| `explainFile(filePath, provider, apiKey, model?)` | `explorer:explainFile` |
| `auditProject(dirPath)` | `explorer:auditProject` |
| `getDependencies(filePath)` | `explorer:getDependencies` |

#### `template` (4 methods)

| Method | Channel |
|---|---|
| `list()` | `template:list` |
| `get(id)` | `template:get` |
| `create(payload)` | `template:create` |
| `delete(id)` | `template:delete` |

#### `note` (3 methods)

| Method | Channel |
|---|---|
| `get(projectId)` | `note:get` |
| `upsert(projectId, content)` | `note:upsert` |
| `delete(projectId)` | `note:delete` |

### 2.12.3 Preload gotchas

1. `removeChunkListener`/`removeNotificationListener` call `removeAllListeners`, which nukes **any** listener for that channel — including ones added by other code. Only one component subscribes at a time today, so this is safe in practice.
2. The bridge does not expose `window:minimize/maximize/close` (dead main-side channels).
3. Arbitrary payloads are passed through unvalidated.

---

## 2.13 IPC Handler Groups (`electron/ipc/`)

**16 files, 85 channels**, plus the 5 channels in main.ts = **90 `ipcMain.handle` registrations total**.

Common per-file pattern:
```ts
export function registerXHandlers(): void {
  ipcMain.handle('x:channel', async (event, arg) => {
    try {
      // delegate to service
    } catch (err) {
      log.error('[IPC] x:channel failed:', (err as Error).message);
      throw err;   // or return a default value
    }
  });
}
```

There is abundant duplicated boilerplate — each file re-declares `const error = err as Error; const e = err as Error;` (a dead variable) — a lint smell with no functional impact.

### 2.13.1 `projectHandlers.ts` (122 lines, 11 handlers)

| Channel | Service call | Notes |
|---|---|---|
| `project:create` | `projectManager.create(payload)` | raw pass-through; throws on error |
| `project:list` | `projectManager.list(includeArchived)` | |
| `project:get` | `projectManager.getById(id)` | `Project \| null` |
| `project:update` | `projectManager.update(id, data)` | |
| `project:delete` | `projectManager.delete(id)` | return ignored → `void` |
| `project:archive` | `projectManager.archive(id)` | |
| `project:restore` | `projectManager.restore(id)` | |
| `project:hardDelete` | `projectManager.hardDelete(id)` | |
| `project:addDocument` | `projectManager.addDocument(projectId, filePath)` | |
| `project:removeDocument` | `projectManager.removeDocument(documentId)` | |
| `project:readDocument` | **inline fs logic** — `fs.existsSync` check then `fs.readFileSync(filePath, 'utf-8')` | no size limit, no extension allow-list, no path normalization |

> **Security note:** `project:readDocument` and `explorer:explainFile` let the renderer read arbitrary files by absolute path from the main process. The renderer is the app's own trusted UI, so this is acceptable; it would be an arbitrary-file-read primitive only if the renderer were ever compromised.

### 2.13.2 `githubHandlers.ts` (130 lines, 12 handlers)

All delegate to `githubService` (axios against `api.github.com`). No validation in the handler; typed params only.

| Channel | Error behavior |
|---|---|
| `github:validateRepo` | returns `false` on error |
| `github:getMetadata` | rethrow |
| `github:detectPages` | returns `{ hasPages: false }` on error |
| `github:setToken` | returns `false` on error (sync) |
| `github:checkTokenScopes` | rethrow |
| `github:getUser` | rethrow |
| `github:getUserRepos` | rethrow |
| `github:getBranches` | rethrow |
| `github:getCommits` | rethrow |
| `github:getFileTree` | rethrow |
| `github:getDirContents` | rethrow |
| `github:getFileContent` | rethrow |

Note: `github:setToken` stores the token **in memory only** — it is never persisted to the DB or disk by the service layer (persistence is the renderer's job via the settings store, which pushes it back on every app start).

### 2.13.3 `gitHandlers.ts` (43 lines, 4 handlers)

| Channel | Error behavior |
|---|---|
| `git:isRepo` | returns `false` |
| `git:commitCount` | returns `0` |
| `git:recentCommits` | returns `[]` |
| `git:contributorsCount` | returns `0` |

All delegate to `gitService`, which shells out to the `git` CLI via `execSync` with graceful falsy defaults.

### 2.13.4 `healthHandlers.ts` (63 lines, 4 handlers)

| Channel | Behavior |
|---|---|
| `health:check` | `healthService.check(url)`; **when `projectId` is given**: also `healthService.saveHealthLog(projectId, result)` + `projectManager.update(projectId, { lastHealth: result })` — the project's `last_health` JSON is overwritten with the fresh result |
| `health:ssl` | calls `checkSSL`, reshapes to `{ valid, expiry }` only; error → `{ valid: false, expiry: null }` |
| `health:analyze` | `analysisService.analyze(url)` |
| `health:getLogs` | `healthService.getHealthLogs(projectId, limit)`; error → `[]` |

### 2.13.5 `exportHandlers.ts` (91 lines, 6 handlers)

All generate Markdown via the `markdownExporter` singleton, except `export:save`:

| Channel | Notes |
|---|---|
| `export:summary` | `markdownExporter.generateSummary(projectId)` |
| `export:techstack` | `markdownExporter.generateTechStack(projectId)` |
| `export:architecture` | `markdownExporter.generateArchitecture(projectId)` |
| `export:health` | `markdownExporter.generateHealth(projectId)` |
| `export:full` | `markdownExporter.generateFull(projectId)` |
| `export:save` | inline: `dialog.showSaveDialogSync` (Markdown filter + All Files), then `fs.writeFileSync(result, content, 'utf-8')`; returns `true`/`false` |

> **⚠ `export:ai-generated` is a dangling channel.** It is exposed in the preload, typed in `electron.d.ts`, and listed as a real `ExportType` in `src/types/Report.ts`, but **no `ipcMain.handle('export:ai-generated')` exists anywhere**. Calling it rejects with "No handler registered for 'export:ai-generated'". The "AI Report (Qwen)" export button in `ExportButtons` will therefore fail at runtime. (The AI-generated report content is reachable through the AI tab's own save flow instead.)

### 2.13.6 `activityHandlers.ts` (93 lines, 7 handlers)

| Channel | Notes |
|---|---|
| `activity:list` | `activityService.getLogs(startDate, endDate)` |
| `activity:getByProject` | `activityService.getLogsByProject(projectId, limit)` |
| `activity:getTotalHoursByProject` | returns `0` on error |
| `activity:create` | |
| `activity:update` | |
| `activity:delete` | |
| `activity:exportWeekly` | async `showSaveDialog` (default name `Weekly_Activity_Log_<start>_to_<end>.xlsx`, xlsx filter) → `activityService.exportWeeklyExcel(startDate, endDate, filePath)`; `false` on cancel |

### 2.13.7 `teamHandlers.ts` (51 lines, 4 handlers)

`team:list` / `team:create(payload)` / `team:update(id, payload)` / `team:delete(id)` — thin pass-throughs to `teamService`, all rethrow.

### 2.13.8 `analyticsHandlers.ts` (55 lines, 3 handlers)

| Channel | Notes |
|---|---|
| `analytics:getSummary` | `analyticsService.getSummary(startDate, endDate)` |
| `analytics:getProjectAnalytics` | returns `null` on error |
| `analytics:export` | save dialog (default `Analytics_Report_<start>_to_<end>.xlsx`); **fallback dates**: start → 30 days ago, end → today when missing; then `analyticsService.exportAnalyticsExcel(sDate, eDate, filePath)` |

### 2.13.9 `notificationHandlers.ts` (90 lines, 6 handlers)

| Channel | Notes |
|---|---|
| `notification:list` | `notificationService.list(filters?)` where `filters?: { category?; isRead?: number; priority? }`; error → `[]` |
| `notification:markRead` | `markRead(id, isRead)` |
| `notification:markAllRead` | error → `false` |
| `notification:delete` | error → `false` |
| `notification:clearAll` | error → `false` |
| `notification:simulate` | `notificationService.create(payload)` with typed payload `{ category, type, title, message, priority, projectId?, metadata? }` — used by the Notifications page "Simulate" button |

Every `create()` triggers `broadcast()` → `win.webContents.send('notification:received', notification)` to all windows.

### 2.13.10 `timelineHandlers.ts` (73 lines, 6 handlers)

| Channel | Notes |
|---|---|
| `timeline:listMilestones(projectId)` | |
| `timeline:createMilestone(payload)` | |
| `timeline:updateMilestone(id, payload)` | |
| `timeline:deleteMilestone(id)` | |
| `timeline:updateProjectPlanning(projectId, payload)` | |
| `timeline:getAnalytics(projectId)` | |

All rethrow; `delete` and `updateProjectPlanning` return `undefined`.

### 2.13.11 `explorerHandlers.ts` (77 lines, 5 handlers)

| Channel | Notes |
|---|---|
| `explorer:scanProject` | `projectScannerService.scanProject(dirPath, includeHidden || false)` → `{ tree, stats, files, folders }` |
| `explorer:getFileDetails` | `projectScannerService.getFileDetails(filePath)` → `AdvancedFileDetails` |
| `explorer:explainFile` | inline `fs.existsSync` + `fs.readFileSync(filePath,'utf-8')`, then dispatch `provider === 'gemini' ? geminiService.explainFile(...) : openRouterService.explainFile(...)`; returns explanation string |
| `explorer:auditProject` | `detectDuplicates(dirPath)` + `detectDeadFiles(dirPath)` → `{ duplicates, deadFiles }` |
| `explorer:getDependencies` | `generateMermaidGraph(filePath)` → mermaid string |

### 2.13.12 `aiHandlers.ts` (168 lines, 6 handlers) — the streaming hub

- `SYSTEM_PROMPT` constant: *"You are a senior technical writer and software architect analyzing a local codebase. Generate a comprehensive Project Architecture Report in Markdown. Structure: 1. Executive Summary 2. Core Technologies Used 3. High-Level Architecture 4. Component Details 5. Development Setup & Notes."*
- Module-global `let isCancelled = false`.
- `ai:checkOllama` → `ollamaService.isAvailable()` (error → `false`); `ai:listOllamaModels` → `ollamaService.listModels()` (error → `[]`); `ai:cancelStream` → sets `isCancelled = true`, returns void.
- **The streaming flow (all three engines share it):**
  1. Renderer: `window.api.ai.generateGeminiReport(projectId, folderPath, model, apiKey)` → invoke.
  2. Handler resolves `const window = BrowserWindow.fromWebContents(event.sender)`.
  3. Calls the service's streaming method with an `onChunk` callback.
  4. In the callback: `if (!isCancelled) window.webContents.send('ai:chunk', chunk)`.
  5. Renderer accumulates chunks into `streamingContent`.
  6. On completion, `saveReport()` writes a Markdown file into `<project folder>/.junglans/reports/` and inserts a `documents` row (`is_ai_generated = 1`), then the invoke resolves with the full report string.
  7. On cancellation, the handler returns the literal string `'Generation cancelled by user.'` (resolves, does not reject) and **skips the save**.

`saveReport()` helper details:
```ts
SELECT folder_path, name FROM projects WHERE id = ?    // throws 'Project not found'
// mkdir -p <folder_path>/.junglans/reports/
// filename: Architecture_Report_<timestamp with ':' and '.' replaced by '-'>.md
// fs.writeFileSync; then direct DB insert into documents:
//   id = 'doc_' + uuidv4(), doc_type = 'markdown', is_ai_generated = 1,
//   created_at = new Date().toISOString()
```
This insert bypasses `ProjectManager.addDocument` entirely (it also means `doc_type` is `'markdown'`, not `'auto-generated'`).

**Gotchas:**
- `isCancelled` is module-global; every handler entry resets it to `false`.
- `ai:cancelStream` never calls `ollamaService.cancelGeneration()` (which owns an AbortController) — the underlying HTTP stream keeps running server-side (see §5.43.5).
- `if (!window) return;` resolves the invoke with `undefined` if the window is gone.

### 2.13.13 `dbHandlers.ts` (106 lines, 3 handlers)

| Channel | Behavior |
|---|---|
| `db:getInfo` | `app.getPath('userData')` + `project-manager.db`; if missing → `{ path, exists: false, size: 0, lastModified: null }`; else stat → `{ path, exists: true, size, lastModified }`; error → `{ path: '', exists: false, ... }` |
| `db:backup` | save dialog (`junglans-backup-<date>.db`); `fs.copyFileSync(dbPath, dest)` → `{ success: true, path, size }` or `{ success: false }` |
| `db:restore` | open dialog; **pre-restore backup** (`project-manager.db.pre-restore-backup`); copies the chosen file over the live DB file; returns `{ success: true, path, size, note: 'App will restart to load the restored database. A pre-restore backup was saved.' }` |

> **Critical gotcha:** restore only swaps the file on disk — the **in-memory sql.js database is not reloaded**. The running app keeps using old data until a restart, and no auto-restart is triggered (the note just tells the user).

### 2.13.14 `searchHandlers.ts` (134 lines, 1 handler)

`search:global(query)` — a unified search across five entity types:

- Guard: empty or `< 2` characters → `[]`.
- `q = %query%` LIKE pattern.
- **projects** (archived excluded): name/folder_path/primary_category/tags/tech_stack LIKE, LIMIT 8; `matchField` computed client-side (name/folder path/category/tags).
- **activity_logs** (LEFT JOIN projects): description/date LIKE, LIMIT 6.
- **milestones** (LEFT JOIN projects): name/description/phase LIKE, LIMIT 6.
- **documents** (LEFT JOIN projects): file_name/file_path LIKE, LIMIT 6.
- **notifications**: title/message LIKE, LIMIT 6.
- Returns `GlobalSearchResult[]` with `route` hints for the router. Errors → `[]`.

### 2.13.15 `templateHandlers.ts` (43 lines, 4 handlers)

`template:list` (error → `[]`), `template:get` (error → `null`), `template:create(payload)` (rethrow), `template:delete(id)` (rethrow) — all to `ProjectTemplateManager`.

### 2.13.16 `noteHandlers.ts` (34 lines, 3 handlers)

`note:get` (error → `null`), `note:upsert(projectId, content)` (rethrow), `note:delete(projectId)` (rethrow) — all to `ProjectNotesService`.

---

## 2.14 Database Layer (`database/db.ts`)

**Path:** `database/db.ts` — 821 lines. This is the heart of persistence: sql.js bootstrap, the better-sqlite3-compatible wrapper classes, and all 13 migrations **inlined as string literals**.

### 2.14.1 sql.js initialization

```ts
const SQL = await initSqlJs();   // called with NO configuration
```

- **No `locateFile` option** — sql.js falls back to loading `sql-wasm.wasm` from its default URL. In practice the bundler/electron-builder must copy the wasm next to the compiled bundle (the app works, so it does); if it were missing, startup fails with a WASM load error and nothing handles it.
- `electron/sql.d.ts` (19 lines) is a hand-written minimal declaration for `'sql.js'` that shadows the package's own types: `SqlValue = number | string | Uint8Array | null`, `Statement { bind, step, getAsObject, free }`, `Database { run, exec, prepare, export, close }`, `initSqlJs(config?)`. It declares only what the app uses.

### 2.14.2 Database file location

```ts
const userDataPath = app.getPath('userData');
dbPath = path.join(userDataPath, 'project-manager.db');
```

Windows default: `C:\Users\<user>\AppData\Roaming\project-manager\project-manager.db`.

### 2.14.3 Loading path

```ts
if (fs.existsSync(dbPath)) {
  const fileBuffer = fs.readFileSync(dbPath);
  database = new SQL.Database(fileBuffer);   // existing file → WASM memory
} else {
  database = new SQL.Database();             // fresh empty DB
}
```

First launch: fresh DB → migrations create all tables. Existing launch: the entire file is read into memory and the DB runs **in RAM**.

### 2.14.4 Singleton & lifecycle

```ts
let wrapper: DatabaseWrapper | null = null;

export async function initDatabase(): Promise<DatabaseWrapper> {
  if (wrapper) return wrapper;              // idempotent
  ...
}

export function getDatabase(): DatabaseWrapper {
  if (!wrapper) throw new Error('Database not initialized. Call initDatabase() first.');
  return wrapper;
}

export function closeDatabase(): void {
  if (wrapper) { wrapper.close(); wrapper = null; }   // final save + close; idempotent
}
```

- `initDatabase` is memoized; `getDatabase` throws if called before init (services call it lazily after `whenReady`).
- A crash during `initDatabase()` leaves `wrapper` null forever — no retry logic.

### 2.14.5 The `DatabaseWrapper` class (lines 14–58)

| Method | Implementation |
|---|---|
| `prepare(sql)` | returns `new StatementWrapper(this.db, sql)` |
| `exec(sql)` | `this.db.exec(sql)` **then `this.save()`** (auto-persist) |
| `pragma(pragma)` | `this.db.exec('PRAGMA ' + pragma)` in try/catch — **swallows all pragma errors silently** |
| `close()` | `save()` then `this.db.close()` |
| `save()` | `const data = this.db.export()` → `Buffer.from(data)` → `fs.writeFileSync(dbPath, buffer)`; on error logs `[DB] Failed to save database:` |
| `getRawDb()` | returns the raw sql.js Database (used for direct exec) |

### 2.14.6 The `StatementWrapper` class (lines 60–108)

| Method | Behavior |
|---|---|
| `run(...params)` | `this.db.run(this.sql, params)`; **auto-save after every write** (export + writeFileSync). Returns `void` — does NOT return better-sqlite3's `{ changes, lastInsertRowid }` |
| `get(...params)` | prepare → optional bind → `step()` → `getAsObject()` → `free()`; returns row or `undefined` |
| `all(...params)` | loops `step()`/`getAsObject()`, `free()`; returns array |

### 2.14.7 The three critical performance/consistency facts

1. **Every `run()`/`exec()` rewrites the ENTIRE database file to disk synchronously.** With many small writes (e.g. importing a week of activity logs) this is O(file-size) disk churn per statement and blocks the main process (and thus all IPC).
2. **No transaction API** is exposed (`db.transaction` absent). Services needing atomicity must hand-roll `BEGIN`/`COMMIT` via `exec` — each of which triggers a full file save.
3. **Crash mid-write corrupts the DB file.** The single-file overwrite is not atomic (no WAL, no journaling beyond sql.js's in-memory semantics). A killed process during `writeFileSync` can leave a truncated file that fails to load on next launch.

### 2.14.8 `runMigrations()` — the migration system (lines 152–813)

**Tracking table:**
```sql
CREATE TABLE IF NOT EXISTS _migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  applied_at TEXT NOT NULL
);
```

Migrations are tracked by **name string** (e.g. `'001_create_projects.sql'`), not by id.

**Execution flow:**
1. Read applied names: `SELECT name FROM _migrations`.
2. For each migration whose name is not in the applied set: `database.exec(migration.sql)` then `INSERT INTO _migrations (name, applied_at) VALUES (?, ?)` with `new Date().toISOString()`.
3. **No transaction wrapping.** If migration N fails mid-way, the loop aborts and `_migrations` has no row for N → next launch retries N. `CREATE TABLE IF NOT EXISTS` makes most table migrations idempotent, but **`ALTER TABLE` migrations will fail on retry** ("duplicate column name") → `initDatabase()` throws → the app never opens. The `_migrations` bookkeeping is the only safety net.

### 2.14.9 The 13 migrations — full inventory

**MIGRATION 001 — `001_create_projects.sql`**
```sql
CREATE TABLE IF NOT EXISTS projects (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  folder_path  TEXT NOT NULL,
  type         TEXT NOT NULL,
  github_url   TEXT,
  is_on_github INTEGER DEFAULT 0,
  github_data  TEXT,
  is_hosted    INTEGER DEFAULT 0,
  hosted_url   TEXT,
  tech_stack   TEXT,
  last_health  TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);
```
Base `projects` table (13 columns). **No CHECK constraint in the inlined version** (the on-disk `.sql` has one — drift, see §2.16).

**MIGRATION 002 — `002_create_health_logs.sql`**
```sql
CREATE TABLE IF NOT EXISTS health_logs (
  id            TEXT PRIMARY KEY,
  project_id    TEXT NOT NULL,
  url           TEXT NOT NULL,
  status_code   INTEGER,
  response_time INTEGER,
  ssl_valid     INTEGER,
  ssl_expiry    TEXT,
  is_up         INTEGER DEFAULT 1,
  checked_at    TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_health_logs_project ON health_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_health_logs_checked ON health_logs(checked_at);
```
**No FOREIGN KEY in the inlined version** (drift vs. `.sql`). Times in ms (INTEGER), `checked_at` ISO string.

**MIGRATION 003 — `003_create_documents.sql`**
```sql
CREATE TABLE IF NOT EXISTS documents (
  id              TEXT PRIMARY KEY,
  project_id      TEXT NOT NULL,
  file_path       TEXT NOT NULL,
  file_name       TEXT NOT NULL,
  doc_type        TEXT,
  is_ai_generated INTEGER DEFAULT 0,
  created_at      TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_documents_project ON documents(project_id);
```
**No FK in the inlined version** (drift). `doc_type` is free text (e.g. `'markdown'`, `'pdf'`, `'auto-generated'`), not an enum.

**MIGRATION 004 — `004_create_activity_logs.sql`**
```sql
CREATE TABLE IF NOT EXISTS activity_logs (
  id          TEXT PRIMARY KEY,
  date        TEXT NOT NULL,
  in_time     TEXT,
  out_time    TEXT,
  description TEXT NOT NULL,
  status      TEXT NOT NULL,
  project_id  TEXT,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_activity_logs_date ON activity_logs(date);
```
`date` is `YYYY-MM-DD`, `in_time`/`out_time` are `HH:MM` strings. FK `ON DELETE SET NULL` — **no drift** (identical to the .sql file).

**MIGRATION 005 — `005_add_project_status_and_team_members.sql`**
```sql
ALTER TABLE projects ADD COLUMN status TEXT DEFAULT 'active';
CREATE TABLE IF NOT EXISTS team_members (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL,
  email      TEXT,
  avatar     TEXT,
  is_active  INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
ALTER TABLE activity_logs ADD COLUMN member_id TEXT REFERENCES team_members(id) ON DELETE SET NULL;
```
Adds `projects.status`, creates `team_members`, adds `activity_logs.member_id`. **No drift.**

**MIGRATION 006 — `006_create_notifications.sql`**
```sql
CREATE TABLE IF NOT EXISTS notifications (
  id         TEXT PRIMARY KEY,
  category   TEXT NOT NULL,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  priority   TEXT NOT NULL,
  is_read    INTEGER DEFAULT 0,
  project_id TEXT,
  created_at TEXT NOT NULL,
  metadata   TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);
```
In-app notification inbox; `metadata` is a JSON string; FK CASCADE deletes notifications with a deleted project.

**MIGRATION 007 — `007_create_milestones_and_timelines.sql`**
```sql
ALTER TABLE projects ADD COLUMN start_date TEXT;
ALTER TABLE projects ADD COLUMN expected_end_date TEXT;
ALTER TABLE projects ADD COLUMN actual_end_date TEXT;
ALTER TABLE projects ADD COLUMN current_phase TEXT DEFAULT 'planning';
ALTER TABLE projects ADD COLUMN health_indicator TEXT DEFAULT 'on-track';
CREATE TABLE IF NOT EXISTS milestones (
  id                    TEXT PRIMARY KEY,
  project_id            TEXT NOT NULL,
  name                  TEXT NOT NULL,
  description           TEXT,
  start_date            TEXT NOT NULL,
  target_date           TEXT NOT NULL,
  completion_date       TEXT,
  status                TEXT NOT NULL DEFAULT 'pending',
  progress              INTEGER NOT NULL DEFAULT 0,
  phase                 TEXT NOT NULL DEFAULT 'planning',
  responsible_member_id TEXT,
  created_at            TEXT NOT NULL,
  updated_at            TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (responsible_member_id) REFERENCES team_members(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS milestone_dependencies (
  milestone_id  TEXT NOT NULL,
  depends_on_id TEXT NOT NULL,
  PRIMARY KEY (milestone_id, depends_on_id),
  FOREIGN KEY (milestone_id)  REFERENCES milestones(id) ON DELETE CASCADE,
  FOREIGN KEY (depends_on_id) REFERENCES milestones(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_milestones_project ON milestones(project_id);
```
Project planning columns + milestones with a dependency DAG table (composite PK).

**MIGRATION 008 — `008_project_classification.sql`**
```sql
ALTER TABLE projects ADD COLUMN primary_category TEXT;
ALTER TABLE projects ADD COLUMN tags TEXT DEFAULT '[]';
UPDATE projects SET primary_category = 'Web Application'   WHERE type = 'webapp';
UPDATE projects SET primary_category = 'Desktop Application' WHERE type = 'desktop';
UPDATE projects SET primary_category = 'Mobile Application'  WHERE type = 'mobile';
UPDATE projects SET primary_category = 'Backend & Cloud Service' WHERE type = 'api';
UPDATE projects SET primary_category = 'Embedded & Specialized Systems' WHERE type = 'library';
UPDATE projects SET primary_category = 'Web Application' WHERE primary_category IS NULL;
```
Data migration mapping legacy `type` → `primary_category`; default `[]` tags (JSON array string).

**MIGRATION 009 — `009_advanced_planning.sql`**
```sql
ALTER TABLE projects ADD COLUMN estimated_hours INTEGER;
ALTER TABLE projects ADD COLUMN priority TEXT;
ALTER TABLE projects ADD COLUMN progress_percentage INTEGER;
ALTER TABLE projects ADD COLUMN completion_forecast TEXT;
ALTER TABLE projects ADD COLUMN custom_phases TEXT;
ALTER TABLE milestones ADD COLUMN notes TEXT;
ALTER TABLE milestones ADD COLUMN workflow_status TEXT DEFAULT 'Backlog';
ALTER TABLE milestones ADD COLUMN priority TEXT;
```
Advanced planning columns on both tables.

**MIGRATION 010 — `010_remove_dummy_data.sql`** (data cleanup)
```sql
DELETE FROM milestone_dependencies WHERE milestone_id IN (SELECT id FROM milestones WHERE project_id IN ('p_1','p_2','p_3'));
DELETE FROM milestones WHERE project_id IN ('p_1','p_2','p_3');
DELETE FROM notifications WHERE project_id IN ('p_1','p_2','p_3') OR id IN ('n_1','n_2','n_3','n_4','n_5');
DELETE FROM activity_logs WHERE project_id IN ('p_1','p_2','p_3') OR member_id IN ('tm_1','tm_2','tm_3','tm_4') OR id = 'holiday_seed';
DELETE FROM team_members WHERE id IN ('tm_1','tm_2','tm_3','tm_4');
DELETE FROM projects WHERE id IN ('p_1','p_2','p_3');
```
Removes the hard-coded seed data (whose IDs match the dead `if (false)` seeding blocks later in db.ts — see §2.14.11).

**MIGRATION 011 — `011_add_archived_to_projects.sql`**
```sql
ALTER TABLE projects ADD COLUMN archived INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_projects_archived ON projects(archived);
```
Soft-delete flag.

**MIGRATION 012 — `012_create_project_templates.sql`**
```sql
CREATE TABLE IF NOT EXISTS project_templates (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  description      TEXT,
  type             TEXT NOT NULL,
  primary_category TEXT NOT NULL,
  tags             TEXT DEFAULT '[]',
  tech_stack       TEXT DEFAULT '[]',
  milestones       TEXT DEFAULT '[]',
  created_at       TEXT NOT NULL,
  updated_at       TEXT NOT NULL
);
```
Template library; `tags`/`tech_stack`/`milestones` are JSON strings.

**MIGRATION 013 — `013_create_project_notes.sql`**
```sql
CREATE TABLE IF NOT EXISTS project_notes (
  id         TEXT PRIMARY KEY,
  project_id TEXT NOT NULL UNIQUE,
  content    TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_project_notes_project ON project_notes(project_id);
```
One note per project (`UNIQUE(project_id)` supports the upsert pattern).

### 2.14.10 Post-migration setup

`wrapper.pragma('foreign_keys = ON')` runs in `initDatabase()` **before** migrations — and `DatabaseWrapper.pragma` swallows errors, so if sql.js fails to enable FK enforcement there is no warning. (sql.js supports FK enforcement since v1.6, so it normally works.)

### 2.14.11 Dead seeding code (~400 lines under `if (false)`)

Five seed blocks are guarded by `if (false)` so they **never execute at runtime**, but they remain in the file (lines ~414–813):

1. **Default team members** — `tm_1..tm_4` (John Doe PM, Jane Smith Senior Dev, Mike Ross Dev, Rachel Zane QA).
2. **Default projects** — `p_1` WhatsApp Pro (webapp, hosted on Vercel), `p_2` Analytics Gateway (api), `p_3` Profile Manager (desktop); includes mock folder creation with hard-coded `C:/Users/manos/...` paths (the developer's machine).
3. **Default activity logs** — ~120 randomized weekday logs over 30 days for 4 members + a `holiday_seed` row.
4. **Default notifications** — `n_1..n_5` (downtime alert, github push, ssl warning, daily reminder, issue created).
5. **Default milestones** — `m_*_*` for the three projects + 7 dependencies.

Migration 010 deletes exactly these IDs — the seed/cleanup dance was deactivated with a boolean rather than removed.

### 2.14.12 `closeDatabase()` (lines 815–821)

Calls `wrapper.close()` → `save()` (final flush) + sql.js `db.close()`; nulls the singleton so subsequent `getDatabase()` throws. Idempotent.

---

## 2.15 Schema & Row Types (`database/schema.ts`)

**Path:** `database/schema.ts` — 99 lines. **TypeScript interfaces only — no DDL.** It mirrors the effective runtime columns. Some interfaces are non-exhaustive, and there are no interfaces for `notifications`, `project_templates`, `project_notes`, or `_migrations`.

### 2.15.1 `ProjectRow` (lines 1–29) — 27 effective columns

| Column | TS type | DB type | Migration |
|---|---|---|---|
| `id` | `string` | TEXT PRIMARY KEY | 001 |
| `name` | `string` | TEXT NOT NULL | 001 |
| `folder_path` | `string` | TEXT NOT NULL | 001 |
| `type` | `'webapp' \| 'desktop' \| 'mobile' \| 'api' \| 'library'` | TEXT NOT NULL | 001 |
| `github_url` | `string \| null` | TEXT | 001 |
| `is_on_github` | `number` (0/1) | INTEGER DEFAULT 0 | 001 |
| `github_data` | `string \| null` (JSON) | TEXT | 001 |
| `is_hosted` | `number` (0/1) | INTEGER DEFAULT 0 | 001 |
| `hosted_url` | `string \| null` | TEXT | 001 |
| `status` | `'active' \| 'completed' \| 'on-hold'` | TEXT DEFAULT 'active' | 005 |
| `tech_stack` | `string \| null` (JSON array) | TEXT | 001 |
| `last_health` | `string \| null` (JSON) | TEXT | 001 |
| `start_date` | `string \| null` | TEXT | 007 |
| `expected_end_date` | `string \| null` | TEXT | 007 |
| `actual_end_date` | `string \| null` | TEXT | 007 |
| `current_phase` | `string \| null` | TEXT DEFAULT 'planning' | 007 |
| `health_indicator` | `string \| null` | TEXT DEFAULT 'on-track' | 007 |
| `primary_category` | `string \| null` | TEXT | 008 |
| `tags` | `string \| null` (JSON array) | TEXT DEFAULT '[]' | 008 |
| `estimated_hours` | `number \| null` | INTEGER | 009 |
| `priority` | `'low' \| 'medium' \| 'high' \| 'critical' \| null` | TEXT | 009 |
| `progress_percentage` | `number \| null` | INTEGER | 009 |
| `completion_forecast` | `string \| null` | TEXT | 009 |
| `custom_phases` | `string \| null` | TEXT | 009 |
| `archived` | `number` (0/1) | INTEGER DEFAULT 0 | 011 |
| `created_at` | `string` | TEXT NOT NULL | 001 |
| `updated_at` | `string` | TEXT NOT NULL | 001 |

### 2.15.2 Other row interfaces

**`DocumentRow`** (31–39): `id` TEXT PK, `project_id` TEXT NOT NULL (no FK at runtime), `file_path` TEXT NOT NULL, `file_name` TEXT NOT NULL, `doc_type` TEXT | null, `is_ai_generated` INTEGER DEFAULT 0, `created_at` TEXT NOT NULL.

**`HealthLogRow`** (41–51): `id` TEXT PK, `project_id` TEXT NOT NULL (no FK), `url` TEXT NOT NULL, `status_code` INTEGER | null, `response_time` INTEGER | null, `ssl_valid` INTEGER | null, `ssl_expiry` TEXT | null, `is_up` INTEGER DEFAULT 1, `checked_at` TEXT NOT NULL.

**`ActivityLogRow`** (53–64): `id` TEXT PK, `date` TEXT NOT NULL, `in_time` TEXT | null, `out_time` TEXT | null, `description` TEXT NOT NULL, `status` `'working' | 'holiday' | 'leave'`, `project_id` TEXT | null (FK SET NULL), `member_id` TEXT | null (FK SET NULL, added 005), `created_at`, `updated_at`.

**`TeamMemberRow`** (66–75): `id` TEXT PK, `name` TEXT NOT NULL, `role` TEXT NOT NULL, `email` TEXT | null, `avatar` TEXT | null (color or initial), `is_active` INTEGER DEFAULT 1, `created_at`, `updated_at`.

**`MilestoneRow`** (77–94): `id` TEXT PK, `project_id` TEXT NOT NULL (FK CASCADE), `name` TEXT NOT NULL, `description` TEXT | null, `start_date` TEXT NOT NULL, `target_date` TEXT NOT NULL, `completion_date` TEXT | null, `status` `'pending' | 'completed' | 'delayed'`, `progress` INTEGER NOT NULL DEFAULT 0, `phase` TEXT NOT NULL DEFAULT 'planning', `responsible_member_id` TEXT | null (FK SET NULL), `notes` TEXT | null (009), `workflow_status` TEXT (009, default 'Backlog'), `priority` `'low'|'medium'|'high'|'critical' | null` (009), `created_at`, `updated_at`.

**`MilestoneDependencyRow`** (96–98): `milestone_id` TEXT, `depends_on_id` TEXT — composite PK.

### 2.15.3 Tables NOT represented in schema.ts

- `notifications` (006)
- `project_templates` (012)
- `project_notes` (013)
- `_migrations` (runtime tracking)

---

## 2.16 Migrations Folder — Contents & Drift

**The 5 `.sql` files in `database/migrations/` are NOT read at runtime.** Verified: `runMigrations` builds a hard-coded array of `{ name, sql }` literals inside `db.ts`; nothing reads `database/migrations/` from disk. The `.sql` files are **orphaned documentation** — likely the originals from which the inline strings were copied, where the drift crept in.

| File | Contents | Drift vs. inlined version |
|---|---|---|
| `001_create_projects.sql` (16 lines) | projects DDL **plus** `CHECK(type IN ('webapp','desktop','mobile','api','library'))` | **DRIFT** — live DBs have no CHECK → invalid types are insertable |
| `002_create_health_logs.sql` (15 lines) | health_logs DDL + 2 indexes **plus** `project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE` | **DRIFT** — live DBs have no FK → orphan health_logs survive project deletion |
| `003_create_documents.sql` (12 lines) | documents DDL + 1 index **plus** FK CASCADE | **DRIFT** — same story |
| `004_create_activity_logs.sql` (13 lines) | activity_logs DDL + 1 index, FK SET NULL | **NO DRIFT** |
| `005_add_project_status_and_team_members.sql` (17 lines) | ALTER + team_members DDL + member_id ALTER | **NO DRIFT** |

**Missing .sql files (006–013):** only 5 of 13 migrations exist on disk; the other 8 (notifications, milestones/timelines, classification, advanced planning, dummy-data removal, archived, templates, notes) live only as inline strings.

**Practical consequence:** a developer reading `database/migrations/` would conclude FKs/CHECK exist; the runtime schema actually has none of those constraints for `projects.type`, `health_logs.project_id`, `documents.project_id`. Only `activity_logs`, `notifications`, `milestones`, `milestone_dependencies`, and `project_notes` have real FKs — and those only enforce if the `foreign_keys = ON` pragma succeeds.

### 2.16.1 Effective runtime schema summary

| Table | Migration | FKs (runtime) |
|---|---|---|
| `projects` | 001, +cols 005/007/008/009/011 | none |
| `health_logs` | 002 | none (drift) |
| `documents` | 003 | none (drift) |
| `activity_logs` | 004, +member_id 005 | project_id SET NULL, member_id SET NULL |
| `team_members` | 005 | none |
| `notifications` | 006 | project_id CASCADE |
| `milestones` | 007, +cols 009 | project_id CASCADE, responsible_member_id SET NULL |
| `milestone_dependencies` | 007 | both CASCADE, composite PK |
| `project_templates` | 012 | none |
| `project_notes` | 013 | project_id CASCADE, UNIQUE(project_id) |
| `_migrations` | runtime | none |

### 2.16.2 Data typing conventions (recurring across the whole app)

1. **Booleans are integers 0/1** — `is_on_github`, `is_hosted`, `ssl_valid`, `is_up`, `is_read`, `is_active`, `is_ai_generated`, `archived`. Services convert with `row.is_read === 1` etc.
2. **Timestamps are ISO-8601 UTC strings** — `new Date().toISOString()` for `created_at`/`updated_at`/`checked_at`/`applied_at`.
3. **Calendar dates are bare `YYYY-MM-DD` strings** — comparisons are lexicographic (safe only because zero-padded).
4. **Times are `HH:MM` (24h) strings** — `in_time`/`out_time`.
5. **JSON is stored as TEXT** — `github_data`, `tech_stack`, `tags`, `last_health`, `notifications.metadata`, `custom_phases`, `completion_forecast`, `project_templates.tags/tech_stack/milestones`. Services `JSON.stringify`/`JSON.parse` explicitly; **no JSON1 extension, no `CHECK json_valid`** — malformed JSON throws at parse time (only `rowToData` catches parse errors).

---

# PART 3 — SERVICES LAYER

This part is a file-by-file, method-by-method deep dive into `services/` — 18 service files plus the pure-function `CriticalPathCalculator` and the three Vitest test files (~6,300 lines total). It is the longest part of this README because the services are where nearly all application logic lives.

---

## 3.17 Services: Common Patterns

Before the per-file analysis, these patterns apply app-wide:

### 3.17.1 Singleton construction

Every service file follows the same export idiom — a **class** with instance methods plus a module-level exported singleton created at import time:

```ts
export class FooService { ... }
export const fooService = new FooService();
```

Two exceptions are **object literals** (no class): `ProjectNotesService` and `ProjectTemplateManager` (`export const X = { ... }`).

The singleton is created eagerly at module load. Any constructor side effects (e.g. reading `process.env`) happen at process start — notably `OllamaService` reads `OLLAMA_BASE_URL`/`OLLAMA_DEFAULT_MODEL` once in its constructor.

### 3.17.2 Database access

All persistence goes through `getDatabase()` from `../database/db` — a better-sqlite3-style synchronous handle. Queries are always prepared statements with `?` placeholders (`prepare(sql).run(...)`, `.all(...)`, `.get(...)`). There is **no ORM**; every service hand-writes SQL. Because the wrapper is synchronous, **all DB methods are synchronous** (even when the service is otherwise async). Async methods (health checks, exports, AI calls) mix async I/O with sync DB.

### 3.17.3 Logging

All services import `log` from `electron-log`. Conventions: `log.info('[X] ...')` for lifecycle events, `log.error`/`log.warn` for failures, `log.debug` in GitService.

### 3.17.4 Recurring error-handling idiom (code smell)

Many files contain a duplicated useless double-cast — repeated ~20 times across the codebase:

```ts
} catch (err: unknown) {
  const error = err as Error;
  const e = err as Error;   // same object cast twice
  log.error('[X] ...', (e as Error).message);
}
```

No functional impact, but worth cleaning up.

### 3.17.5 Date handling conventions

- **Timestamps in DB:** `new Date().toISOString()` (UTC, `YYYY-MM-DDTHH:mm:ss.sssZ`) for `created_at`/`updated_at`/`checked_at`.
- **Calendar dates:** bare `YYYY-MM-DD` (`.toISOString().split('T')[0]`) for `date`, `start_date`, `target_date`, etc. All comparisons are lexicographic (safe because zero-padded ISO).
- **Week computation (Monday–Sunday)** appears in `AnalyticsService.getSummary()` and in `src/store/activityStore.ts` (`getWeekRange`).
- **SQLite date functions:** `NotificationService` uses `datetime(created_at) > datetime('now', '-15 minutes')` and `date(created_at) = date('now')` against ISO strings — works, but all windows are **UTC** while the UI displays local time, so dedup windows can be off by the local timezone offset.
- `MarkdownExporter`/`AnalyticsService` call `.toLocaleDateString()`/`.toLocaleString()` for display; git date parsing goes through `new Date(...).toISOString()`.

### 3.17.6 JSON serialization

Columns `tags`, `tech_stack`, `github_data`, `last_health`, `custom_phases`, `metadata`, `milestones` (templates) store JSON strings. Services `JSON.stringify` on write, `JSON.parse` on read; almost every parse is try/catch-wrapped that silently returns `[]`/`{}`/`null` on malformed data. **`ProjectManager.rowToProject` does NOT guard its parses** — a corrupted row throws during `list()`/`getById()`.

### 3.17.7 Path handling

- Electron + Windows is the primary target (`process.platform === 'win32'` check in ProjectScannerService).
- Windows backslashes are normalized to `/` for `relativePath` values (`.replace(/\\/g, '/')`) so renderer display is consistent.
- **Two AI-report output directories exist:**
  - `OllamaService.saveReport()` → `<folder>\.pm-reports\` (auto-report.md, versioned) — `.pm-reports` is in both walkers' ignore lists, so reports never get re-scanned.
  - `electron/ipc/aiHandlers.ts` `saveReport()` → `<folder>\.junglans\reports\Architecture_Report_<timestamp>.md` — `.junglans` is **not** ignored by ProjectScannerService (so AI reports inflate storage stats).

### 3.17.8 Service dependency graph (inbound only)

```
ActivityService         → (none)
ProjectScannerService   → (none)
AnalyticsService        → GitService, ActivityService, ProjectScannerService (+ TeamService imported unused)
NotificationService     → (none; uses axios/tls directly)
ProjectManager          → (none)
OllamaService            → FileWalker
GeminiService            → FileWalker
OpenRouterService        → FileWalker
TimelineService          → (none)
MarkdownExporter         → ProjectManager, HealthService
GitService               → (none)
HealthService            → (none)
TeamService              → (none)
ProjectNotesService      → (none)
ProjectTemplateManager   → (none)
AnalysisService          → (none)
```

`FileWalker` is the most-shared leaf utility; `AnalyticsService` is the aggregation hub.

### 3.17.9 Tables touched per service

| Service | Tables |
|---|---|
| ActivityService | activity_logs (R/W), projects (join), team_members (join) |
| ProjectScannerService | none |
| AnalyticsService | projects, documents, team_members, activity_logs (all R) |
| NotificationService | notifications (R/W), projects (R/W), health_logs (W), activity_logs (R) |
| ProjectManager | projects (R/W), documents (R/W), health_logs (W, hardDelete), milestones + milestone_dependencies (W, hardDelete), notifications (W, hardDelete), activity_logs (W, hardDelete null-out) |
| OllamaService | none (filesystem `.pm-reports`) |
| GitHubService | none |
| TimelineService | milestones (R/W), milestone_dependencies (R/W), team_members (join), projects (R/W via updateProjectPlanning) |
| MarkdownExporter | none (delegates) |
| GitService | none (git CLI) |
| HealthService | health_logs (R/W) |
| TeamService | team_members (R/W) |
| ProjectNotesService | project_notes (R/W) |
| ProjectTemplateManager | project_templates (R/W) |
| AnalysisService | none |

### 3.17.10 Known data-shape contracts worth flagging

- `projects.last_health` JSON: **writers** = NotificationService (`{url, statusCode, responseTime, isUp, checkedAt}` — **no ssl fields**); **readers** = AnalyticsService (`isUp`), MarkdownExporter (`statusCode/responseTime/sslValid/sslExpiry/checkedAt` — the ssl fields render `undefined`). See §3.21.8.
- `projects.github_data` JSON: writer = NotificationService (full repo API payload); readers = GitHubService.getMetadata mapping (renderer), MarkdownExporter (`stars/forks/openIssues/language/visibility/pushedAt/defaultBranch`). Compatible.
- `activity_logs.date` = `YYYY-MM-DD`; `in_time`/`out_time` = `HH:MM` (24h).
- `milestones` dates = `YYYY-MM-DD`; `status` ∈ pending/completed/delayed; `progress` 0–100.
- `notifications.metadata` = JSON string or NULL.

---

## 3.18 ActivityService

**Path:** `services/ActivityService.ts` — 447 lines. Singleton `activityService`. Role: daily work-log CRUD + weekly Excel export.

### 3.18.1 Imports

```ts
import { getDatabase } from '../database/db';
import { v4 as uuidv4 } from 'uuid';
import log from 'electron-log';
import ExcelJS from 'exceljs';
import fs from 'fs';
import { ActivityLog, ActivityLogPayload, WeeklySummary } from '../src/types/Activity';
import { ActivityLogRow } from '../database/schema';
```

`WeeklySummary` is imported but unused (the weekly summary is computed client-side in `activityStore`). ExcelJS works in Electron main because it ships CommonJS + ESM.

### 3.18.2 `calculateHours(inTime: string | null, outTime: string | null): number`

Converts `HH:MM` strings into decimal hours:

1. Returns `0` if either time is falsy.
2. Splits on `:` and `Number()`-maps both parts; returns `0` on NaN.
3. Computes minutes-of-day for both.
4. **PM-crossing heuristic:** if `outMinutes < inMinutes` AND `outMinutes + 720 > inMinutes` → add 720 minutes to out. Treats "9 → 6" as 9 AM → 6 PM. Can misfire (e.g. `in=13:00, out=12:00` → 13:00→24:00 = 11 h).
5. If `out <= in` after adjustment → `0`.
6. Returns `parseFloat((diff / 60).toFixed(2))` — 2-decimal rounding.

Pure function, no DB. Overnight shifts are unsupported.

### 3.18.3 `getLogs(startDate?, endDate?): ActivityLog[]`

One base query with LEFT JOINs and a dynamic WHERE:

```sql
SELECT al.*, p.name as project_name, tm.name as member_name
FROM activity_logs al
LEFT JOIN projects p   ON al.project_id = p.id
LEFT JOIN team_members tm ON al.member_id = tm.id
[WHERE al.date >= ? AND al.date <= ? | WHERE al.date >= ? | WHERE al.date <= ?]
ORDER BY al.date ASC, al.in_time ASC
```

- If both dates are omitted there is **no WHERE and no LIMIT** — the whole table is returned (no pagination).
- Mapping: snake_case → camelCase, `totalHours` computed on the fly via `calculateHours`.

### 3.18.4 `getLogsByProject(projectId, limit = 20): ActivityLog[]`

Same join with `WHERE al.project_id = ? ORDER BY al.date DESC, al.in_time DESC LIMIT ?`. The `LIMIT ?` binds a number natively.

### 3.18.5 `getTotalHoursByProject(projectId): number`

Delegates to `getLogsByProject(projectId, 9999)` and sums only `status === 'working'` entries. Gotcha: fetches up to 9999 rows then sums in JS rather than `SELECT SUM(...)`.

### 3.18.6 `create(payload: ActivityLogPayload): ActivityLog`

- UUID id + `new Date().toISOString()` now.
- 10-column INSERT (`payload.memberId || null` normalizes undefined → null).
- Re-reads via `getLogs(payload.date, payload.date)` and `find`s by id; **throws** `'Failed to retrieve created activity log'` if not found.

### 3.18.7 `update(id, payload: Partial<ActivityLogPayload>): ActivityLog`

- `SELECT *` first; **throws** `Activity log with ID ${id} not found`.
- Field-by-field fallback to existing values (`payload.x !== undefined ? payload.x : existing.x`).
- Full UPDATE + read-back (same as create).

### 3.18.8 `delete(id): boolean`

`DELETE FROM activity_logs WHERE id = ?`; always returns `true` without checking `changes`.

### 3.18.9 `async exportWeeklyExcel(startDate, endDate, savePath): Promise<boolean>`

Builds an ExcelJS workbook, sheet `'Weekly Activity Log'`:

- Frozen header row (`views = [{ state: 'frozen', ySplit: 1 }]`).
- Columns: Date(14) / Contributor(20) / In Time(12) / Out Time(12) / Total Hours(14) / Activity Description(45) / Status(18) / Project Name(22).
- Header row: height 26, Segoe UI 11 bold white, navy `1F4E78` fill, mixed thin/medium borders.
- Data rows: Segoe UI 10; description wraps text.
- **Status display mapping:** `'working' → 'Working Day'`, `'holiday' → 'Common Holiday'`, `'leave' → 'Personal Leave'`.
- Row-level conditional fills: holiday = light green `E2EFDA`/`375623`; leave = light orange `FCE4D6`/`C65911`; working = borders only.
- **Hours cell:** holidays/leaves always show 0 hours.
- Missing values fall back: member `'General'`, in/out `'-'`, project `'General / None'`.
- **Summary block** (after 2 blank rows): Total Working Days, Total Common Holidays, Total Personal Leave Days (via `Map<date, Set<status>>` with priority working > holiday > leave per date), and Total Weekly Working Hours as an **Excel formula** `SUM(E2:E{lastRow})`.
- Column auto-fit; save via `writeBuffer()` → `Buffer.from` → `fs.promises.writeFile`.

Gotchas: the Excel formula depends on exact column layout; the blank-row offsets are hard-coded magic.

### 3.18.10 Gotchas summary

1. **No folder-change auto-detection exists anywhere in the services layer** (grep for `watch` finds none). Activity is recorded only via manual `create`/`update`.
2. `getLogs` with no args returns the whole table.
3. `create`/`update` re-query with a date filter to return the row — a subtle path can throw after a successful write.
4. PM-crossing heuristic miscomputes some ranges.

---

## 3.19 ProjectScannerService

**Path:** `services/ProjectScannerService.ts` — 713 lines. Singleton `projectScannerService`. Role: filesystem tree walks, storage stats, file details, duplicate/dead-file audits, Mermaid graphs. **Entirely synchronous** (statSync/readdirSync/readFileSync) — a scan blocks the main process.

### 3.19.1 Constants

```ts
const DEFAULT_IGNORE = ['node_modules', '.git', 'dist', 'dist-electron', 'build', '__pycache__',
  'venv', '.venv', '.next', '.nuxt', '.output', 'target', 'bin', 'obj', '.idea',
  '.vscode', 'coverage', '.cache', '.pm-reports'];
```

Differs slightly from FileWalker's list (adds `dist-electron`, `obj`, `.pm-reports`; omits `.vs`, `.parcel-cache`, `.turbo`).

### 3.19.2 `scanProject(dirPath, includeHidden = false): { tree, stats, files, folders }`

- Throws `Directory does not exist: ${dirPath}` if missing.
- Calls private `walk()` then `calculateStats()`.
- **`walk()` — recursive DFS:**
  - `relativePath = path.relative(rootPath, currentPath).replace(/\\/g, '/')`.
  - Directories: skips DEFAULT_IGNORE entries and dot-dirs when `!includeHidden`; aggregates `totalSize`, `fileCount`, `subfolderCount`, largest file; sorts children directories-first then files (alphabetical `localeCompare`); pushes a `FolderStatsInfo` (folder's own mtime) into `foldersList`.
  - Files: `ext = path.extname(name).toLowerCase()`; `createdDate = stat.birthtime.toISOString()`, `modifiedDate = stat.mtime.toISOString()`; pushes `FileStatsInfo`.
  - **Error handling:** any failure inside the walk (permission denied etc.) logs a warning and returns a **fake file node** (`type: 'file', size: 0`) so the parent traversal continues — failed dirs appear as zero-size files in the tree.
- **Gotcha:** tree nodes carry absolute paths (with backslashes on Windows); consumers must use `relativePath`.

### 3.19.3 Private `calculateStats(dirPath, files, folders): ProjectStorageStats`

- Sums `totalSize`.
- **Categories** with fixed seed keys: `Source Code, Configuration, Database, Documentation, Assets & Media, Archives, Others` via `getFileCategory`.
- For `Source Code` files: per-language buckets via `extensionToLanguage`; **LOC estimation**: for files `< 500KB`, `readFileSync` + `content.split('\n').length`; stamps `file.lineCount` onto the `FileStatsInfo` (mutates caller's array).
- Top-10 largest files and folders.
- `heatmapData` keeps the 7 fixed categories in fixed order, including zero entries (stable heatmaps).
- `languageBreakdown` sorted by size desc.

### 3.19.4 `async getFileDetails(filePath): Promise<AdvancedFileDetails>`

- **SHA-256:** only for files `< 20MB`; larger → `'N/A (File too large)'`.
- **Permissions:** `fs.promises.access(W_OK)` → `'Read-Write'` / `'Read-Only'`.
- **Owner:** `process.platform === 'win32' ? 'System/User' : \`${stat.uid}:${stat.gid}\`` (placeholder on Windows).
- **Code metrics** (text files only, `< 2MB`):
  - `lineCount = content.split('\n').length`.
  - `classCount` via `/\b(class|struct|interface|enum)\b/g` — counts keyword occurrences, including comments/strings (overcounts).
  - `functionCount` via 5 summed regexes: Python `def`, JS/TS `function`, C++/Java/C# `(public|private|...) name(params) {`, Go/Swift `func`, arrow `const x = (...) =>`.
  - `importCount` via 5 summed regexes (`import`, `from ... import`, `require(`, `#include`, `using`) — all anchored at line start, so indented imports (common in Python) are missed.
- **Git history:** runs `git log -1 --pretty=format:"%an|%ad" -- "<filePath>"` via `exec` (cwd = dirname, timeout 3000 ms); author = part 0, date = `new Date(part[1]).toISOString()`; errors swallowed.

### 3.19.5 `detectDuplicates(dirPath): { hash, size, files: string[] }[]`

Two phases:
1. Fast walk collecting `{path, size}`; ignore size-0 files.
2. Group by size; for groups with > 1 member, hash each file (sha256, synchronous full-buffer reads — memory-hungry on large files), group by hash, keep hash-groups with > 1 path.
3. Sorted by size desc.

### 3.19.6 `detectDeadFiles(dirPath): string[]`

For `['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rs', '.cs', '.cpp', '.c']`:
1. Collect matching source files (skip DEFAULT_IGNORE).
2. Regex `/(?:import|require|from)\s+['"](\.\.?\/[^'"]+)['"]/g` captures **relative imports only**; resolve each via `resolveImportPath`.
3. Count inward references.
4. Dead = 0 inward refs, excluding a hard-coded `entryPoints` allowlist (`index.html`, `main.tsx`, `main.ts`, `index.tsx`, `index.ts`, `index.js`, `App.tsx`, `App.jsx`, `App.js`, `server.js`, `app.js`, `vite.config.ts`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `next.config.js`).

Limitations: no bare imports (package names), no aliases, no dynamic imports, comments counted as imports.

### 3.19.7 Private `resolveImportPath(currentDir, importPath): string | null`

Tries `['.ts', '.tsx', '.js', '.jsx', '.json', '']` appended to `path.resolve(currentDir, importPath)`, then `<abs>/index<ext>` variants.

### 3.19.8 `generateMermaidGraph(filePath): string`

- Returns `''` if missing/unreadable.
- Parses relative imports, resolves via `resolveImportPath` (unresolved deps keep the raw basename).
- Output `graph TD` with `Root["<basename>"]` (fill `#1e1b4b`, stroke `#4f46e5`) and `Root --> Dep<i>["<basename>"]` (fill `#0f172a`, stroke `#334155`).
- **Gotcha:** names are interpolated without escaping quotes/backticks — filenames with `"` produce invalid Mermaid.
- Zero deps → single-node graph.

### 3.19.9 Private helpers

- `isTextFile(ext)`: allowlist of ~44 extensions (md, env, dockerfile, gitignore, sh, bat, ps1, ...).
- `getFileCategory(ext)`: six allowlists → category, `'Others'` fallback.
- `extensionToLanguage(ext)`: ~40 extension → friendly-name map (e.g. `.tsx → 'React TS (TSX)'`); fallback `ext.replace('.', '').toUpperCase()` or `'Text'`.

### 3.19.10 Gotchas summary

1. Entirely synchronous — a scan of a large tree freezes the main process.
2. Failed subpaths become fake zero-size file nodes.
3. `getFileDetails` runs git via `exec` (not `execFile`) with the file path interpolated into the command string (minor injection surface, mitigated by `--`).
4. LOC/metrics are regex heuristics; comments/strings counted.
5. `.junglans` (AI reports from IPC handlers) is **not** ignored → AI reports inflate storage stats.

---

## 3.20 AnalyticsService

**Path:** `services/AnalyticsService.ts` — 671 lines. Singleton `analyticsService`. Role: dashboard aggregation, per-project analytics, 4-sheet Excel export. The aggregation hub of the services layer.

### 3.20.1 Imports

```ts
import { getDatabase } from '../database/db';
import { gitService } from './GitService';
import { teamService } from './TeamService';          // unused
import { activityService } from './ActivityService';
import { projectScannerService } from './ProjectScannerService';
import { ProjectRow, DocumentRow, ActivityLogRow, TeamMemberRow } from '../database/schema';
import { DashboardSummary, ... } from '../src/types/Analytics';
import ExcelJS from 'exceljs';
```

### 3.20.2 `async getSummary(startDate?, endDate?): Promise<DashboardSummary>`

Three metric blocks:

**(1) Project metrics:**
- `SELECT * FROM projects` → counts by `status` ('completed', 'on-hold', else **active**).
- `is_hosted === 1` → hosted; `is_on_github === 1` → githubConnected.
- Doc counts: `SELECT project_id, COUNT(*) as count, SUM(is_ai_generated) as ai_count FROM documents GROUP BY project_id`.
- `attentionRequired`: `last_health` JSON parses to `{isUp: false}` **or** `status === 'active' && docCount === 0`.
- **categoryDistribution:** seeded with 6 fixed categories (`Web Application, Desktop Application, Mobile Application, AI & Data Project, Backend & Cloud Service, Embedded & Specialized Systems`) — all six always appear (seeded with 0), unknown categories appended dynamically.
- **tagDistribution:** `JSON.parse(p.tags)` → count each tag.

**(2) Team metrics:**
- `SELECT * FROM team_members` → totalMembers.
- `SELECT * FROM activity_logs` with optional date range — **only the both-present branch exists** (unlike ActivityService which handles 3 cases).
- **Week range** (Monday–Sunday, current week): `distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay`, sliced via `toISOString().split('T')[0]` (**UTC** — can shift the "week" near midnight in non-UTC timezones).
- **Month range** 1st–last day, same UTC slicing.
- Loops logs: `hours = activityService.calculateHours(...)`; accumulates `weeklyHours`/`monthlyHours` for `status === 'working'` within ranges.
- **Productivity score:**
  - `rangeDays = 5` default; if range given: `Math.ceil(|end-start|/day) + 1` then `Math.round(rangeDays * 0.85)` (working-day estimate), min 1.
  - `expectedHoursPerMember = rangeDays * 8`.
  - Score per active member: `Math.min(100, Math.round(hours/expected*100))`; averaged.
  - **Fallback `85`** when no member has hours — empty-data dashboards show 85% "productivity".
- `activeContributors: activeContrSet.size || Math.min(totalMembers, 1)` — clamped to ≥ 1.

**(3) Dev/Git metrics:**
- For every project where `gitService.isGitRepository(folder_path)`: commit count + 10 recent commits; aggregates into `allCommits`.
- Top 10 by date → `recentCommits` (global truncation).
- `docCoverage`/`aiCoverage` percentages; both 0 when no projects.

**Gotchas:** the commit loop runs per project (all-time, no range filtering); the dashboard can stall while `gitService` executes sync git subprocesses per project.

### 3.20.3 `async getProjectAnalytics(projectId): Promise<ProjectAnalytics | null>`

- `SELECT * FROM projects WHERE id = ?`; null if absent.
- **Git stats:** `isGitRepository` → `{isRepo, commitCount, contributorsCount, recentCommits (10), lastCommitDate}`; else all defaults with `isRepo: false`.
- **Activity stats:** `getLogsByProject(projectId, 9999)`; sum working hours; `lastActivityDate` = max date; `recentLogs: slice(0,10)`.
- **Storage stats:** `projectScannerService.scanProject(project.folder_path).stats` in try/catch → `null` if the folder doesn't exist.

### 3.20.4 `async exportAnalyticsExcel(startDate, endDate, savePath): Promise<boolean>`

Four sheets:

**Sheet 1 `Overview Summary`:** title block, header, then metric rows — project (8, header fill `1F4E78`), team (7, `375623`), dev (3, `7030A0`).

**Sheet 2 `Projects List`:** frozen header; columns Name/Category/Tags/Type/Status/GitHub/Hosted/URL/Docs. Status color-coding: completed → green `E2EFDA`/`375623`; on-hold → yellow `FFF2CC`/`7F6000`; else blue `DDEBF7`/`1F4E78`.

**Sheet 3 `Team Timesheet`:** per member — sum working hours, attendance/leave counts, score; `'INACTIVE'` when `is_active !== 1`.

**Sheet 4 `Recent Commits`:** iterates `summary.devMetrics.recentCommits`; dates via `toLocaleString()`.

**Gotchas:** calls `getSummary` internally first (duplicated queries, slow with many repos); percent strings are pre-formatted (no numeric formatting).

### 3.20.5 Hard-coded constants

6-category seed, `0.85` workday factor, `8` hours/day, `5` default range days, `85` fallback score, `10` top commits, `9999` activity limit.

---

## 3.21 NotificationService

**Path:** `services/NotificationService.ts` — 508 lines. Singleton `notificationService`. Role: in-app + native notifications, the background scheduler, and three automated check types. **This is the only service that runs on a timer.**

### 3.21.1 Imports & exported types

```ts
import { app, BrowserWindow, Notification as ElectronNotification } from 'electron';
import axios from 'axios';
import tls from 'tls';
import { URL } from 'url';
```

Exported: `NotificationCategory = 'project' | 'system' | 'github' | 'user'`, `NotificationPriority = 'low' | 'medium' | 'high' | 'critical'`, `NotificationData { id, category, type, title, message, priority, isRead, projectId, projectName?, createdAt, metadata }`.

### 3.21.2 `create(input): NotificationData`

- UUID id, ISO timestamp.
- INSERT with metadata JSON-stringified (or null).
- Re-fetches via `getById(id)!`.
- **Native notification** if `ElectronNotification.isSupported()` (title/body, `silent: false`).
- **Taskbar flash:** `win.flashFrame(true)` on all non-destroyed windows.
- **`broadcast()`** → `webContents.send('notification:received', notification)` to all windows.
- **App badge:** `app.setBadgeCount(unread)` (guarded by `typeof app.setBadgeCount === 'function'`).

### 3.21.3 `getById(id)`, `list(filters?)`, `markRead(id, isRead = true)`, `markAllRead()`, `delete(id)`, `clearAll()`

- `getById`: `SELECT n.*, p.name as project_name FROM notifications n LEFT JOIN projects p ...`.
- `list`: dynamic AND-joined WHERE on category/is_read/priority; `ORDER BY created_at DESC`.
- `markRead`/`getById` use **non-null assertions** — they throw at runtime on missing rows.
- `clearAll` nukes the table unconditionally (no filter).

### 3.21.4 `startScheduler(intervalMs = 300000)` / `stopScheduler()`

- `startScheduler`: clears existing interval; runs initial `runAllChecks()` after **5 seconds**; then `setInterval(runAllChecks, 300000)` (5 minutes).
- `stopScheduler`: clears interval, nulls field. Called from both shutdown handlers (idempotent).

### 3.21.5 `runAllChecks()`

Sequential: `checkWebHealthAndSSL()` → `checkGitHubActivity()` → `checkActivityLogReminders()`; whole thing in try/catch with a single log.error.

### 3.21.6 `private checkWebHealthAndSSL()`

- `SELECT id, name, hosted_url FROM projects WHERE is_hosted = 1`.
- **HTTP check:** `axios.get(url, { timeout: 8000, validateStatus: () => true, headers: { 'User-Agent': 'ProjectManager-HealthCheck/1.0' } })`; `isUp = 200 <= status < 400`; request failure → `isUp = false`, `statusCode = 0`.
- `responseTime = Date.now() - startTime`.
- **Persists health:** inserts into `health_logs` (always) and `UPDATE projects SET last_health = ?` with `JSON.stringify({ url, statusCode, responseTime, isUp, checkedAt })`.
- **Downtime alert dedup:** only if no `downtime` notification in the last **15 minutes** (`datetime(created_at) > datetime('now', '-15 minutes')`) → `{category:'system', type:'downtime', priority:'critical', metadata:{url,statusCode}}`.
- **SSL check** (https only): `daysRemaining <= 0` → `ssl_expired` (critical, dedup 1 day); `<= 10` → `ssl_expiry_warning` (high, dedup 3 days, metadata includes `expiry`).
- Per-project try/catch; continues on failure.

### 3.21.7 `private checkSSLDetails(urlStr)` & `checkGitHubActivity()` & `checkActivityLogReminders()`

- **checkSSLDetails:** `tls.connect({ host, port: 443, servername, timeout: 6000 })`; `getPeerCertificate()`; `daysRemaining = Math.ceil((expiry - now)/day)` — **Math.ceil** (HealthService.checkSSL uses **Math.floor** — the same cert can differ by 1 day between paths).
- **checkGitHubActivity:** for every project with `github_url`: parse owner/repo via `/github\.com\/([^/]+)\/([^/]+)/`; **unauthenticated** `GET https://api.github.com/repos/{owner}/{repo}` (UA `ProjectManager-Agent/1.0`, 5 s timeout) — **rate limit: 60 req/hr unauthenticated**, and this loop can exhaust it. Compares old `github_data` vs new: `pushed_at` change → `type:'pushed'` (medium); `open_issues_count` increase → `type:'issue_created'` (medium). Always rewrites `github_data` with the fresh payload.
- **checkActivityLogReminders:** only when `now.getHours() >= 17` (5 PM local); `todayStr = now.toISOString().slice(0, 10)` (**UTC date**); if no `working` log today → `daily_reminder` (medium), deduped per day via `date(created_at) = date('now')`.

### 3.21.8 Gotchas summary

1. Dedup windows are **UTC-based** while the UI displays local time.
2. No throttling on GitHub checks → the 60 req/hr unauthenticated ceiling is reachable with ~5+ projects at 5-minute intervals.
3. `markRead`/`getById` non-null assertions throw on missing rows.
4. `create()` flashes taskbar + shows native notifications on **every** notification — high-frequency events can spam.
5. `clearAll` nukes the table unconditionally.
6. **`last_health` shape mismatch:** this service never writes `sslValid`/`sslExpiry`, but `MarkdownExporter.generateHealth` reads them → `| SSL Valid | undefined |` output. See §3.17.10.

---

## 3.22 ProjectManager

**Path:** `services/ProjectManager.ts` — 385 lines. Singleton `projectManager`. Role: project CRUD, archive/restore/hardDelete, documents.

### 3.22.1 Exported types

- `ProjectCreateInput` — name, folderPath, type (`webapp|desktop|mobile|api|library`), primaryCategory, tags?, githubUrl?, isHosted?, hostedUrl?, status?, documents?: string[] (paths), estimatedHours?, priority?.
- `ProjectData` — full camelCase projection incl. `techStack`, `lastHealth`, `currentPhase` (default `'planning'`), `healthIndicator` (default `'on-track'`), `customPhases`, `archived`.
- `DocumentData`.

### 3.22.2 Module helpers

- `rowToProject(row, documents = [])`: snake→camel mapping with **unguarded JSON parses** and `|| default` fallbacks (`primary_category || 'Web Application'`, `status || 'active'`, `current_phase || 'planning'`, `health_indicator || 'on-track'`, `estimated_hours || null` — note **0 → null**, `progress_percentage || null` — 0 → null).
- `docRowToDocument(row)`.

### 3.22.3 Methods

| Method | Behavior |
|---|---|
| `create(input)` | validates `fs.existsSync(input.folderPath)` → throws `Folder path does not exist: ...`; UUID; 15-column INSERT; `is_on_github = input.githubUrl ? 1 : 0`; `is_hosted = input.isHosted ? 1 : 0`; adds documents via `addDocument`; returns `getById(id)!` |
| `list(includeArchived = false)` | `WHERE archived = 0 ORDER BY updated_at DESC` (or `ORDER BY archived ASC, updated_at DESC`); **N+1**: per-project documents query |
| `getById(id)` | project + documents (same N+1) |
| `update(id, data)` | throws `Project not found` if missing; dynamic SET of 22 optional fields + forced `updated_at`; JSON fields stringified; returns refreshed |
| `delete(id)` | plain `DELETE FROM projects WHERE id = ?` — **no cascade, no orphan cleanup** (documents/health_logs/milestones/notifications remain; activity rows remain) |
| `archive(id)` / `restore(id)` | sets/clears `archived = 1`; returns refreshed |
| `hardDelete(id)` | manual ordered cascade: documents → health_logs → milestone_dependencies (subquery) → milestones → notifications → `UPDATE activity_logs SET project_id = NULL` (deliberate orphan, keeps history) → DELETE project. **Not wrapped in a transaction** |
| `addDocument(projectId, filePath, isAiGenerated = false)` | `docType = isAiGenerated ? 'auto-generated' : (ext || null)`; INSERT |
| `removeDocument(documentId)` | if AI-generated **and the file exists**: `fs.unlinkSync(doc.file_path)` — deletes the file from disk; then DELETE row |
| `getDocuments(projectId)` | read-only, `ORDER BY created_at DESC` |

### 3.22.4 Gotchas summary

1. Unguarded `JSON.parse` in `rowToProject` — corrupt JSON crashes `list()`/`getById()`.
2. `estimated_hours || null` and `progress_percentage || null` map **0 to null**.
3. `delete()` leaves orphans; only `hardDelete` cleans up, and it orphans activity logs rather than deleting them.
4. No transaction around `hardDelete` — a mid-sequence failure leaves partial deletes.
5. `update` accepts `Partial<ProjectData>` (camelCase UI shape) — callers must send the UI shape, not the DB shape.
6. `archive`/`restore` don't check existence before the `!` assertion.

---

## 3.23 OllamaService

**Path:** `services/OllamaService.ts` — 451 lines. Singleton `ollamaService`. Role: local LLM report generation (streaming), model listing, save + explain. **This is the file the user typically opens when working on AI features.**

### 3.23.1 Constants & constructor

```ts
export const SYSTEM_PROMPT = `...`;      // ~150 lines — 17-section comprehensive markdown report
export const PHI_SYSTEM_PROMPT = `...`;  // condensed 7-section variant for small models
```

- `SYSTEM_PROMPT` demands a 17-section report: overview, folder structure, mermaid architecture, tech stack, per-file docs, function/class reference, DB/API docs, data flow, execution flow, security review, performance review, missing docs, improvements, onboarding, conclusion. Instructs text-only output and to never truncate.
- `PHI_SYSTEM_PROMPT` is "extremely concise" for phi/gemma/1.5b/2b models.

Constructor:
```ts
this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
this.defaultModel = process.env.OLLAMA_DEFAULT_MODEL || 'llama3';
```
Private fields: `baseUrl`, `defaultModel`, `abortController: AbortController | null`.

### 3.23.2 `async isAvailable(): Promise<boolean>`

`axios.get(baseUrl + '/api/tags', { timeout: 5000 })` → `true` iff status 200; any error → false. This is the "Ollama running?" probe used by the UI (`reportStore.checkOllama`).

### 3.23.3 `async listModels(): Promise<string[]>`

GET `/api/tags` → `models[].name`; failure → `[]`.

### 3.23.4 `async generateReport(folderPath, model?, onChunk?): Promise<string>`

- **Signature note:** the third argument is `onChunk` — unlike Gemini/OpenRouter, **no caller-supplied system prompt**; the prompt is chosen by model class.
- Walks via `fileWalker.walkDirectory`; throws a descriptive error if no files.
- **maxTokens by model name** (lowercased substring matching):
  - `qwen` / `llama3.1` / `llama3.3` → `24000`
  - `phi` / `1.5b` / `2b` (not gemma) → `2000`; gemma → `8000`
  - else → `6000`
- `fileWalker.buildContext(folderPath, maxTokens)` — context budget = model max.
- `isLightweight = phi | gemma | 2b | 1.5b` → `PHI_SYSTEM_PROMPT`, else `SYSTEM_PROMPT`.
- Prompt = systemPrompt + project files context + "Please generate the comprehensive project report now."
- **Streaming request:** `axios.post(baseUrl + '/api/generate', { model, prompt, stream: true }, { responseType: 'stream', signal: abortController.signal, timeout: 300000 })`.
- **NDJSON parsing:** each chunk UTF-8 decoded, split on `\n`, each line `JSON.parse`d (`{"response": ..., "done": bool}`); appends `parsed.response` to `fullResponse` and calls `onChunk(parsed.response)` — the feed for the `ai:chunk` IPC push. Resolves on `done: true`; `end` event also resolves (defensive double-resolve no-op); `error` rejects.
- **Cancellation:** `CanceledError`/`AbortError` → `throw new Error('Generation cancelled')`.
- **Error body extraction:** drains the error stream, JSON-parses to surface `{error: ...}` as `Ollama Error: ...`.
- `finally { this.abortController = null; }`.

**Quirk:** per-chunk NDJSON line parsing can drop tokens if a JSON line straddles TCP chunk boundaries (rare in practice — Ollama usually sends whole lines).

### 3.23.5 `cancelGeneration(): void`

Aborts the stored controller (logs). **Wiring gap:** `ai:cancelStream` in aiHandlers.ts never calls this — cancellation via IPC only stops chunk forwarding, not the underlying request (§5.43.5).

### 3.23.6 `async saveReport(folderPath, content): Promise<string>`

- Creates `<folderPath>\.pm-reports\` recursively.
- `auto-report.md`; if exists → `auto-report-v2.md`, `-v3`, ... (version loop).
- **Disclaimer scrub:** 4 regexes strip leading LLM preambles ("Note that this is a generated response...", "The output is the same as the code provided...", "As an AI, I cannot create markdown files directly...", "I'm sorry, but I can't assist with that task...").
- Writes and returns the path. **No DB** (document registration is done by aiHandlers).

### 3.23.7 `async explainFile(filePath, fileContent, model?): Promise<string>`

Non-streaming POST `/api/generate` with an "explain this file" prompt, `stream: false`, 60 s timeout; returns `response.data.response`.

### 3.23.8 Gotchas summary

1. `generateReport` cannot take a caller-supplied system prompt.
2. `ai:cancelStream` does not abort the HTTP stream.
3. 5-minute hard timeout; no progress callback besides text chunks.
4. `saveReport` writes into `.pm-reports` — which both walkers ignore, so reports are never re-fed to the model.
5. Model-name heuristics are substring-based (`my-llama3.1-custom` gets 24k tokens).
6. Depends on Ollama NDJSON format, not OpenAI-style SSE.

---

## 3.24 GitHubService

**Path:** `services/GitHubService.ts` — 388 lines. Singleton `githubService`. Role: GitHub REST API wrapper — token management, repos, branches, commits, contents. **Stateless except the in-memory token.**

### 3.24.1 Token management

- `setToken(token)` / `getToken(): string | null` — **in-memory only, never persisted** to disk or DB. The renderer's settings store persists it and re-sends it at app start.
- `private getHeaders()`: `Accept: application/vnd.github.v3+json`, `User-Agent: 'ProjectManager-Desktop'`, `Authorization: Bearer <token>` when set.

### 3.24.2 Methods

| Method | Behavior |
|---|---|
| `parseGitHubUrl(url)` | regexes `/github\.com\/([^\/]+)\/([^\/\s#?]+)/` and `/github\.com:([^\/]+)\/([^\/\s#?.]+)/` (ssh scp-style); `.git` stripped; null otherwise. **The primary URL-parsing contract, unit-tested** |
| `validateRepo(url)` | GET repo (10 s timeout) → true iff 200; failures → false |
| `getMetadata(url)` | GET repo → maps ~19 fields incl. `topics`, `license.spdx_id`; throws `'Invalid GitHub URL'` on parse failure |
| `detectPages(url)` | if `!has_pages` → `{ hasPages: false }`; else GET `/pages` → `{ hasPages: true, pagesUrl, customDomain }`; errors → `{ hasPages: false }` |
| `detectHostingProvider(homepage)` | substring checks: `.github.io`, `vercel.app`, `netlify.app`, `.surge.sh`, `.herokuapp.com`, `.railway.app`, `.fly.dev`, `.render.com`; any other homepage → `'Custom Domain'`; null → null |
| `getUser()` | GET `/user` → mapped `GitHubUser` |
| `checkTokenScopes()` | GET `/user`; reads `x-ratelimit-*` headers (fallback `{limit:60, remaining:60, reset:0}`); parses `x-oauth-scopes` (classic tokens; **fine-grained tokens omit this header**); returns masked token (`slice(0,8) + '...'`), user, `isValid`, rateLimit. On 401 → `{ token: masked, scopes: [], user: null, isValid: false, ... }`; other errors rethrow |
| `getUserRepos(page = 1, perPage = 50)` | GET `/user/repos?sort=updated&per_page&page&type=all` (15 s); maps 18 fields |
| `getBranches(owner, repo)` | GET `/repos/o/r/branches?per_page=100` (cap 100) |
| `getCommits(owner, repo, branch = 'main', page = 1, perPage = 30)` | GET `/repos/o/r/commits?sha=&per_page&page`; maps author/committer `{name, email, date}`, message, htmlUrl, `authorAvatar` |
| `getFileTree(owner, repo, branch = 'main')` | **despite the name, hits the Contents API at repo root**: GET `/repos/o/r/contents?ref=` — root-level only, not a recursive git tree |
| `getDirContents(owner, repo, path, branch = 'main')` | same mapping for `/contents/{path}` |
| `getFileContent(owner, repo, path, branch = 'main')` | GET with `Accept: application/vnd.github.v3.raw` → raw content; JSON fallback via `JSON.stringify` if axios returns an object |

### 3.24.3 Gotchas summary

1. Token is memory-only — must be re-set after every app start.
2. Fine-grained tokens won't report scopes properly.
3. `getFileTree` is root-only despite the name.
4. Timeouts 10–15 s; errors propagate raw (only 401 and validate/detectPaths are special-cased).

---

## 3.25 TimelineService

**Path:** `services/TimelineService.ts` — 410 lines. Singleton `timelineService`. Role: milestone CRUD, dependency management, project planning fields, timeline analytics.

### 3.25.1 Exported types

- `MilestoneData` — mirrors `Milestone` from `src/types/Milestone.ts` plus `notes`, `workflowStatus` (default `'Backlog'`), `priority`.
- `TimelineAnalytics` — overallCompletion, phaseCompletion, delayedCount, upcomingCount, delayed/upcoming lists, `calculatedHealth`, durationDays.

### 3.25.2 Methods

| Method | Behavior |
|---|---|
| `getById(id)` | `SELECT m.*, t.name as member_name, t.role as member_role FROM milestones m LEFT JOIN team_members t ON m.responsible_member_id = t.id` + dependency loads `SELECT depends_on_id FROM milestone_dependencies WHERE milestone_id = ?` |
| `listMilestones(projectId)` | same join, `ORDER BY target_date ASC`; **N+1** dependency queries |
| `createMilestone(payload)` | 16-column insert; defaults `status 'pending'`, `progress ?? 0`, `workflowStatus 'Backlog'`; inserts each dependency row. **No validation** that dependency ids exist or `targetDate >= startDate` |
| `updateMilestone(id, payload)` | throws `Milestone not found`; dynamic SET (11 optional fields); **dependency replacement** — if `payload.dependencies !== undefined` → DELETE all + re-insert |
| `deleteMilestone(id)` | **only** `DELETE FROM milestones WHERE id = ?` — **leaves `milestone_dependencies` rows pointing at the deleted milestone** (orphan rows accumulate; the CPM calculator ignores unknown dep ids) |
| `updateProjectPlanning(projectId, payload)` | dynamic `UPDATE projects SET` for start/expected/actual end, current_phase, health_indicator, estimated_hours, priority (+ updated_at); skips if no fields; returns void |
| `getTimelineAnalytics(projectId)` | see below |

### 3.25.3 `getTimelineAnalytics(projectId): TimelineAnalytics`

- `todayStr = new Date().toISOString().split('T')[0]` (**UTC**).
- **Overall completion:** average of milestone `progress` (0–100), rounded; zero when no milestones.
- **Phase completion:** same, filtered to `m.phase === currentPhase` (`current_phase || 'planning'`).
- **Delayed:** `status !== 'completed' && targetDate < todayStr`; **Upcoming:** `status !== 'completed' && targetDate >= todayStr`.
- **Auto health:** `delayedCount > 2 → 'critical'`; `> 0 → 'at-risk'`; else if `expected_end_date < today && no actual_end_date → 'critical'`; else `'on-track'`. (**Hard-coded "critical = > 2 delayed" policy.**)
- **durationDays:** `Math.ceil((end - start)/day)` with `Math.max(0, ...)`; end = actual if set else expected.

### 3.25.4 Gotchas summary

1. UTC `todayStr` — near-midnight local differences can mark milestones delayed a day early/late.
2. `deleteMilestone` leaves orphan dependency rows.
3. N+1 dependency queries.
4. `progress` accepts any number without clamping (0–100 convention).
5. The stored `health_indicator` is ignored by analytics (recomputed).

---

## 3.26 MarkdownExporter

**Path:** `services/MarkdownExporter.ts` — 269 lines. Singleton `markdownExporter`. Role: Markdown report generators. **No direct DB access** — delegates to `projectManager` and `healthService`. (The `log` import is unused.)

### 3.26.1 `generateSummary(projectId): string`

- Throws `Project not found` if missing.
- `# {name} — Project Summary`, "Generated on" line (`toLocaleDateString('en-US', ...)`), info table (Name/Type/Folder/Created/Last Updated).
- Optional blocks: GitHub (link + stars/forks/open issues/language/visibility/last push — read unguarded, `undefined` renders), Tech Stack (backtick items joined by ` · `), Attached Documents (📄 bullets with `— AI Generated` suffix).
- **Emoji are intentional** here: ⭐🍴💬🔤👁📅📄 and 🟢/⬜ for hosted status.

### 3.26.2 `generateTechStack(projectId): string`

Tech table `| Technology | Category |` using `categorizeTech`; empty-state message; "Primary Language" from `githubData.language`.

### 3.26.3 `generateArchitecture(projectId): string`

Overview sentence; **Mermaid `graph LR`** with tech-stack nodes (`T0["..."]`) — **no edges** (isolated nodes, arguably a rendering quirk); source control section; deployment section.

### 3.26.4 `generateHealth(projectId): string`

- Early-return "not hosted" note if `!isHosted || !hostedUrl`.
- Current status table from `lastHealth` via `healthService.getHealthStatus` — icons 🟢/🟡/🔴.
- Reads `lastHealth.statusCode/.responseTime/.sslValid/.sslExpiry/.checkedAt` — **`sslValid`/`sslExpiry` are never written by NotificationService** → renders `undefined` (§3.21.8).
- History table from `healthService.getHealthLogs(projectId, 20)` — ssl fields work here (real columns).

### 3.26.5 `generateFull(projectId): string`

Concatenates summary + techstack + architecture + health separated by `\n\n---\n\n`.

### 3.26.6 Private `categorizeTech(tech): string`

Keyword lists per category (Frontend Framework, CSS Framework, Backend, CMS, Analytics, CDN/Hosting, Library) — exact-match; fallback `'Other'`. Tech names must match the analytics detector's output strings (e.g. `'Next.js'`, `'Tailwind CSS'`).

---

## 3.27 GitService

**Path:** `services/GitService.ts` — 111 lines. Singleton `gitService`. Role: local git CLI wrapper. **All methods are synchronous `execSync`** — each call can block the main process up to the timeout.

| Method | Behavior |
|---|---|
| `isGitRepository(folderPath)` | `fs.existsSync(path.join(folderPath, '.git'))` — a `.git` **file** (worktree/submodule) also passes; empty path → false |
| `getCommitCount(folderPath)` | `git rev-list --count HEAD` (cwd, 5 s timeout); failures → 0 |
| `getRecentCommits(folderPath, projectName, limit = 10)` | `git log -n ${limit} --pretty=format:"%h\|%an\|%ad\|%s"`; splits on `\|`, **rejoins message parts** (`parts.slice(3).join('|')`) to survive pipes; date → ISO (fallback: **current time** on parse failure — misleading but graceful) |
| `getContributorsCount(folderPath)` | `git log --pretty="%an"` → unique author names via Set (same-name-different-email collapses) |

Gotchas: `execSync` blocks the main process (AnalyticsService loops over all projects — dashboards can stall); `%ad` respects git config date format (unusual formats → today's date); commands are fixed strings (no user input interpolated — safe), but `cwd` is user-controlled.

---

## 3.28 HealthService

**Path:** `services/HealthService.ts` — 192 lines. Singleton `healthService`. Role: HTTP + TLS health checks and health-log persistence.

### 3.28.1 Exported types

- `HealthResult { url, statusCode, responseTime, isUp, sslValid, sslExpiry, redirectCount, finalUrl, checkedAt }`
- `SSLResult { valid, expiry, issuer, daysRemaining }`

### 3.28.2 Methods

| Method | Behavior |
|---|---|
| `check(url)` | `axios.get(url, { timeout: 15000, maxRedirects: 10, validateStatus: () => true, headers: { 'User-Agent': 'ProjectManager-HealthCheck/1.0' } })`; `isUp = 200 <= status < 400`; `redirectCount = response.request?._redirectable?._redirectCount \|\| 0` (axios-internal — brittle); `finalUrl = response.request?.res?.responseUrl \|\| url`; request errors → statusCode 0, isUp false; **SSL checked inline** (`await this.checkSSL(url)`) — so `responseTime` includes the SSL handshake; HTTP-only → sslValid false |
| `checkSSL(url)` | non-https → `{valid:false, expiry:null, issuer:null, daysRemaining:null}`; `tls.connect({ host, port: parseInt(parsedUrl.port) \|\| 443, servername, timeout: 10000 })`; `daysRemaining = Math.floor((expiry - now)/day)` (**floor** — NotificationService uses ceil); `valid = daysRemaining > 0`; `issuer = cert.issuer?.O` |
| `saveHealthLog(projectId, result)` | INSERT into `health_logs` — **redirectCount and finalUrl are dropped** (no columns) |
| `getHealthLogs(projectId, limit = 50)` | `SELECT * ... ORDER BY checked_at DESC LIMIT ?`; **rehydrates `redirectCount: 0` and `finalUrl: row.url`** (fabricated) |
| `getHealthStatus(result)` | `!isUp → 'down'`; `responseTime > 2000 → 'degraded'`; `!sslValid && url.startsWith('https') → 'degraded'`; else `'healthy'` |

Gotchas: responseTime double-counts SSL; redirect/finalUrl lost on persist and re-faked on read; floor-vs-ceil inconsistency vs. NotificationService; `url.startsWith('https')` has no colon check.

---

## 3.29 FileWalker

**Path:** `services/FileWalker.ts` — 268 lines. Singleton `fileWalker` (`new FileWalker(ignoreDirs?, maxTokens = 8000)`). Role: source-file discovery + LLM context building. **Shared by all three AI providers.**

### 3.29.1 Constants

- `DEFAULT_IGNORE` (19 entries; includes `.pm-reports`).
- `SOURCE_EXTENSIONS` (39 entries, incl. `.env`, `.gitignore`, `.dockerfile`, `.md`, `.txt`, `.sql`).
- `PRIORITY_FILES` (24 entries: README.md/readme.md/README, package.json, requirements.txt, Pipfile, pyproject.toml, Cargo.toml, go.mod, build.gradle, pom.xml, pubspec.yaml, Gemfile, composer.json, tsconfig.json, vite/next/webpack configs, .env.example, Dockerfile, docker-compose.*).

### 3.29.2 Methods

| Method | Behavior |
|---|---|
| `walkDirectory(dirPath)` | recursive walk; skips ignore dirs and dot-dirs **except `.env.example`**; files with **no extension** included only if the exact name is in `['Preferences', 'First Run', 'Local State', 'Dockerfile', 'Makefile', 'LICENSE', 'config']` (a bizarre Electron-profile-derived allowlist); skips files `> 1MB`; `relativePath` normalized |
| `buildContext(dirPath, maxTokensOverride?)` | walks; **priority files first** (PRIORITY_FILES declaration order) then regular files sorted by extension (`localeCompare`); token estimation `Math.ceil(chars / 4)`; emits `## Project File Structure` block; per file: reads UTF-8, truncates to `maxFileChars = 4000` (+ `'... (truncated)'`), wraps in `## <path>\n\`\`\`<ext>\n<content>\n\`\`\``; **budget enforcement** skips files that would exceed the limit; if partially fitting with > 200 chars left, emits a cut-off slice + `'... (context limit reached)'` and breaks |
| `getProjectStats(dirPath)` | counts files per `extensionToLanguage`, sums size |

### 3.29.3 Gotchas summary

1. The no-extension allowlist force-includes oddly-named files in user projects.
2. `content` field on `FileInfo` is declared but **never populated** (dead API surface).
3. The singleton's default budget is 8000 tokens, but Gemini/OpenRouter callers override to **100000** — a huge prompt most models reject/truncate (no context-limit check).
4. Token math is a crude chars/4 heuristic.
5. `buildContext` truncation can cut mid-file mid-code-fence.

---

## 3.30 GeminiService

**Path:** `services/GeminiService.ts` — 83 lines. Singleton `geminiService`. Role: Google Gemini streaming reports + file explanations.

- Private field: `private modelName = 'gemini-3.5-flash'` — **note: not an officially-named current model** (likely a placeholder; callers pass `modelName` explicitly, so the default rarely matters).

### 3.30.1 `async generateReportStream(folderPath, modelName, systemPrompt, apiKey, onChunk): Promise<string>`

- Throws `'Gemini API key is not configured in Settings.'` without a key.
- Walks folder; throws `'No source code files were found in the selected folder.'` if empty.
- `fileWalker.buildContext(folderPath, 100000)`.
- `genAI.getGenerativeModel({ model: targetModel, systemInstruction: systemPrompt })`.
- `model.generateContentStream(prompt)`; iterates `result.stream`, accumulates `chunk.text()`, calls `onChunk` per chunk (feed for `ai:chunk`).
- Errors logged + rethrown.

### 3.30.2 `async explainFile(filePath, fileContent, apiKey): Promise<string>`

Non-streaming `generateContent` with the standard explanation prompt; returns `result.response.text()`.

### 3.30.3 Gotchas

1. Default model id is likely invalid.
2. 100k-token context request with no model-context awareness.
3. **No cancellation support** — `ai:cancelStream` only stops chunk forwarding; the HTTP stream continues.

---

## 3.31 OpenRouterService

**Path:** `services/OpenRouterService.ts` — 132 lines. Singleton `openRouterService`. Role: OpenRouter streaming reports + explanations.

### 3.31.1 `async generateReportStream(folderPath, modelName, systemPrompt, apiKey, onChunk): Promise<string>`

- Throws without API key.
- Walk + context (100k tokens).
- `POST https://openrouter.ai/api/v1/chat/completions` with:
  - body `{ model, messages: [system, user], stream: true }`
  - headers: `Authorization: Bearer <key>`, `HTTP-Referer: https://github.com/manosakthi/project-manager`, `X-Title: 'Junglans Project Manager'`, `Content-Type: application/json`; `responseType: 'stream'`. **No timeout** — a hung stream hangs forever.
- **SSE parsing:** split into lines; `data: ` prefixed lines JSON-parsed → `parsed.choices?.[0]?.delta?.content` appended + `onChunk`; `[DONE]` skipped. Resolves on `end`; rejects on stream `error`.

### 3.31.2 `async explainFile(filePath, fileContent, apiKey): Promise<string>`

Hard-coded `model: 'openai/gpt-4o-mini'` — **ignores any caller model preference**.

### 3.31.3 Gotchas

1. No request timeout on the streaming call.
2. `explainFile` silently hard-codes gpt-4o-mini.
3. No abort support.

---

## 3.32 TeamService

**Path:** `services/TeamService.ts` — 131 lines. Singleton `teamService`. Role: team member CRUD.

| Method | Behavior |
|---|---|
| `list()` | `SELECT * FROM team_members ORDER BY name ASC`; `isActive: row.is_active === 1` |
| `create(payload)` | `isActive` defaults **1**; `avatar = payload.avatar \|\| getRandomAvatarColor()`; 8-column insert; returns locally-built object |
| `update(id, payload)` | throws `Team member with ID ${id} not found`; field fallback per key; preserves `createdAt` |
| `delete(id)` | always returns true. **No guard against deleting members referenced by `activity_logs.member_id` or `milestones.responsible_member_id`** — dangling references (JOINs yield NULL names, which join-based reads tolerate) |

`getRandomAvatarColor()` picks from `['indigo','emerald','blue','purple','rose','amber','pink','teal']` (Tailwind names) — the avatar is a **color name string**, not a URL.

---

## 3.33 ProjectNotesService & ProjectTemplateManager

Both are **object literals** (no class) — the two exceptions to the singleton-class pattern.

### 3.33.1 ProjectNotesService (50 lines)

`export const ProjectNotesService = { get, upsert, delete };` with `ProjectNote { id, projectId, content, createdAt, updatedAt }`.

- `get(projectId)`: `SELECT * FROM project_notes WHERE project_id = ?` → note or null. One note per project.
- `upsert(projectId, content)`: SELECT id; UPDATE if exists else INSERT (UUID via **`crypto.randomUUID()`** — the global, unlike `uuid.v4()` everywhere else); returns `get(projectId)!`.
- `delete(projectId)`: DELETE by project id.
- No validation that the project exists; content stored raw (markdown).

### 3.33.2 ProjectTemplateManager (113 lines)

`export const ProjectTemplateManager = { list, get, create, update, delete };` with `ProjectTemplate { id, name, description, type, primaryCategory, tags[], techStack[], milestones: {name, phase, description}[], createdAt, updatedAt }`.

- `list()`: `SELECT * FROM project_templates ORDER BY name ASC`.
- `create(payload)`: 10-column insert; tags/techStack/milestones JSON-stringified; returns `get(id)!`.
- `update(id, payload)`: throws `'Template not found'`; **full-column UPDATE** with `??`/ternary merge per field (fragile ternary: `payload.tags ? JSON.stringify(payload.tags) : JSON.stringify(existing.tags)`).
- `delete(id)`: DELETE by PK.
- Templates store milestones denormalized as a JSON column.

---

## 3.34 AnalysisService

**Path:** `services/AnalysisService.ts` — 223 lines. Singleton `analysisService`. Role: HTTP-only webpage analysis (SEO/tech stack/links/assets). **No database.**

### 3.34.1 `async analyze(url): Promise<AnalysisResult>`

- `axios.get(url, { timeout: 30000, maxRedirects: 5, headers: { 'User-Agent': Chrome 120 UA } })` (browser UA for better server responses).
- `loadTime = Date.now() - startTime` (HTTP only, no JS execution).
- **SEO extraction** (regexes):
  - `<title[^>]*>(.*?)<\/title>` (s, i flags).
  - `<meta ... name="description" ... content="...">` — **attribute order matters** (name before content; reversed order won't match).
  - `<link ... rel="canonical" ... href="...">` — same ordering constraint.
  - `<h1[^>]*>` count.
- **Tech stack detection:** substring checks on HTML (`__NEXT_DATA__`, `_next/`, `__NUXT__`, `data-reactroot`, `__react`, `ng-version`, `ng-app`, `data-v-`, `Vue.js`, `__svelte`, jquery, bootstrap, tailwind, googleapis/ajax, google-analytics, gtag/googletagmanager, wp-content/wordpress, shopify) + headers (`server`, `x-powered-by`, `x-vercel-id` → Vercel, `x-netlify-request-id` → Netlify). Deduped via Set.
- **Links:** `href="..."` regex over raw HTML (matches inside comments/scripts too); skips `#`, `javascript:`, `mailto:`; `/`-prefixed or origin-matching → internal; `http`-prefixed → external; **`broken` is always `[]`** (no HEAD validation despite the field name).
- **Images:** `<img[^>]*>` count; missing/empty `alt` → counted as without-alt.
- **Asset sizes:** only **inline** `<script>`/`<style>` content size — external asset sizes are not fetched (`totalJsSize`/`totalCssSize` are inline-char-counts only).
- `fcp/lcp/tti` are always **null** (real web-vitals would need a headless browser — Puppeteer was dropped for portability).
- robots.txt/sitemap via `axios.head(origin + path, { timeout: 5000 })` → 200 check.
- Errors: `log.error` + rethrow `Analysis failed: <msg>`.

### 3.34.2 Gotchas

1. `fcp/lcp/tti` permanently null; asset sizes only measure inline JS/CSS — the "performance" report is largely decorative.
2. Regex SEO extraction is order-sensitive.
3. `broken` links list is always empty (stub).
4. Link counting overcounts (hrefs inside scripts/comments).
5. Requires absolute http(s) URLs (`new URL(url).origin`).

---

## 3.35 CriticalPathCalculator

**Path:** `src/utils/CriticalPathCalculator.ts` — 113 lines. **Pure function module** (not a service, no singleton, no DB).

```ts
export interface CPMResult {
  milestoneId; earlyStart; earlyFinish; lateStart; lateFinish; totalFloat; isCritical;
}
export function calculateCriticalPath(milestones: Milestone[]): Map<string, CPMResult>
```

### 3.35.1 The algorithm

**Setup:**
1. Empty/undefined input → empty Map.
2. Builds `idMap` and `durationMap`.
3. **Duration per milestone:** `start = new Date(m.startDate || Date.now()).getTime()`; `target = new Date(m.targetDate || Date.now() + 86400000).getTime()`; `durationDays = Math.max(1, Math.ceil((target - start) / 86400000))` — **durations are integer days, min 1** (float arithmetic internally, integral results).
4. Seeds every result with ES=0, EF=duration, LS=0, LF=duration, float 0.

**Forward pass:**
- Iterates milestones **in array order** (⚠ **NOT topologically sorted**):
  - `maxPredecessorEF = max(pred.earlyFinish)` over `m.dependencies` (unknown/missing deps ignored).
  - `earlyStart = maxPredecessorEF`; `earlyFinish = earlyStart + duration`.
  - Tracks `maxProjectFinish`.
- **Correctness gotcha:** if a milestone depends on one that appears LATER in the input array, its early times are computed with the seed values of the not-yet-processed dependency → wrong results. **Callers must supply milestones in dependency order.** The test file supplies m1 before m2, which hides this.

**Backward pass:**
1. Initialize every milestone's `lateFinish = maxProjectFinish`; `lateStart = lateFinish - duration`.
2. Build `successorsMap` (depId → dependents).
3. Iterate `for (let i = milestones.length - 1; i >= 0; i--)` — reverse array order (again order-dependent):
   - If successors exist: `lateFinish = min(succ.lateStart)`; `lateStart = lateFinish - duration`.

**Float & critical flag:**
- `totalFloat = Math.max(0, item.lateStart - item.earlyStart)` — **clamps negatives to 0**.
- `isCritical = totalFloat === 0`.
- ⚠ **Exact-zero comparison on floating-point subtraction** — safe here because durations are integers (IEEE-754 exact), but fractional durations would break it. The clamping also marks inconsistent schedules (negative float) as **critical** — debatable semantics.
- The critical path = all milestones with `totalFloat === 0` (the code does not reconstruct the chain).

### 3.35.2 Edge cases handled

Empty input; missing dates (fallbacks); unknown dependency ids (guarded); milestones with no dependencies (ES=0).

**Not handled:** cycles (no crash — consistent-but-wrong floats), duplicate ids (last wins), topological ordering (caller responsibility), fractional days (ceiled).

### 3.35.3 Quirks summary

1. **Array-order dependence is the single most important caveat** — no topological sort.
2. Float `=== 0` criticality check works only because durations are integers.
3. Negative float clamped to 0 → flagged critical.
4. A milestone with target before start gets a 1-day duration.

---

## 3.36 Service Tests

Three Vitest test files live in `services/` plus one in `src/utils/`. All mock their dependencies heavily; there are **no integration tests** (no real DB, no real network, no real git).

### 3.36.1 `GitHubService.test.ts` (115 lines)

- Setup: `vi.mock('axios')` (whole module), fresh `new GitHubService()` per test, `vi.clearAllMocks()`.
- **parseGitHubUrl** (4 tests): https with/without `.git`, SSH `git@github.com:owner/repo.git`, and negative (GitLab URL → null).
- **detectHostingProvider** (4 tests): GitHub Pages, Vercel, Custom Domain fallback, null homepage.
- **validateRepo** (2 tests): mocked axios 200 → true; reject → false.
- **getMetadata** (1 test): full fake API payload mapped field-by-field (golden-object equality).

### 3.36.2 `HealthService.test.ts` (89 lines)

- Setup: mocks `axios`, `tls`, and `../database/db` (a chainable fake `prepare → {run, all}`).
- **getHealthStatus** (4 tests): down / degraded-by-latency (>2000) / degraded-by-SSL-on-https / healthy — table-driven.
- **check** (2 tests): success path (mocks axios response incl. the internal `request._redirectable._redirectCount` and `request.res.responseUrl`, spies `checkSSL` via `vi.spyOn`) asserting statusCode/isUp/redirectCount/finalUrl/sslExpiry/checkedAt; failure path.

### 3.36.3 `ProjectManager.test.ts` (120 lines)

- Setup: mocks `uuid` (`v4 → 'test-uuid'`), `fs` (only `existsSync`, `unlinkSync`), `electron-log`, and `../database/db` with module-level `mockRun/mockAll/mockGet` functions returned from `prepare()`.
- **create** (2 tests): throws on nonexistent folder; happy path asserts `mockRun` called + returned object.
- **list** (2 tests): returns mapped rows from `mockAll` sequence.
- **delete** (1 test): asserts `mockRun` called with the id.

### 3.36.4 `CriticalPathCalculator.test.ts` (61 lines)

- Empty array → empty map.
- Two sequential milestones (m2 depends on m1) → both `isCritical === true`.

### 3.36.5 Coverage gaps

No tests for: ActivityService (calculateHours heuristic, Excel export), AnalyticsService, TimelineService, NotificationService, ProjectScannerService, FileWalker, the three AI providers, ProjectNotesService/ProjectTemplateManager, GitService, MarkdownExporter.

---

## 3.37 The `ai:chunk` IPC chain (end-to-end, verified)

1. Renderer calls `window.api.ai.generateOllamaReport(projectId, folderPath, model)` (preload `ipcRenderer.invoke('ai:generateOllamaReport', ...)`).
2. `aiHandlers.ts` calls `ollamaService.generateReport(folderPath, model, onChunk)` where `onChunk` guards `isCancelled` and does `window.webContents.send('ai:chunk', chunk)`.
3. Preload exposes `onChunk(callback)` / `removeChunkListener()` backed by `ipcRenderer.on('ai:chunk', ...)`.
4. The Gemini/OpenRouter paths mirror this (their services accept a custom systemPrompt; Ollama's does not).
5. **Gap:** `ai:cancelStream` sets `isCancelled = true` only — it neither aborts the axios stream nor calls `ollamaService.cancelGeneration()` (which exists and is wired to an AbortController). The renderer's streaming UI stops updating, but the model keeps generating server-side; the report is not saved (aiHandlers skips `saveReport` when cancelled), but the model ran to completion.

---

# PART 4 — STORES, TYPES & UI

This part moves into the renderer (React) side of the application. It covers the ten Zustand stores in `src/store/`, the ten type modules in `src/types/`, the page layer in `src/pages/`, the component library in `src/components/`, the theming system in `src/index.css`, and finally the application shell (`App.tsx`, `main.tsx`) together with the `GlobalSearch` command palette.

A quick orientation note before the deep dive: the renderer contains **no direct Node.js access** — every piece of persistent data arrives through `window.api.*` IPC calls that the stores wrap. Components that need data almost always go through a store; only five components call `window.api` directly (see §4.40.21). The overall renderer dependency shape is:

```
pages ──► components ──► stores ──► window.api (preload) ──► ipcMain ──► services ──► database
                             └────► window.api ────────────────────────────────────┘ (5 components bypass stores)
```

---

## 4.37 State Management with Zustand

All renderer state is managed by **Zustand** (`create` from `zustand`). There are exactly **ten stores** in `src/store/`. Nine of them are plain `create<State>()((set, get) => ...)` stores with zero persistence. The single exception is `settingsStore`, which uses the `persist` middleware against `localStorage` — and even then, the notification store hand-rolls its own persistence for one boolean flag outside Zustand (see §4.37.9).

### 4.37.1 Store inventory

| # | File | Hook | State size | Persist? | IPC namespaces used |
|---|---|---|---|---|---|
| 1 | `activityStore.ts` | `useActivityStore` | 5 fields | No | `activity.*` |
| 2 | `analyticsStore.ts` | `useAnalyticsStore` | 5 fields | No | `analytics.*` |
| 3 | `projectStore.ts` | `useProjectStore` | 5 fields | No | `project.*` |
| 4 | `timelineStore.ts` | `useTimelineStore` | 8 fields | No | `timeline.*` |
| 5 | `healthStore.ts` | `useHealthStore` | 6 fields | No | `health.*` |
| 6 | `explorerStore.ts` | `useExplorerStore` | 14 fields | No | `explorer.*` + `project.readDocument` |
| 7 | `settingsStore.ts` | `useSettingsStore` | 4 fields | **Yes** (`junglans-settings`) | none |
| 8 | `notificationStore.ts` | `useNotificationStore` | 8 fields | No (manual flag) | `notification.*` |
| 9 | `teamStore.ts` | `useTeamStore` | 3 fields | No | `team.*` |
| 10 | `reportStore.ts` | `useReportStore` | 9 fields | No | `ai.*` |

Cross-store coupling is **limited and strictly uni-directional** (see §4.37.12): `projectStore` is the shared data hub that `timelineStore` and `reportStore` call into for refreshes, and `settingsStore` is read (never written) by `explorerStore` and `reportStore`. No store calls another store's mutating actions.

The rest of this section documents each store's state interface and every action, including error behavior and rethrow semantics.

---

### 4.37.2 `activityStore.ts` — `useActivityStore`

**Imports:** `create` from `zustand`; `ActivityLog`, `ActivityLogPayload`, `WeeklySummary` from `../types/Activity`.

#### State interface (`ActivityState`)

| Field | Type | Default |
|---|---|---|
| `logs` | `ActivityLog[]` | `[]` |
| `isLoading` | `boolean` | `false` |
| `error` | `string \| null` | `null` |
| `weeklySummary` | `WeeklySummary \| null` | `null` |
| `selectedDate` | `string` | today (`YYYY-MM-DD`) |

#### Actions

1. **`fetchLogs: () => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.activity.list()` → `logs`.
   - Success: `set({ logs, isLoading: false })`. Error: `set({ error: (error as Error).message || 'Failed to fetch activity logs', isLoading: false })`; **no rethrow**.

2. **`createLog: (payload: ActivityLogPayload) => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.activity.create(payload)`.
   - Success: clears loading and **refetches the full list** (`get().fetchLogs()`) — no local optimistic insert.
   - Error: `set({ error: ... })`, clears loading, **rethrows**.

3. **`updateLog: (id: string, payload: Partial<ActivityLogPayload>) => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.activity.update(id, payload)`.
   - Success: clears loading, `get().fetchLogs()`.
   - Error: sets `error`, clears loading, **rethrows**.

4. **`deleteLog: (id: string) => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.activity.delete(id)`.
   - Success: clears loading, **true local optimistic removal** (`set({ logs: get().logs.filter(l => l.id !== id) })` then recomputes the weekly summary from the local list — the only store in the app that does a real local removal; every other store refetches).
   - Error: sets `error`, clears loading, **rethrows**.

5. **`fetchWeeklySummary: () => Promise<void>`**
   - IPC: `window.api.activity.exportWeekly()` → `summary`.
   - Success: `set({ weeklySummary: summary })`. Error: sets `error`; no rethrow.

6. **`getWeeklySummary: () => WeeklySummary | null`** — local getter that **recomputes the summary client-side** from the current `logs` array. This is the Monday–Sunday week math:
   - `getWeekRange()` helper (module-level, lines 23–37 of the file): for a given date, computes the Monday of the current week and the Sunday, i.e. `monday = date - ((day + 6) % 7)`, `sunday = monday + 6`; returns `{ start, end }` as `YYYY-MM-DD` strings.
   - Iterates the visible week's logs and counts `totalHours` (sum of `totalHours`), `workingDays` (days whose dominant status is `'working'`), `holidayDays`, `leaveDays` with a **`working > holiday > leave` precedence per calendar day** (a day logged as both holiday and working counts as working).
   - **Note:** the store's `WeeklySummary` import is used here; the services-layer `ActivityService` imports `WeeklySummary` but never uses it (dead import — the weekly math lives here, renderer-side).

7. **`setSelectedDate: (date: string) => void`** — pure setter.

8. **`clearError: () => void`** — `set({ error: null })`.

#### Persistence
None. Logs are always refetched on page mount.

---

### 4.37.3 `analyticsStore.ts` — `useAnalyticsStore`

**Imports:** `create`; `DashboardSummary`, `ProjectAnalytics` from `../types/Analytics`.

#### State interface (`AnalyticsState`)

| Field | Type | Default |
|---|---|---|
| `summary` | `DashboardSummary \| null` | `null` |
| `projectAnalytics` | `ProjectAnalytics[]` | `[]` |
| `isLoading` | `boolean` | `false` |
| `error` | `string \| null` | `null` |
| `exportLoading` | `boolean` | `false` |

#### Actions

1. **`fetchSummary: () => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.analytics.getSummary()` → `summary`.
   - Success: `set({ summary, isLoading: false })`. Error: sets `error`, clears loading, **no rethrow**.

2. **`fetchProjectAnalytics: () => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.analytics.export()` → `projectAnalytics`.
   - Success: `set({ projectAnalytics, isLoading: false })`. Error: sets `error`, clears loading, no rethrow.

3. **`exportAnalytics: () => Promise<string \| null>`**
   - Sets `exportLoading: true`.
   - IPC: `window.api.analytics.export()` → path string (the Excel file written to disk).
   - Success: `set({ exportLoading: false })`, returns path. Error: sets `error`, clears loading, **rethrows**.

4. **`clearError: () => void`** — `set({ error: null })`.

#### Persistence
None. The analytics page recomputes everything from services on mount.

---

### 4.37.4 `projectStore.ts` — `useProjectStore`

**Imports:** `create`; `Project`, `ProjectCreatePayload` from `../types/Project`.

This is the most heavily used store and the **shared data hub** for the whole renderer. It is consumed by `timelineStore.updateProjectPlanning` and `reportStore.generateReport`, both of which call `useProjectStore.getState().fetchProject(projectId)` after their own mutations to keep the project record in sync.

#### State interface (`ProjectState`)

| Field | Type | Default |
|---|---|---|
| `projects` | `Project[]` | `[]` |
| `selectedProject` | `Project \| null` | `null` |
| `isLoading` | `boolean` | `false` |
| `error` | `string \| null` | `null` |
| `archivedProjects` | `Project[]` | `[]` |

#### Actions

1. **`fetchProjects: () => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.project.list()` → `projects`.
   - Success: `set({ projects, isLoading: false })`. Error: `set({ error: (error as Error).message || 'Failed to fetch projects', isLoading: false })`, no rethrow.

2. **`fetchProject: (id: string) => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.project.get(id)` → `project`.
   - Success: `set({ selectedProject: project, isLoading: false })`. Error: sets `error`, clears loading, no rethrow.

3. **`createProject: (payload: ProjectCreatePayload) => Promise<Project>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.project.create(payload)` → `project`.
   - Success: clears loading, **refetches the full list** (`get().fetchProjects()`), returns `project`.
   - Error: sets `error`, clears loading, **rethrows**.

4. **`updateProject: (id: string, payload: Partial<ProjectCreatePayload>) => Promise<Project>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.project.update(id, payload)` → `project`.
   - Success: clears loading, refetches list, and if the updated project is the currently selected one, **updates `selectedProject` in place**; returns `project`.
   - Error: sets `error`, clears loading, **rethrows**.

5. **`deleteProject: (id: string) => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.project.delete(id)`.
   - Success: clears loading, refetches list, clears `selectedProject` if it was the deleted one.
   - Error: sets `error`, clears loading, **rethrows**.

6. **`archiveProject: (id: string, archived: boolean) => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.project.archive(id, archived)`.
   - Success: clears loading, refetches list, refreshes `archivedProjects`.
   - Error: sets `error`, clears loading, rethrows.

7. **`restoreProject: (id: string) => Promise<void>`** — mirror of `archiveProject` with `archived: false`; same error/refresh pattern.

8. **`hardDeleteProject: (id: string) => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.project.hardDelete(id)` (the transactional cascade path in `ProjectManager` — see §3.22).
   - Success: clears loading, refetches both `projects` and `archivedProjects`.
   - Error: sets `error`, clears loading, rethrows.

9. **`fetchArchivedProjects: () => Promise<void>`**
   - IPC: `window.api.project.list({ archived: true })` — note the query object rather than a bare list call.
   - Success: `set({ archivedProjects })`. Error: sets `error`, no rethrow.

10. **`addDocument: (projectId: string, filePath: string) => Promise<void>`** and **`removeDocument: (projectId: string, docId: string) => Promise<void>`**
    - IPC: `window.api.project.addDocument(projectId, filePath)` / `window.api.project.removeDocument(projectId, docId)`.
    - Both refetch the project afterwards via `get().fetchProject(projectId)`; mutation errors rethrow.

11. **`clearSelected: () => void`** and **`clearError: () => void`** — pure setters.

#### Persistence
None.

---

### 4.37.5 `timelineStore.ts` — `useTimelineStore`

**Imports:** `create`; `Milestone`, `TimelineAnalytics` from `../types/Milestone` — **note there is no `types/Timeline.ts`**; milestone types live in `Milestone.ts`; `useProjectStore` (cross-store).

#### State interface (`TimelineState`)

| Field | Type | Default |
|---|---|---|
| `milestones` | `Milestone[]` | `[]` |
| `analytics` | `TimelineAnalytics \| null` | `null` |
| `isLoading` | `boolean` | `false` |
| `error` | `string \| null` | `null` |
| `zoomLevel` | `'day' \| 'week' \| 'month' \| 'quarter' \| 'year'` | `'week'` |
| `filterPhase` | `string` | `'all'` |
| `filterStatus` | `string` | `'all'` |
| `filterMember` | `string` | `'all'` |

#### Actions

1. **`setZoomLevel` / `setFilterPhase` / `setFilterStatus` / `setFilterMember`** — all pure setters, no IPC. (Zoom/filter preferences are **not persisted** — they reset on reload.)

2. **`fetchTimeline: (projectId: string) => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - **Two sequential IPC calls:**
     - `window.api.timeline.listMilestones(projectId)` → `set({ milestones, isLoading: false })`; **on failure sets `error`, clears loading and `return`s early** — the analytics call is skipped entirely.
     - `window.api.timeline.getAnalytics(projectId)` → `set({ analytics })`; on failure only sets `error` (loading already false).

3. **`refreshMilestones: (projectId: string) => Promise<void>`**
   - The **post-mutation refresh helper**: same two IPC calls but without toggling `isLoading`; both errors only set `error`.

4. **`createMilestone: (payload) => Promise<void>`** — payload includes `projectId`, `name`, `description?`, `startDate`, `targetDate`, `completionDate?`, `status?`, `progress?`, `phase`, `responsibleMemberId?`, `dependencies?`, `notes?`, `workflowStatus?`, `priority?`.
   - Sets `isLoading: true, error: null`; IPC `window.api.timeline.createMilestone(payload)`.
   - Success: clears loading, **refreshes via `get().refreshMilestones(payload.projectId)`** (no local insert).
   - Error: sets `error`, clears loading, **rethrows**.

5. **`updateMilestone: (projectId, id, payload)`** / **`deleteMilestone: (projectId, id)`**
   - Same three-phase pattern: loading → IPC (`timeline.updateMilestone(id, payload)` / `timeline.deleteMilestone(id)`) → `refreshMilestones(projectId)`; errors set `error` and **rethrow**.
   - **Data-integrity note:** `deleteMilestone` leaves orphaned dependency references in other milestones' `dependencies` JSON arrays and orphaned notification rows — see §3.25.

6. **`updateProjectPlanning: (projectId, payload)`** — payload: `startDate?`, `expectedEndDate?`, `actualEndDate?`, `currentPhase?`, `healthIndicator?`, `estimatedHours?`, `priority?`.
   - Sets `isLoading: true, error: null`; IPC `window.api.timeline.updateProjectPlanning(projectId, payload)`.
   - **Cross-store:** calls `useProjectStore.getState().fetchProject(projectId)` to sync the project record with the updated planning fields.
   - Clears loading, then `get().refreshMilestones(projectId)`; error sets `error`, clears loading, rethrows.

7. **`clearError: () => void`** — `set({ error: null })`.

#### Persistence
None.

---

### 4.37.6 `healthStore.ts` — `useHealthStore`

**Imports:** `create`; `HealthResult`, `AnalysisResult` from `../types/Health`.

#### State interface (`HealthState`)

| Field | Type | Default |
|---|---|---|
| `healthResults` | `Record<string, HealthResult>` (keyed by `projectId`) | `{}` |
| `analysisResults` | `Record<string, AnalysisResult>` (keyed by `projectId`) | `{}` |
| `healthLogs` | `Record<string, HealthResult[]>` (keyed by `projectId`) | `{}` |
| `isChecking` | `Record<string, boolean>` (per-project in-flight flag) | `{}` |
| `isAnalyzing` | `Record<string, boolean>` (per-project in-flight flag) | `{}` |
| `error` | `string \| null` | `null` |

The **per-project record keying** is this store's defining design decision: concurrent checks for different projects never clobber each other, and the UI can show per-project spinners via `isChecking[projectId]`.

#### Actions

1. **`checkHealth: (url: string, projectId: string) => Promise<HealthResult>`**
   - Sets `isChecking[projectId] = true` (spread-merge into the record), clears `error`.
   - IPC: `window.api.health.check(url, projectId)` → `result`.
   - Success: stores `healthResults[projectId] = result` (spread-merge), `isChecking[projectId] = false`, returns `result`.
   - Error: `isChecking[projectId] = false`, `set({ error: (error as Error).message })`, **rethrows** (the caller — `HealthPanel` — surfaces the error banner).

2. **`analyzeWebpage: (url: string, projectId: string) => Promise<AnalysisResult>`**
   - Sets `isAnalyzing[projectId] = true`, clears error.
   - IPC: `window.api.health.analyze(url)` — **note: no `projectId` is passed to IPC**; it is only used as the state key.
   - Success: stores `analysisResults[projectId] = result`, clears flag, returns `result`.
   - Error: clears flag, sets `error`, **rethrows**.

3. **`fetchHealthLogs: (projectId: string) => Promise<void>`**
   - IPC: `window.api.health.getLogs(projectId)` → `logs`.
   - Success: stores `healthLogs[projectId] = logs` (spread-merge).
   - Error: `set({ error: (error as Error).message })`; no rethrow, no loading flag involved.

4. **`clearError: () => void`** — `set({ error: null })`.

#### Persistence
None.

---

### 4.37.7 `explorerStore.ts` — `useExplorerStore`

**Imports:** `create`; `useSettingsStore` (cross-store); `ProjectTreeNode`, `ProjectStorageStats`, `AdvancedFileDetails`, `AuditResults` from `../types/Explorer`.

This is the largest store (14 state fields). It backs the Project Explorer page and drives three distinct IPC areas: scanning, file details, and audits.

#### State interface (`ExplorerState`)

| Field | Type | Default |
|---|---|---|
| `tree` | `ProjectTreeNode \| null` | `null` |
| `stats` | `ProjectStorageStats \| null` | `null` |
| `files` | `unknown[]` | `[]` |
| `folders` | `unknown[]` | `[]` |
| `selectedFilePath` | `string \| null` | `null` |
| `selectedFileContent` | `string \| null` | `null` |
| `selectedFileDetails` | `AdvancedFileDetails \| null` | `null` |
| `selectedFileMermaid` | `string \| null` | `null` |
| `aiExplanation` | `string \| null` | `null` |
| `auditResults` | `AuditResults \| null` | `null` |
| `includeHidden` | `boolean` | `false` |
| `isLoading` | `boolean` | `false` |
| `isDetailsLoading` | `boolean` | `false` |
| `isAiLoading` | `boolean` | `false` |
| `error` | `string \| null` | `null` |

#### Actions

1. **`setIncludeHidden: (val: boolean) => void`** — pure setter.

2. **`fetchScan: (dirPath: string) => Promise<void>`**
   - Sets `isLoading: true, error: null`; reads `includeHidden` via `get()`.
   - IPC: `window.api.explorer.scanProject(dirPath, includeHidden)` → `result` object.
   - Success: `set({ tree: result.tree, stats: result.stats, files: result.files, folders: result.folders, isLoading: false })`.
   - Error: `set({ error: (err as Error).message || 'Scanning directory failed', isLoading: false })`; no rethrow.

3. **`fetchFileDetails: (filePath: string) => Promise<void>`**
   - Sets `isDetailsLoading: true` and **resets every selected-file field**: `selectedFilePath`, `selectedFileContent: null`, `selectedFileDetails: null`, `selectedFileMermaid: null`, `aiExplanation: null`.
   - IPC 1: `window.api.explorer.getFileDetails(filePath)` → `details`.
   - Local content logic: `content` starts as `'[Binary or Unreadable File Format]'`. A hardcoded `binaryExtensions` array (`['.png', '.jpg', '.jpeg', '.gif', '.webp', '.pdf', '.docx', '.zip', '.rar', '.7z', '.mp3', '.mp4', '.wav', '.avi']`) decides readability: if `details.extension` is NOT in the list, the store tries IPC 2 — `window.api.project.readDocument(filePath)` (**the project namespace, not explorer**); an inner catch sets `content = '[Failed to read text file contents]'`.
   - IPC 3: `window.api.explorer.getDependencies(filePath)` → `mermaid` string (Mermaid dependency-graph markup).
   - Success set: `selectedFileDetails: details`, `selectedFileContent: content`, `selectedFileMermaid: mermaid || null`, `isDetailsLoading: false`.
   - Error: `set({ error: (err as Error).message || 'Failed to load file details', isDetailsLoading: false })`; no rethrow.

4. **`explainFile: (filePath: string, provider: 'gemini' | 'openrouter', model?: string) => Promise<void>`**
   - Sets `isAiLoading: true, aiExplanation: null`.
   - **Cross-store read:** `const settings = useSettingsStore.getState()`; picks `apiKey = provider === 'gemini' ? settings.geminiApiKey : settings.openRouterApiKey`.
   - If no key configured: throws `new Error(\`${provider} API key is not configured in Settings.\`)` — caught below.
   - IPC: `window.api.explorer.explainFile(filePath, provider, apiKey, model)` → `explanation` string.
   - Success: `set({ aiExplanation: explanation, isAiLoading: false })`.
   - **Error handling quirk:** on failure the store does **not** set `error`; instead it stores the failure **into `aiExplanation`**: `` `Failed to generate explanation: ${(err as Error).message}` `` and clears `isAiLoading`. The error is swallowed into UI text so the renderer can display it in the same panel as successful explanations.

5. **`runAudits: (dirPath: string) => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.explorer.auditProject(dirPath)` → `results`.
   - Success: `set({ auditResults: results, isLoading: false })`.
   - Error: `set({ error: (err as Error).message || 'Failed to execute codebase audits', isLoading: false })`; no rethrow.

6. **`clearSelectedFile: () => void`** — resets all selected-file fields. Pure.

7. **`clearError: () => void`** — `set({ error: null })`.

#### Persistence
None.

---

### 4.37.8 `settingsStore.ts` — `useSettingsStore`

**Imports:** `create`; **`persist` from `zustand/middleware`** — the only store with the persist middleware; no type imports.

#### State interface (`SettingsState`)

| Field | Type | Default |
|---|---|---|
| `githubToken` | `string` | `''` |
| `githubTokenExpiry` | `string` | `''` |
| `geminiApiKey` | `string` | `''` |
| `openRouterApiKey` | `string` | `''` |

#### Actions

All four actions are **pure setters with no IPC, no async, and no error handling** (nothing can fail):

1. **`setGithubToken: (token: string, expiry: string) => void`** — `set({ githubToken: token, githubTokenExpiry: expiry })`.
2. **`setGeminiApiKey: (key: string) => void`** — `set({ geminiApiKey: key })`.
3. **`setOpenRouterApiKey: (key: string) => void`** — `set({ openRouterApiKey: key })`.
4. **`clearSettings: () => void`** — resets all four fields to `''`.

#### Persistence

- **YES — zustand `persist` middleware against `localStorage` key `'junglans-settings'`.**
- Default storage (`localStorage`); **no `partialize`, no `version`, no `onRehydrateStorage`** options are specified — the entire state object (all four strings) is serialized verbatim.
- **Security note:** GitHub token and Gemini/OpenRouter API keys sit in plain text in `localStorage` (see §5.49 for the full security discussion, including the fact that the token is also pushed to the main process via `window.api.github.setToken` on every change — see §4.42.2).

#### Cross-store usage
None *from* this store, but it is **consumed by two stores and one component**: `explorerStore.explainFile` (Gemini/OpenRouter keys), `reportStore.generateReport` (Gemini/OpenRouter keys), and `App.tsx` (GitHub token sync effect).

---

### 4.37.9 `notificationStore.ts` — `useNotificationStore`

**Imports:** `create`; `Notification`, `NotificationCategory`, `NotificationPriority` from `../types/Notification`. No persist middleware, but a **manually persisted** audio flag.

#### State interface (`NotificationState`)

| Field | Type | Default |
|---|---|---|
| `notifications` | `Notification[]` | `[]` |
| `unreadCount` | `number` | `0` |
| `isLoading` | `boolean` | `false` |
| `error` | `string \| null` | `null` |
| `audioEnabled` | `boolean` | `localStorage.getItem('pm_audio_notifications') !== 'false'` (defaults **true**) |
| `filterCategory` | `NotificationCategory \| 'all'` | `'all'` |
| `filterPriority` | `NotificationPriority \| 'all'` | `'all'` |
| `activeToasts` | `{ id: string; notification: Notification }[]` | `[]` |

#### Actions

1. **`fetchNotifications: () => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.notification.list()` → `notifications`.
   - Derives `unreadCount = notifications.filter((n) => !n.isRead).length`.
   - Success: `set({ notifications, unreadCount, isLoading: false })`. Error: sets `error`, clears loading, no rethrow.

2. **`markAsRead: (id: string) => Promise<void>`**
   - IPC: `window.api.notification.markRead(id, true)` → `updated` notification.
   - Success: **local, non-optimistic update using the server response** — maps the updated notification into `notifications`, recomputes `unreadCount`.
   - Error: `set({ error: (error as Error).message })`; no rethrow.

3. **`markAllAsRead: () => Promise<void>`**
   - IPC: `window.api.notification.markAllRead()`.
   - Success: maps all notifications to `{ ...n, isRead: true }`, sets `unreadCount: 0`.
   - Error: sets `error`; no rethrow.

4. **`deleteNotification: (id: string) => Promise<void>`**
   - IPC: `window.api.notification.delete(id)`.
   - Success: filters out by id, recomputes `unreadCount`.
   - Error: sets `error`; no rethrow.

5. **`clearAll: () => Promise<void>`**
   - IPC: `window.api.notification.clearAll()`.
   - Success: `set({ notifications: [], unreadCount: 0 })`.
   - Error: sets `error`; no rethrow.

6. **`setFilterCategory` / `setFilterPriority`** — pure setters for the notifications-page filters.

7. **`toggleAudio: () => void`**
   - Flips `audioEnabled` and **persists manually**: `localStorage.setItem('pm_audio_notifications', String(newState))`. (This is hand-rolled persistence, not zustand persist.)

8. **`addNotificationReceived: (notification: Notification) => void`** — the **incoming live-notification handler** wired to the IPC push channel (`ai.onChunk`-style event, see §4.42.2):
   - **Dedupe:** if `state.notifications.some((n) => n.id === notification.id)` → returns `{}` (no change).
   - Otherwise **prepends** `[notification, ...state.notifications]`, recomputes `unreadCount`.
   - If `audioEnabled`: calls `playNotificationSound(notification.priority)`.
   - Calls `triggerDesktopNotification(notification)` (browser Notification API).
   - Creates a local toast: `toastId = Math.random().toString(36).substring(2, 9)`, auto-dismisses after **5500 ms** via `setTimeout(() => get().dismissToast(toastId), 5500)`, appends `{ id: toastId, notification }` to `activeToasts`.

9. **`dismissToast: (id: string) => void`** — filters `activeToasts` by id. Pure.

#### Module-level helpers (outside the store)

**`playNotificationSound(priority: NotificationPriority)`** — synthesizes a Web Audio API sound with **no external asset**:
- `critical` → **High double-beep**: sine wave, 880 Hz (A5) at t=0 and t=0.18 s, gain 0.08 → exponential ramp to 0.001 over 0.15 s, each oscillator runs 0.18 s.
- `high` → **Warning ascending chime**: triangle wave, 587.33 Hz (D5) at t=0 then 783.99 Hz (G5) at t=0.1 s, gain 0.1 → ramp to 0.001 over 0.2 s, oscillators run 0.22 s.
- `medium`/`low` (else branch) → **Light bubble**: sine wave 523.25 Hz (C5) exponentially ramping **up** to 1046.50 Hz (C6) over 0.15 s, gain 0.08 → 0.001, runs 0.16 s.
- Uses `window.AudioContext || (window as any).webkitAudioContext`; the whole thing is wrapped in try/catch so browser autoplay-policy failures are silently ignored.

**`triggerDesktopNotification(notification: Notification)`** — checks `'Notification' in window` and `Notification.permission === 'granted'`, then `new Notification(notification.title, { body: notification.message, icon: './assets/icon.png', tag: notification.id })`.

#### Persistence
No zustand persist. One manual localStorage flag: `pm_audio_notifications` (string `'true'`/`'false'`; read as `!== 'false'` so **any value other than the literal `'false'` means enabled**).

---

### 4.37.10 `teamStore.ts` — `useTeamStore`

**Imports:** `create`; `TeamMember`, `TeamMemberPayload` from `../types/Team`.

#### State interface (`TeamState`)

| Field | Type | Default |
|---|---|---|
| `members` | `TeamMember[]` | `[]` |
| `isLoading` | `boolean` | `false` |
| `error` | `string \| null` | `null` |

#### Actions

1. **`fetchMembers: () => Promise<void>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.team.list()` → `list`.
   - Success: `set({ members: list, isLoading: false })`. Error: `set({ error: (error as Error).message || 'Failed to fetch team members', isLoading: false })`, no rethrow.

2. **`createMember: (payload: TeamMemberPayload) => Promise<TeamMember>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.team.create(payload)` → `newMember`.
   - Success: clears loading, **refetches the full list** via `get().fetchMembers()`, returns `newMember`.
   - Error: sets `error` (fallback `'Failed to create team member'`), clears loading, **rethrows**.

3. **`updateMember: (id: string, payload: Partial<TeamMemberPayload>) => Promise<TeamMember>`** — same pattern: IPC `team.update(id, payload)` → `updated`, refetch, return; rethrows on error.

4. **`deleteMember: (id: string) => Promise<boolean>`**
   - Sets `isLoading: true, error: null`.
   - IPC: `window.api.team.delete(id)` → boolean `success`.
   - Success: clears loading, refetches list, returns `success`.
   - Error: sets `error` (fallback `'Failed to delete team member'`), clears loading, **rethrows**.

5. **`clearError: () => void`** — `set({ error: null })`.

#### Persistence
None.

---

### 4.37.11 `reportStore.ts` — `useReportStore`

**Imports:** `create`; `useProjectStore` (cross-store); `useSettingsStore` (cross-store).

This store is the renderer half of the AI report pipeline (whose main-process half is documented in §5.43). It is the **only store with streaming state and the only one with a cancel mechanism**.

#### State interface (`ReportState`)

| Field | Type | Default |
|---|---|---|
| `streamingContent` | `string` | `''` |
| `isGenerating` | `boolean` | `false` |
| `selectedGeminiModel` | `string` | `'gemini-3.5-flash'` |
| `availableGeminiModels` | `string[]` | `['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-pro']` |
| `selectedOpenRouterModel` | `string` | `'openai/gpt-4o-mini'` |
| `availableOpenRouterModels` | `string[]` | `['openai/gpt-4o-mini', 'anthropic/claude-3-haiku', 'meta-llama/llama-3-8b-instruct']` |
| `aiEngine` | `'openrouter' \| 'gemini' \| 'ollama'` | `'gemini'` |
| `error` | `string \| null` | `null` |
| `isOllamaAvailable` | `boolean` | `false` |
| `availableOllamaModels` | `string[]` | `[]` |
| `selectedOllamaModel` | `string` | `''` |

#### Actions

1. **`generateReport: (projectId: string, folderPath: string) => Promise<string>`**
   - Sets `isGenerating: true, streamingContent: ''`, clears `error`.
   - **Cross-store read:** `const settings = useSettingsStore.getState()`.
   - **Registers a chunk listener:** `window.api.ai.onChunk((chunk: string) => set((state) => ({ streamingContent: state.streamingContent + chunk })))` — every streamed chunk appends to the growing markdown string.
   - Reads `selectedGeminiModel`, `selectedOpenRouterModel`, `aiEngine` via `get()`.
   - **Engine dispatch:**
     - `gemini`: requires `settings.geminiApiKey`, else `throw new Error('Gemini API key is not configured in Settings.')`; IPC `window.api.ai.generateGeminiReport(projectId, folderPath, selectedGeminiModel, settings.geminiApiKey)`.
     - `openrouter`: requires `settings.openRouterApiKey`, else throws `'OpenRouter API key is not configured in Settings.'`; IPC `window.api.ai.generateOpenRouterReport(projectId, folderPath, selectedOpenRouterModel, settings.openRouterApiKey)`.
     - `ollama`: re-reads `selectedOllamaModel` via `get()`; IPC `window.api.ai.generateOllamaReport(projectId, folderPath, selectedOllamaModel)`.
   - **Cross-store call:** after the report completes, `await useProjectStore.getState().fetchProject(projectId)` inside its own try/catch (console.error on failure — `"Failed to auto-refresh project after report generation"`) — non-fatal, because the generated file is attached as a project document in the main process.
   - Success: `set({ isGenerating: false, streamingContent: report })` — **the streamed content is replaced wholesale by the final report** (guards against any chunk-race), returns `report`.
   - Error: `set({ isGenerating: false, error: (error as Error).message })`, **rethrows**.
   - **`finally`: `window.api.ai.removeChunkListener()`** — the listener is always cleaned up, even on error.

2. **`cancelGeneration: () => void`**
   - Calls `window.api.ai.cancelStream()` then `window.api.ai.removeChunkListener()`; `set({ isGenerating: false })`.
   - **Gap:** the main-process side of `cancelStream` only flips a local flag (see §5.43.7) — the underlying HTTP stream is never aborted for Ollama, and Gemini/OpenRouter have no abort path at all.

3. **`setSelectedGeminiModel` / `setSelectedOpenRouterModel` / `setAiEngine` / `setSelectedOllamaModel`** — pure setters.
4. **`clearStream: () => void`** — `set({ streamingContent: '' })`.
5. **`clearError: () => void`** — `set({ error: null })`.

6. **`checkOllama: () => Promise<void>`**
   - IPC 1: `window.api.ai.checkOllama()` → boolean `isAvailable`; `set({ isOllamaAvailable: isAvailable })`.
   - If available: IPC 2 `window.api.ai.listOllamaModels()` → models; `set({ availableOllamaModels: models, selectedOllamaModel: models[0] || '' })` — **auto-selects the first model**.
   - Error: `set({ isOllamaAvailable: false, availableOllamaModels: [] })` — no error state set, no rethrow (probes are expected to fail when Ollama isn't running).

#### Persistence
None. Selected models/engines reset on reload; only `settingsStore` persists.

---

### 4.37.12 Cross-cutting store patterns

1. **The error idiom.** Every async action sets `error: (error as Error).message` with a domain-specific fallback string. Mutations (`createLog`, `updateLog`, `deleteLog`, `createMilestone`, `updateMilestone`, `deleteMilestone`, `updateProjectPlanning`, `createMember`, `updateMember`, `deleteMember`, `createProject`, `generateReport`) **rethrow** after setting the error so caller components can show their own feedback; pure fetch/export actions swallow the error into `state.error` and never rethrow. Only `activityStore.deleteLog` performs a true local optimistic removal; every other write refreshes from the backend.

2. **No optimistic concurrency control.** All stores overwrite lists wholesale after refetches. There are no `version`/`timestamp` fields on state, no AbortControllers except the AI streaming cancel in `reportStore`, and no stale-state guards — a slow refetch can clobber a newer list (a theoretical risk given the app's single-window usage).

3. **Cross-store coupling map (uni-directional).** `timelineStore → projectStore.fetchProject`, `reportStore → projectStore.fetchProject + settingsStore.getState`, `explorerStore → settingsStore.getState`. No store calls another store's mutating actions — all cross-store calls are refreshes or read-only `getState()` access.

4. **Store comparison quick-reference table.**

| Store | Persist | localStorage key(s) | Cross-store calls | IPC namespaces used |
|---|---|---|---|---|
| activityStore | No | — | — | `activity.list/create/update/delete/exportWeekly` |
| analyticsStore | No | — | — | `analytics.getSummary/export` |
| projectStore | No | — | consumed by timeline & report stores | `project.list/get/create/update/delete/archive/restore/hardDelete/addDocument/removeDocument` |
| timelineStore | No | — | → `projectStore.fetchProject` | `timeline.listMilestones/getAnalytics/createMilestone/updateMilestone/deleteMilestone/updateProjectPlanning` |
| healthStore | No | — | — | `health.check/analyze/getLogs` |
| explorerStore | No | — | → `settingsStore` (read), `project.readDocument` (IPC) | `explorer.scanProject/getFileDetails/getDependencies/explainFile/auditProject` |
| settingsStore | **Yes** | `junglans-settings` | consumed by explorer & report stores | none |
| notificationStore | No | `pm_audio_notifications` (manual) | — | `notification.list/markRead/markAllRead/delete/clearAll` |
| teamStore | No | — | — | `team.list/create/update/delete` |
| reportStore | No | — | → `settingsStore` (read), `projectStore.fetchProject` | `ai.onChunk/generateGeminiReport/generateOpenRouterReport/generateOllamaReport/cancelStream/removeChunkListener/checkOllama/listOllamaModels` |

---

## 4.38 Type Modules (`src/types/`)

Ten type modules define the shared data contracts between the renderer and the preload bridge. There are **no enums and no runtime helper functions** in most of them — the exceptions are `Health.ts` (four exported helpers) and the const arrays in `Project.ts` and `Report.ts`.

**Two modules mentioned in past documentation do not exist:** there is no `types/Timeline.ts` (timeline types live in `types/Milestone.ts`) and no `types/Settings.ts`. Likewise, the `PHASES`, `WORKFLOW_STATUSES`, `HEALTH_INDICATORS`, and `NOTIFICATION_LEVELS` constant arrays do not exist — phases and workflow statuses are free-form `string` fields, and health/notification values are inline unions.

### 4.38.1 `types/Project.ts`

**Type aliases:**
- `ProjectType` = `'webapp' | 'desktop' | 'mobile' | 'api' | 'library'`
- `ProjectStatus` = `'active' | 'completed' | 'on-hold'`
- `PrimaryCategory` = `typeof PRIMARY_CATEGORIES[number]`

**Const arrays:**
- `PRIMARY_CATEGORIES` (`as const`): `['Web Application', 'Desktop Application', 'Mobile Application', 'AI & Data Project', 'Backend & Cloud Service', 'Embedded & Specialized Systems']`
- `PREDEFINED_TAGS` (`as const` — object mapping tag category → tag arrays):
  - `'Technology'`: `['Python', 'Java', 'JavaScript', 'TypeScript', 'Dart', 'C++', 'C#', 'Go', 'Rust']`
  - `'Framework'`: `['React', 'Angular', 'Vue', 'Next.js', 'Flutter', 'FastAPI', 'Django', 'Flask', 'Spring Boot', '.NET']`
  - `'Database'`: `['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Firebase', 'Redis']`
  - `'AI / ML'`: `['Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP', 'Generative AI', 'RAG', 'AI Agent']`
  - `'Infrastructure'`: `['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD']`
  - `'Project Context'`: `['Final Year Project', 'Research', 'Open Source', 'Internal Tool', 'Prototype', 'Production', 'SaaS', 'Full Stack']`
- `PROJECT_TYPES` — array of `{ value: ProjectType; label: string; icon: string }`: webapp 🌐 "Web App", desktop 🖥️ "Desktop", mobile 📱 "Mobile", api ⚡ "API", library 📦 "Library".
- `PROJECT_STATUSES` — array of `{ value: ProjectStatus; label: string; color: string }` carrying **Tailwind badge classes**: active → `bg-blue-500/10 text-blue-400 border-blue-500/20`, completed → `bg-emerald-500/10 text-emerald-400 border-emerald-500/20`, on-hold → `bg-amber-500/10 text-amber-400 border-amber-500/20`.

**`Project` interface** (full field listing):

| Field | Type |
|---|---|
| `id` | `string` |
| `name` | `string` |
| `folderPath` | `string` |
| `type` | `ProjectType` |
| `primaryCategory` | `string` |
| `tags` | `string[]` |
| `githubUrl` | `string \| null` |
| `isOnGitHub` | `boolean` |
| `githubData` | `unknown \| null` |
| `isHosted` | `boolean` |
| `hostedUrl` | `string \| null` |
| `status` | `ProjectStatus` |
| `techStack` | `string[]` |
| `lastHealth` | `unknown \| null` |
| `startDate` | `string \| null` |
| `expectedEndDate` | `string \| null` |
| `actualEndDate` | `string \| null` |
| `currentPhase` | `string \| null` |
| `healthIndicator` | `'on-track' \| 'at-risk' \| 'critical' \| null` |
| `documents` | `ProjectDocument[]` |
| `estimatedHours` | `number \| null` |
| `priority` | `'low' \| 'medium' \| 'high' \| 'critical' \| null` |
| `progressPercentage` | `number \| null` |
| `completionForecast` | `string \| null` |
| `customPhases` | `string[] \| null` |
| `archived` | `boolean` |
| `createdAt` | `string` |
| `updatedAt` | `string` |

**`ProjectDocument`:** `id`, `projectId`, `filePath`, `fileName`, `docType: string | null`, `isAiGenerated: boolean`, `createdAt`.

**`ProjectCreatePayload`** (the form payload — most fields optional): required `name`, `folderPath`, `type`, `primaryCategory`; optional `tags`, `githubUrl`, `isHosted`, `hostedUrl`, `status`, `documents: string[]`, `estimatedHours`, `priority`.

### 4.38.2 `types/Activity.ts`

**Type alias:** `ActivityStatus` = `'working' | 'holiday' | 'leave'`.

**`ActivityLog`:**

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | |
| `date` | `string` | `YYYY-MM-DD` |
| `inTime` | `string \| null` | |
| `outTime` | `string \| null` | |
| `description` | `string` | |
| `status` | `ActivityStatus` | |
| `projectId` | `string \| null` | |
| `projectName` | `string \| null` | optional — comment: "Joined project name" |
| `memberId` | `string \| null` | |
| `memberName` | `string \| null` | optional — comment: "Joined member name" |
| `totalHours` | `number` | optional — comment: "Calculated on-the-fly" |
| `createdAt` | `string` | |
| `updatedAt` | `string` | |

**`ActivityLogPayload`:** required `date`, `inTime`, `outTime`, `description`, `status`, `projectId`; optional `memberId`.

**`WeeklySummary`:** `totalHours`, `workingDays`, `holidayDays`, `leaveDays` — all numbers.

No enums, no const arrays, no helpers.

### 4.38.3 `types/Analytics.ts`

**Imported dependencies:** `TeamMember` from `./Team` (**imported but never used — dead import**), `ActivityLog` from `./Activity`, `ProjectStorageStats` from `./Explorer`.

Interfaces:
- **`ProjectMetrics`:** `total`, `active`, `completed`, `onHold`, `hosted`, `githubConnected`, `withoutDoc`, `attentionRequired` — all `number`.
- **`TeamMetrics`:** `totalMembers`, `activeContributors`, `weeklyHours`, `monthlyHours`, `productivityScore`, `attendanceCount`, `leaveCount`.
- **`CommitActivity`:** `hash`, `author`, `date`, `message`, `projectName` — all `string`.
- **`DevMetrics`:** `totalCommits`, `recentCommits: CommitActivity[]`, `documentationCoverage` (comment: `// percentage`), `aiReportCoverage` (comment: `// percentage`).
- **`DashboardSummary`:** `projectMetrics: ProjectMetrics`, `teamMetrics: TeamMetrics`, `devMetrics: DevMetrics`, `categoryDistribution: Record<string, number>`, `tagDistribution: Record<string, number>`.
- **`ProjectGitStats`:** `isRepo`, `commitCount`, `contributorsCount`, `recentCommits: CommitActivity[]`, `lastCommitDate: string | null`.
- **`ProjectActivityStats`:** `totalHours`, `logEntries`, `lastActivityDate: string | null`, `recentLogs: ActivityLog[]`.
- **`ProjectAnalytics`:** `projectId`, `projectName`, `git: ProjectGitStats`, `activity: ProjectActivityStats`, `storage: ProjectStorageStats | null`.

No enums/const arrays/helpers.

### 4.38.4 `types/Health.ts`

**Type alias:** `HealthStatus` = `'healthy' | 'degraded' | 'down' | 'unknown'`.

**`HealthResult`:** `url`, `statusCode`, `responseTime`, `isUp`, `sslValid`, `sslExpiry: string | null`, `redirectCount`, `finalUrl`, `checkedAt` — the exact shape produced by `HealthService.check()` in §3.28.

**`AnalysisResult`** (nested): `url`; `performance: { fcp: number | null; lcp: number | null; tti: number | null; totalJsSize: number; totalCssSize: number; loadTime: number }`; `seo: { title: string; description: string; canonical: string | null; hasRobotsTxt: boolean; hasSitemap: boolean; h1Count: number }`; `techStack: string[]`; `links: { internal: number; external: number; broken: string[] }`; `imageCount: number`; `imagesWithoutAlt: number`.

**Helper functions (all exported — the only type module with logic):**
1. `getHealthStatus(result: HealthResult | null): HealthStatus` — `null` → `'unknown'`; `!isUp` → `'down'`; `responseTime > 2000` → `'degraded'`; else `'healthy'`.
2. `getHealthColor(status): string` — Tailwind text colors: healthy → `'text-emerald-400'`, degraded → `'text-amber-400'`, down → `'text-red-400'`, default → `'text-zinc-500'`.
3. `getHealthBgColor(status): string` — badge classes: healthy → `'bg-emerald-500/10 border-emerald-500/20'`, degraded → `'bg-amber-500/10 border-amber-500/20'`, down → `'bg-red-500/10 border-red-500/20'`, default → `'bg-zinc-500/10 border-zinc-500/20'`.
4. `getHealthIcon(status): string` — emoji: 🟢 / 🟡 / 🔴 / ⬜.

### 4.38.5 `types/Milestone.ts`

> This module **is** the Timeline types module (see the §4.38 note about `Timeline.ts` not existing). `timelineStore` imports `Milestone` and `TimelineAnalytics` from here.

**`Milestone`:**

| Field | Type |
|---|---|
| `id` | `string` |
| `projectId` | `string` |
| `name` | `string` |
| `description` | `string \| null` |
| `startDate` | `string` |
| `targetDate` | `string` |
| `completionDate` | `string \| null` |
| `status` | `'pending' \| 'completed' \| 'delayed'` |
| `progress` | `number` |
| `phase` | `string` |
| `responsibleMemberId` | `string \| null` |
| `responsibleMemberName` | `string \| null` |
| `responsibleMemberRole` | `string \| null` |
| `dependencies` | `string[]` |
| `notes` | `string \| null` |
| `workflowStatus` | `string` |
| `priority` | `'low' \| 'medium' \| 'high' \| 'critical' \| null` |
| `createdAt` | `string` |
| `updatedAt` | `string` |

**`TimelineAnalytics`:** `overallCompletion`, `phaseCompletion`, `delayedCount`, `upcomingCount`, `delayedMilestones: Milestone[]`, `upcomingMilestones: Milestone[]`, `calculatedHealth: 'on-track' | 'at-risk' | 'critical'`, `durationDays`.

No enums/const arrays/helpers. Phases and workflow statuses are **free-form strings** — there is no canonical phase list in this module (the closest thing is the UI-only `LIFECYCLE_PHASES` array in `ProjectPhasePipeline.tsx`, §4.40.17).

### 4.38.6 `types/Notification.ts`

**Type aliases:** `NotificationCategory` = `'project' | 'system' | 'github' | 'user'`; `NotificationPriority` = `'low' | 'medium' | 'high' | 'critical'`.

**`Notification`:** `id`, `category`, `type: string`, `title`, `message`, `priority`, `isRead`, `projectId: string | null`, `projectName: string | null` (optional), `createdAt`, `metadata: unknown | null`.

**`NotificationSimulatePayload`:** required `category`, `type`, `title`, `message`, `priority`; optional `projectId`, `metadata: Record<string, unknown> | null`.

### 4.38.7 `types/Explorer.ts`

**`ProjectTreeNode`:** `name`, `path`, `relativePath`, `type: 'file' | 'directory'`, `size`, `children?: ProjectTreeNode[]` (recursive).

**`FileStatsInfo`:** `name`, `path`, `relativePath`, `extension`, `size`, `createdDate`, `modifiedDate`, `lineCount?`.

**`FolderStatsInfo`:** `name`, `path`, `relativePath`, `size`, `fileCount`, `subfolderCount`, `largestFileName: string | null`, `largestFileSize`, `lastModifiedDate`.

**`ProjectStorageStats`:** `totalSize`, `totalFiles`, `totalFolders`, `largestFiles: FileStatsInfo[]`, `largestFolders: FolderStatsInfo[]`, `heatmapData: { name: string; size: number }[]` (comment: "grouped by categories"), `languageBreakdown: { language: string; count: number; size: number; loc: number }[]`.

**`AdvancedFileDetails`:** `name`, `path`, `relativePath`, `extension`, `size`, `createdDate`, `modifiedDate`, `accessedDate`, `owner`, `permissions`, `sha256`, `lineCount`, `functionCount`, `classCount`, `importCount`, `language`, `gitLastModifiedBy: string | null`, `gitLastCommitDate: string | null`.

**`AuditResults`:** `duplicates: { hash: string; size: number; files: string[] }[]`, `deadFiles: string[]`.

### 4.38.8 `types/Team.ts`

**`TeamMember`:** `id`, `name`, `role`, `email: string | null`, `avatar: string | null` (comment: "avatar color or initial"), `isActive`, `createdAt`, `updatedAt`.

**`TeamMemberPayload`:** required `name`, `role`; optional `email`, `avatar`, `isActive`.

### 4.38.9 `types/Report.ts`

**Type alias:** `ExportType` = `'summary' | 'techstack' | 'architecture' | 'health' | 'full' | 'ai-generated'`.

**`Report`:** `id`, `projectId`, `content`, `type: ExportType`, `createdAt`.

**`EXPORT_TYPES`** const array — `{ value: ExportType; label: string; description: string }`:
1. `summary` — "Project Summary" — "Metadata, GitHub info, hosting status"
2. `techstack` — "Tech Stack Report" — "Detected technologies with versions"
3. `architecture` — "Architecture Doc" — "Full architecture with diagrams"
4. `health` — "Health Report" — "Web health metrics snapshot"
5. `full` — "Full Bundle" — "All of the above combined"
6. `ai-generated` — "AI Report (Qwen)" — "Generated using Qwen 2.5:3b"

> The label "AI Report (Qwen)" is a legacy artifact — the AI engine is no longer Qwen-only (see §5.43: three engines — Ollama, Gemini, OpenRouter).

### 4.38.10 `types/GitHub.ts`

All interfaces mirror the GitHub REST API shapes exactly (they are typed by hand rather than generated):

- **`GitHubMetadata`:** `name`, `fullName`, `description: string | null`, `language: string | null`, `stars`, `forks`, `openIssues`, `visibility`, `defaultBranch`, `homepage: string | null`, `hasPages`, `pushedAt`, `createdAt`, `updatedAt`, `topics: string[]`, `license: string | null`.
- **`GitHubPagesInfo`:** `hasPages`, `pagesUrl?`, `customDomain: string | null` (optional).
- **`GitHubUser`:** `login`, `id`, `avatarUrl`, `name: string | null`, `email: string | null`, `bio: string | null`, `publicRepos`, `followers`, `following`, `htmlUrl`.
- **`GitHubTokenScope`:** `token`, `scopes: string[]`, `user: GitHubUser | null`, `isValid`, `rateLimit: { limit: number; remaining: number; reset: number }` — the token-validation response shape.
- **`GitHubRepo`:** `id`, `name`, `fullName`, `private`, `description: string | null`, `language: string | null`, `forksCount`, `stargazersCount`, `openIssuesCount`, `defaultBranch`, `owner: { login: string; avatarUrl: string }`, `htmlUrl`, `topics`, `pushedAt`, `updatedAt`, `archived`, `visibility`.
- **`GitHubBranch`:** `name`, `commit: { sha: string; url: string }`, `protected`.
- **`GitHubCommit`:** `sha`, `author: { name; email; date } | null`, `committer: { name; email; date } | null`, `message`, `htmlUrl`, `authorAvatar: string | null`.
- **`GitHubFileEntry`:** `name`, `path`, `type: 'file' | 'dir' | 'symlink'`, `size`, `sha`, `htmlUrl`, `downloadUrl: string | null`.

### 4.38.11 Type-module cross-cutting notes

1. **Repeated domain vocabulary.** `'low' | 'medium' | 'high' | 'critical' | null` (priority) appears in `Project`, `ProjectCreatePayload`, `Milestone`, and both timeline payloads; `'on-track' | 'at-risk' | 'critical'` (health) appears in `Project` and `TimelineAnalytics`; `'working' | 'holiday' | 'leave'` (ActivityStatus) drives the weekly summary math with its `working > holiday > leave` precedence. These unions are duplicated rather than shared via a common module.
2. **Dead import.** `types/Analytics.ts` imports `TeamMember` but never uses it.
3. **Loosely typed blob fields.** `Project.githubData` and `Project.lastHealth` are `unknown | null`, which is why the UI is full of `as any` casts when reading them (see §4.40.21).

---

## 4.39 Pages (`src/pages/`)

The `pages/` directory contains **12 pages (~8,000 lines total)**. The pages are deliberately **thin composition layers**: each page mounts a layout, pulls data through the stores (usually with a `useEffect` + `fetchX()` on mount), and assembles the presentational components from `components/`. All navigation is **hash-based routing** (`HashRouter` from `react-router-dom`), because a `file://`-loaded Electron renderer must not trigger real URL navigation.

### 4.39.1 Route table

| Route | Page component | Sidebar link? |
|---|---|---|
| `/` | `Dashboard` | Yes |
| `/add` | `AddProject` | Yes |
| `/project/:id` | `ProjectDetail` | No (card click) |
| `/activity` | `ActivityLog` | Yes |
| `/analytics` | `AnalyticsDashboard` | Yes |
| `/timeline` | `Timeline` | Yes |
| `/explorer` | `Explorer` | Yes |
| `/docs` | `Documentation` | Yes |
| `/github` | `GitHubIntegration` | Yes |
| `/kanban` | `KanbanBoard` | Yes |
| `/notifications` | `Notifications` | **No** (toast click / direct nav) |
| `/settings` | `Settings` | Yes |

> `/notifications` is routed but **not reachable from the sidebar** — the only in-app paths into it are clicking a toast (which actually goes to `/timeline`, see §4.42.2) or direct navigation. This is a small UX gap.

### 4.39.2 Per-page responsibilities

- **Dashboard (`/`)** — mounts `useProjectStore.fetchProjects()`, renders the project grid of `ProjectCard`s, plus the analytics widgets (activity heatmap, category distribution, work-time trend) fed from `useAnalyticsStore.fetchSummary()`; hosts the `GlobalSearch` hint and archived-project access.
- **AddProject (`/add`)** — the project registration form. Collects `ProjectCreatePayload` (name, folder via the folder-picker IPC, type via `PROJECT_TYPES`, category via `PRIMARY_CATEGORIES`, tags via `PREDEFINED_TAGS`), validates, and calls `createProject`. On success it navigates to the new project's detail page.
- **ProjectDetail (`/project/:id`)** — the busiest page. On mount calls `fetchProject(id)`. Hosts the tabbed workspace: `HealthPanel`, `AIPanel`, `ExportButtons`, `GitHubPanel`, `DocumentList`, `DependencyGraph`, `MilestoneBudgetTracker`, and planning fields driven by `timelineStore`. Deleting/archiving here routes back to `/`.
- **ActivityLog (`/activity`)** — uses `useActivityStore` (`fetchLogs`, `fetchWeeklySummary`); week navigator built on `getWeekRange()`, per-day log rows with working/holiday/leave status, total-hours display, and an Excel export trigger via `activity.exportWeekly`.
- **KanbanBoard (`/kanban`)** — board view of milestones grouped by `workflowStatus` (free-form strings), backed by `timelineStore` milestones across projects; drag-and-drop between columns updates milestone status via `updateMilestone`.
- **Analytics (`/analytics`)** — the flagship dashboard. Assembles `InteractiveActivityHeatmap`, `InteractiveCategoryDistribution`, `InteractiveWorkTimeTrend`, `CodebaseCompositionTreemap`, `TeamWorkloadMatrix`, `ProjectPhasePipeline`, `MilestoneBudgetTracker`. Data comes from `useAnalyticsStore` (`fetchSummary`, `fetchProjectAnalytics`) and `useActivityStore`.
- **Timeline (`/timeline`)** — full planning workspace: `InteractiveGanttChart`, milestone CRUD forms (`createMilestone`, `updateMilestone`, `deleteMilestone`), `updateProjectPlanning` for the project-level plan fields, and the critical-path view computed by `CriticalPathCalculator` (see §3.35). Hosts the `AIWBSGeneratorModal` for bulk-importing a generated WBS.
- **Explorer (`/explorer`)** — the file-tree browser driven by `explorerStore`: scan (`fetchScan`), file details + content + Mermaid graph (`fetchFileDetails`), AI file explanation (`explainFile`), codebase audits (`runAudits`); assembles `DependencyGraph` and the tree/list panels.
- **Documentation (`/docs`)** — renders project documents: list via `DocumentList`, inline markdown rendering (react-markdown + remark-gfm, the same pipeline as `AIPanel`), plus the markdown export actions (`ExportButtons`).
- **GitHub (`/github`)** — `GitHubIntegration` page: token validation (`github.validateToken` → `GitHubTokenScope`), repo metadata fetching, branch/commit/file browsing via the GitHub API channels, and Pages detection.
- **Settings (`/settings`)** — the only persist-backed form: `useSettingsStore` setters for GitHub token, Gemini key, OpenRouter key; the token sync effect in `App.tsx` pushes the token to the main process live.
- **Notifications (`/notifications`)** — the notification center: list from `useNotificationStore`, filters by category/priority, mark-read/delete/clear-all actions, and the audio toggle wired to `toggleAudio`.

Pages follow a consistent mount pattern:

```tsx
useEffect(() => { fetchProjects(); }, [fetchProjects]);   // one-shot load
// render: loading skeleton → error banner → content grid
```

The `key={location.pathname}` remount trick in `App.tsx` (§4.42.2) means every navigation replays these effects — which is why the stores (not the pages) own the fetched data.

---

## 4.40 Components (`src/components/`)

There are **21 files** in `components/` — 20 components plus this section's index. The table below is the complete inventory; deep dives follow for each.

### 4.40.1 Component index table

| File | Type | Props | window.api calls | Recharts | Notes |
|---|---|---|---|---|---|
| AIPanel.tsx | Report gen UI | `projectId`, `folderPath` | `export.save` | none | Zustand reportStore; markdown streaming; 3 AI engines |
| AIWBSGeneratorModal.tsx | Modal | `isOpen`, `onClose`, `project`, `onGenerateMilestones` | none | none | Client-side "AI" simulation with `setTimeout` |
| CodebaseCompositionTreemap.tsx | Treemap | `storageStats?`, `title?` | none | none | Pure CSS treemap; hover syncing |
| DependencyGraph.tsx | Explorer | `selectedProject`, `fileTree`, `onSelectFile` | `explorer.scanProject`, `explorer.getFileDetails`, `explorer.getDependencies` | none | Mermaid graph text |
| DocumentList.tsx | List | `documents`, `projectId`, `onAddDocument`, `onRemoveDocument?`, `onReadDocument?` | none | none | Emoji doc icons |
| ErrorBoundary.tsx | Class boundary | `children` | none | none | `getDerivedStateFromError` |
| ExportButtons.tsx | Export list | `projectId`, `projectName` | `export.summary/techstack/architecture/health/full/ai-generated/save` | none | Success flash 3 s |
| GitHubPanel.tsx | Info panel | `githubData`, `githubUrl` | none | none | StatCard/DetailRow helpers |
| GlobalSearch.tsx | Cmd-K modal | none | `search.global` | none | Debounce 200 ms, keyboard nav, history |
| HealthPanel.tsx | Health | `projectId`, `hostedUrl`, `lastHealth` | via healthStore | AreaChart | SSL/status cards |
| InteractiveActivityHeatmap.tsx | Heatmap | `logs?`, `projects?`, `commits?`, `onSelectDate?`, `onSelectTech?`, `title?`, `subtitle?` | none | none | Synthetic fallback data |
| InteractiveCategoryDistribution.tsx | Donut | `data`, `onSelectCategory?`, `selectedCategory?`, `title?` | none | PieChart, Sector | Active shape, legend click |
| InteractiveGanttChart.tsx | Gantt | `milestones`, `project?`, `onSelectMilestone?`, `onUpdateMilestoneStatus?` | none | none | Pure CSS bars + zoom |
| InteractiveWorkTimeTrend.tsx | Trend chart | `logs?`, `startDate?`, `endDate?`, `title?` | none | Area/Bar/Line | Metric & chart switchers |
| MilestoneBudgetTracker.tsx | Budget cards | `milestones`, `hourlyRate?` | none | none | Cost estimates, burn rate |
| ProjectCard.tsx | Card | `project`, `index` | none | none | Staggered animation |
| ProjectPhasePipeline.tsx | Stepper | `currentPhase?`, `milestones?`, `onSelectPhase?`, `selectedPhase?` | none | none | 10-phase lifecycle |
| Sidebar.tsx | Nav | none | none | none | Theme toggle, drag region |
| TeamWorkloadMatrix.tsx | Matrix | `members`, `milestones` | none | none | Overload detection |
| TechStackBadges.tsx | Badges | `techStack` | none | none | Color map |

### 4.40.2 AIPanel.tsx (235 lines)

**Purpose:** the AI report generation panel inside the project detail page.

**Props:** `projectId: string`, `folderPath: string` (both required, no defaults).

**State:** none local — everything comes from `useReportStore()`: `streamingContent`, `isGenerating`, `aiEngine`, `error`, `selectedGeminiModel`, `availableGeminiModels`, `selectedOpenRouterModel`, `availableOpenRouterModels`, `isOllamaAvailable`, `availableOllamaModels`, `selectedOllamaModel`, plus actions `generateReport`, `cancelGeneration`, `setAiEngine`, `setSelectedGeminiModel`, `setSelectedOpenRouterModel`, `setSelectedOllamaModel`, `clearStream`, `checkOllama`.

**Effect:** on mount → `checkOllama()` (probes local Ollama availability).

**Handlers:**
- `handleGenerate` — `clearStream()` then `await generateReport(projectId, folderPath)` (errors surface from the store's `error`).
- `handleSaveToCustomLocation` — if `streamingContent` is non-empty, `await window.api.export.save(streamingContent, 'auto-report.md')` (native save dialog).

**Rendering:**
- **Engine toggle** — 3 equal-width buttons in a `bg-white/[0.02]` pill: Gemini (`<Cloud>`), OpenRouter (`<Network>`), Local/Ollama (`<Cpu>`). Active: `bg-indigo-500/15 text-indigo-400 border border-indigo-500/20`. The Ollama button is disabled + `opacity-50 cursor-not-allowed` when `!isOllamaAvailable`, with tooltip "Ollama is not running locally".
- **Model selector** — conditional `<select>` per engine with a custom `ChevronDown` overlay (absolute, `pointer-events-none`). Gemini appends "(Recommended)" to `gemini-3.5-flash`; Ollama shows "No models found" placeholder when its list is empty.
- **Generate/Stop button** — `btn-danger` + `<Square>` "Stop" while generating, else `btn-primary` + `<Sparkles>` "Generate Report"; disabled while `isGenerating`.
- **Error banner** — `bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400`.
- **Streaming indicator** — three `.pulse-dot` divs with staggered `animationDelay` (0/200/400 ms) + "Generating report...".
- **Report content** — when `streamingContent` is truthy: "Generated Report" header + `btn-secondary` "Save to Disk" (only when not generating); body is a `glass-panel p-5 max-h-[500px] overflow-y-auto` containing `<ReactMarkdown remarkPlugins={[remarkGfm]}>` wrapped in a heavily customized typography container:

```
prose prose-invert prose-sm max-w-none
  prose-headings:text-zinc-200
  prose-p:text-zinc-400
  prose-a:text-indigo-400
  prose-strong:text-zinc-300
  prose-code:text-indigo-400 prose-code:bg-indigo-500/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
  prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/[0.06]
  prose-li:text-zinc-400
  prose-th:text-zinc-300 prose-td:text-zinc-400
```

**Noteworthy:** react-markdown re-renders on every streamed chunk (live typing effect); the `Play` lucide import is unused (lint artifact).

### 4.40.3 AIWBSGeneratorModal.tsx (239 lines)

**Purpose:** a modal that "AI-generates" a Work Breakdown Structure (milestone decomposition) for a project.

**Props:** `isOpen`, `onClose`, `project?: Project | null`, `onGenerateMilestones: (milestones: Array<{ name; description; phase; durationDays; dependencies }>) => void`.

**State:** `prompt` (seeded from `project` with template `` `Generate Work Breakdown Structure (WBS) milestones for project "${name}" with stack: ${techStack?.join(', ') || 'TypeScript'}.` `` — computed once on first render; **it does not re-initialize if `project` changes**); `isGenerating` (simulated with `setTimeout(..., 1200)`); `previewItems`.

**Crucially: there is no real AI call.** After the fake 1.2 s delay, a **hardcoded 6-item waterfall decomposition** is produced:

1. Requirement Analysis & Specifications (4 d, no deps)
2. Wireframing & UI/UX Design System (6 d, depends wbs-1)
3. Database Schema & System Architecture (5 d, depends wbs-1)
4. Core Module & API Implementation (10 d, depends wbs-2, wbs-3)
5. Automated Unit & Integration Testing (4 d, depends wbs-4)
6. Desktop Installer Build & Deployment (3 d, depends wbs-5)

Total simulated duration: **32 days**. The descriptions reference the app's own tech (SQLite IPC, Vitest, NSIS installer).

**Rendering:** fixed backdrop `z-50 bg-black/60 backdrop-blur-md animate-fade-in`; `glass-panel max-w-2xl` with **explicit dual-theme classes** (`bg-white/95 dark:bg-zinc-950/95`, `border-zinc-200 dark:border-zinc-800`) rather than pure CSS variables — a different theming convention than the variable-driven `glass-panel` (which already sets a bg; the extra classes override it). Header tile `bg-gradient-to-br from-indigo-500 to-purple-600`. Prompt textarea (`input-field font-mono`, rows=3). Generate button shows `<Loader2 animate-spin>` while generating, disabled when `isGenerating || !prompt.trim()`. Preview list: numbered circle badges, name, description, phase pill, emerald duration; "Total Duration: N Days" mono. Footer: Cancel + "Bulk Import Milestones" (`handleApply` strips `id` and calls `onGenerateMilestones` then `onClose`).

### 4.40.4 CodebaseCompositionTreemap.tsx (135 lines)

**Purpose:** a horizontal stacked bar ("treemap") + 4 category cards fed by `ProjectStorageStats`.

**Props:** `storageStats?: ProjectStorageStats | null`, `title?` (default `'Codebase Composition & Storage Distribution'`).

**Memo `categories`** — builds 4 categories from `languageBreakdown` map lookups, each with **hardcoded fallback data** for demo mode:
1. **Source Code** — `typescript`/`javascript`; fallback `{count: 42, size: 2.8MB}`; `FileCode`, `bg-indigo-500`, percent 54.
2. **Configuration** — `json`; fallback `{count: 14, size: 0.6MB}`; `Settings`, `bg-emerald-500`, percent 22.
3. **Documentation** — `markdown`; fallback `{count: 8, size: 0.4MB}`; `FileText`, `bg-amber-500`, percent 14.
4. **Assets & Media** — hardcoded `{count: 12, size: 1.2MB}`; `FolderArchive`, `bg-pink-500`, percent 10.

Sizes converted to MB with `parseFloat(x.toFixed(1))`.

**Rendering:** `Total Files: {storageStats?.totalFiles || 76}` header (fallback 76). Stacked bar with percentage-width segments; `onMouseEnter/onMouseLeave` drives a single `activeCategory` state that dims inactive segments (`opacity-40`) and highlights the matching card (`scale-[1.02] shadow-lg`) — **hover synchronization** between bar and cards.

### 4.40.5 DependencyGraph.tsx (212 lines)

**Purpose:** scans a project's files (top 80 by size), groups by extension category, and shows per-file Mermaid dependency graphs.

**Props:** `selectedProject: Project | null`, `fileTree: any` (**declared but never referenced — dead prop**), `onSelectFile: (path) => void`.

**Load effect** (dep `selectedProject?.folderPath`):
```ts
const result = await window.api.explorer.scanProject(selectedProject.folderPath, false);
const top = rawFiles.sort((a,b) => (b.size||0)-(a.size||0)).slice(0, 80);
for (const f of top) {
  const d = await window.api.explorer.getFileDetails(f.path);   // sequential, up to 80 IPC round-trips
  nodes.push({ path, name, extension, size, importCount, lineCount });
}
```
`loadMermaid(filePath)` fetches `window.api.explorer.getDependencies(filePath)` → raw mermaid source.

**Extension categorization `extCategory(ext)`:** code (`.js .ts .jsx .tsx .py .java .c .cpp .go .rs .rb .php .swift .kt .dart`) → `FileCode` indigo; config (`.json .yaml .yml .toml .xml .config`) → `Settings` zinc; doc (`.md .txt .pdf .docx`) → `FileText` sky; data (`.sql .db .csv`) → `HardDrive` emerald; other → `FileCode` zinc.

**Rendering:** `grid grid-cols-1 lg:grid-cols-3` — left (2 cols) "Files by Type (N)" grouped via `reduce` into `Record<category, FileNode[]>`; chips show `{importCount} imports · {lineCount} lines`. Right (1 col) "Dependency Graph": mermaid **raw text** (`whitespace-pre-wrap font-mono`) + "Copy Mermaid" button (`navigator.clipboard.writeText`) + hint "Copy it into a Mermaid renderer to visualize" — **there is no mermaid rendering library in the app**; the user pastes the text into an external tool.

### 4.40.6 DocumentList.tsx (106 lines)

**Props:** `documents: ProjectDocument[]`, `projectId` (**passed but unused — dead prop**), `onAddDocument`, `onRemoveDocument?`, `onReadDocument?`.

**Document type → emoji mapping `getDocIcon(docType)`:** `pdf` → 📕, `md` → 📝, `docx` → 📘, `txt` → 📄, `auto-generated` → 🤖, default → 📄.

**Rendering:** header "Documents (N)" + `btn-ghost` "Add Document"; empty state with `FileText`; each row has emoji + fileName + mono filePath; an "AI" pill (`bg-purple-500/10 ...`) when `doc.isAiGenerated`; Read button only when `onReadDocument` AND the doc type is readable (`auto-generated`/`md`/`txt`); Delete button when `onRemoveDocument`. Actions use the **hover-reveal pattern** (`opacity-0 group-hover:opacity-100`).

### 4.40.7 ErrorBoundary.tsx (60 lines)

A class component wrapping `<Routes>` inside `AppLayout`. `getDerivedStateFromError` sets `hasError` + `error`; `componentDidCatch` console.errors. Error UI: `AlertTriangle`, "Something went wrong", the message in a scrollable `<pre>`, and a recovery button that resets state, sets `window.location.hash = '#/'`, then `window.location.reload()` — a **full page reload to the dashboard**. Because the boundary wraps only routed content, the sidebar and toast stack survive a page crash.

### 4.40.8 ExportButtons.tsx (93 lines)

**Props:** `projectId`, `projectName`.

**Dispatch by export type** — `window.api.export.summary/techstack/architecture/health/full/'ai-generated'` (each returns a markdown string), then `window.api.export.save(content, defaultName)` with `defaultName = ${projectName.toLowerCase().replace(/\s+/g, '-')}-${type}.md`.

**State machine:** `isExporting: ExportType | null` → `exported: ExportType | null` (✓ flash, reset after 3 s via `setTimeout`). All buttons disabled while any export runs (`disabled={isExporting !== null}`). Per-type icons: spinning `Loader2` / emerald `Check` / `FileDown`. Labels + descriptions come from `EXPORT_TYPES` in `../types/Report`.

### 4.40.9 GitHubPanel.tsx (120 lines)

**Props:** `githubData: GitHubMetadata`, `githubUrl` — fully presentational, no store/IPC.

**Rendering:** description; stats grid of `StatCard`s — Stars (amber), Forks (blue), Issues (`AlertCircle`, orange), Visibility (`Eye`, emerald); `glass-panel` details with `DetailRow`s — Language, License, Last Push (`toLocaleDateString('en-US', {year, month:'short', day})`), Default Branch; topics as `bg-indigo-500/10 text-indigo-400 border-indigo-500/15` pills; full-width "Open on GitHub" CTA (`target="_blank" rel="noopener noreferrer"`). Local helpers `StatCard`/`DetailRow` accept `icon: any` — the file's only type looseness.

### 4.40.10 HealthPanel.tsx (163 lines)

**Props:** `projectId: string`, `hostedUrl: string`, `lastHealth: any` (loosely typed).

**Data flow:** `useHealthStore()` — `checkHealth`, `isChecking`, `healthLogs`, `fetchHealthLogs`; local `localHealth` **seeded from the `lastHealth` prop** (`useState(lastHealth)`) then overwritten by fresh check results — a "prop-to-state mirror". `useEffect` (dep `[projectId]`) → `fetchHealthLogs(projectId)`.

**Recharts:** `AreaChart` of `logs.slice(0, 20).reverse().map(...)` → `{ time: 'HH:MM', responseTime, isUp: 1|0 }`. `<defs>` `linearGradient` `responseGradient` (#818cf8 → transparent), axes with `tick={{fill:'#52525b', fontSize:10}}`, dark custom Tooltip (`rgba(15,15,25,0.9)` bg), `<Area type="monotone" dataKey="responseTime" stroke="#818cf8">`. Only rendered when `chartData.length > 1`.

**Status cards (grid-cols-2 sm:grid-cols-4):** Status (`getHealthIcon` emoji + `getHealthColor`), Response (`{responseTime} ms` or "—"), HTTP Code, SSL (`✓ Valid`/`✗ Invalid` emerald/red via `sslValid`). Check button: `btn-primary w-full`, `RefreshCw` spins while `isLoading`.

> **Chart colors are hardcoded hex** (#818cf8, #52525b) rather than CSS variables — charts cannot be themed by the index.css variable system; tooltips are always dark-styled regardless of theme.

### 4.40.11 InteractiveActivityHeatmap.tsx (375 lines)

The flagship analytics component: a GitHub-style contribution heatmap with tech-stack filtering, range switching, and a floating tooltip.

**Props:** `logs?: ActivityLog[]` (default `[]`), `projects?: Project[]`, `commits?: CommitActivity[]`, `onSelectDate?`, `onSelectTech?`, `title?`, `subtitle?`.

**State:** `selectedTech`, `hoveredTech`, `hoveredCell`, `rangeDays` (default 365). `activeFilterTech = hoveredTech || selectedTech` — **hover takes precedence over click selection**.

**Memo 1 `techStackStats`** — counts tech occurrences across all projects' `techStack`; **fallback demo data** when empty: `TypeScript 54, Python 17, React 12, Node.js 9, Rust 8`. Percentage = `round(count/total·100) || 10`, sorted desc, top 5. `colorMap`: TypeScript→emerald, Python→amber, Rust→slate, React→cyan, JavaScript→yellow, Node.js→green, CSS→indigo, HTML→orange, SQL→purple; unknown → `[emerald, amber, indigo, cyan, purple][idx % 5]`.

**Memo 2 `gridData`** — date-keyed maps from logs (`log.date`) and commits (`date.split('T')[0]`); iterates the last `rangeDays` backwards. **Synthetic activity seeding:** for days with no data, a deterministic pseudo-random `seed = (year*1000 + month*50 + day) % 17` with seed ∈ {1,3,7,12,15} injects `hours = (seed%5)*0.8+0.5`, `commits = (seed%4)+1` — **the heatmap is never empty**. Tech per day from matching project techStacks, fallback `['TypeScript','Python','React','Node.js','Rust'][seed % 5]`.

**Level thresholds:** 4 if `hours>6 || commits>4`; 3 if `hours>4 || commits>2`; 2 if `hours>2 || commits>1`; else 1; 0 when no activity.

**Rendering:** `grid grid-cols-1 lg:grid-cols-4` — left column "Filter by Stack" (per-tech rows with animated progress bars, click to select / hover to preview); right (3 cols) "Activity Timeline (N Days)" matrix `grid-flow-col grid-rows-7` inside `min-w-[640px] overflow-x-auto` (7 rows = weekdays, columns = weeks). Cells: `w-3.5 h-3.5 rounded-[3px] hover:scale-125 hover:z-20`, emerald ramp by default, **amber ramp for Python/Rust**, dimmed when filtered out. Month footer labels Jan/Mar/May/Jul/Sep/Nov. Dynamic tooltip (`bg-zinc-900 backdrop-blur-md`) shows date, hours, primary tech, commits.

### 4.40.12 InteractiveCategoryDistribution.tsx (164 lines)

Donut chart with active-shape pop-out and clickable legend.

**Props:** `data: Record<string, number> | CategoryData[]` (**both shapes supported**), `onSelectCategory?`, `selectedCategory?`, `title?`.

**Memo `formattedData`** — arrays used as-is; records mapped with `DEFAULT_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#06b6d4']` (indigo, emerald, amber, pink, blue, violet, cyan) and filtered to `value > 0`.

**Recharts (heavy):** `PieChart` with `innerRadius={65} outerRadius={85} paddingAngle={4}`, custom **`renderActiveShape`** drawing the slice name at `(cx, cy-8)`, `{value} projects ({(percent*100).toFixed(0)}%)` at `(cx, cy+14)`, a `<Sector>` expanded +8 (pop-out), and a highlight arc ring at `outerRadius+10 → +14`. `onMouseEnter` sets `activeIndex`; `onClick` toggles selection. Selected cells get `stroke="#ffffff" strokeWidth={2}`. Custom Legend formatter renders clickable `<span>`s — selected = `text-indigo-400 font-bold underline`, else `text-zinc-500`. Tooltip dark-styled (`rgba(10,10,15,0.95)`).

### 4.40.13 InteractiveGanttChart.tsx (223 lines)

A **hand-rolled, no-library Gantt chart** with zoom modes and hover-linked left list.

**Props:** `milestones: Milestone[]`, `project?: Project | null`, `onSelectMilestone?`, `onUpdateMilestoneStatus?` (**declared but never used — dead prop**).

**Memo `timelineDates`:** min = earliest `startDate` (or now), max = latest `targetDate` (or now+60 d), falling back to `project.startDate`/`expectedEndDate`; **buffer −5/+10 days**; `stepDays = 1 | 7 | 14` (days/weeks/`months` — **"months" zoom is actually biweekly, not calendar months**); date array capped at **40 ticks**.

**Rendering:** `grid grid-cols-1 lg:grid-cols-12` — left 4 cols "Milestone Name & Progress" (name, responsible member, `{progress}%`, status pill: completed → emerald, `priority === 'critical'` → red, else indigo); right 8 cols timeline with `min-w-[500px] overflow-x-auto`. Bar positioning math: `leftPct = clamp(0..95, (mStart - minT)/totalSpan·100)`, `widthPct = clamp(4..100-leftPct, (mTarget-mStart)/totalSpan·100)`. Bars colored by status (completed emerald, critical red, `In Progress` amber, else indigo) with a `bg-white/20` progress overlay at `width: progress%`. Hover state (`hoveredMilestone`) syncs the left list and right bars (`ring-2 ring-emerald-400 scale-[1.01]`).

### 4.40.14 InteractiveWorkTimeTrend.tsx (207 lines)

Daily hours/commits trend chart with metric and chart-type switching — the **most chart-diverse component**.

**Props:** `logs?: ActivityLog[]`, `startDate?` (default 14 days ago), `endDate?` (default now), `title?`.

**Memo `trendData`:** pre-fills every day in range with `{hours:0, commits:0}` in a date-keyed Map; sums `log.totalHours`; **synthetic commits:** `syntheticCommits = hours > 0 ? Math.ceil(hours * 1.2) : 0` — commits are *derived from hours* when real commit data isn't present.

**Recharts:** three variants sharing `metric: 'hours' | 'commits'` — Area (`#6366f1` gradient), Bar (`radius={[4,4,0,0]}`), Line (`#10b981`). Dark tooltips everywhere; margins `{top:10, right:10, left:-20, bottom:0}`.

**Controls:** metric pill (Hours/Commits; active `bg-indigo-500/20 text-indigo-400`); chart-type icon pill (`Activity` area / `BarChart2` bar / `LineIcon` line; active `bg-zinc-800 text-zinc-100`). Empty state: "No work logs recorded in this period."

### 4.40.15 MilestoneBudgetTracker.tsx (100 lines)

**Props:** `milestones: Milestone[]`, `hourlyRate?: number` (default **65**).

**Memo `budgetStats`** — the estimation heuristic:
- `estimatedHours = m.progress ? Math.round(m.progress * 0.25) : 12` — **progress% · 0.25**, or 12 default hours (applied to both est and actual).
- `completedMilestones` = `status === 'completed' || workflowStatus === 'Completed'`.
- `estCost = totalEstHours * hourlyRate`; `actualCost = totalActualHours * hourlyRate`; `burnPercentage = round(actual/est·100) || 0`.

**Rendering:** `Billing Rate: $65/hr` chip; 3 stat cards — Planned Cost (indigo, "N total planned hours"), Logged Spend (emerald, "N completed milestone hours"), Hour Burn Rate (animated `bg-indigo-500` progress bar). All math client-side; no IPC.

### 4.40.16 ProjectCard.tsx (143 lines)

**Props:** `project: Project`, `index: number` (staggered animation delay).

**Rendering:** whole card is a `<button>` → `/project/${project.id}` with `glass-card` + inline `animationDelay: ${index*50}ms` (staggered fade-in). Header: name (`group-hover:text-indigo-300`), mono folder path, sliding `ArrowRight`. Badge row: Archived (amber), `type-badge type-${project.type}` from `PROJECT_TYPES`, category (📁 + indigo), GitHub (`<GitBranch>` when `isOnGitHub`), Hosted (cyan `<Globe>` when `isHosted`), Health (`status-badge status-${healthStatus}` + `getHealthIcon` when `lastHealth` exists). Tech chips (first 5, "+N more"), tag chips (first 4). Footer: doc count, GitHub stars (⭐ when `(githubData as any)?.stars > 0`), updated date.

> The card reads `project.lastHealth` and `project.githubData` with `as any` casts — consistent with those fields being `unknown` in the type system (§4.38.11).

### 4.40.17 ProjectPhasePipeline.tsx (157 lines)

**Props:** `currentPhase?` (default `'Development'`), `milestones?: Milestone[]`, `onSelectPhase?`, `selectedPhase?`.

**`LIFECYCLE_PHASES`** (10): Idea (`Lightbulb`), Research (`Search`), Requirement Analysis (`FileCheck`, label "Requirements"), UI/UX Design (`Palette`), Architecture Design (`Layers`), Development (`Code`), Testing (`TestTube`), Deployment (`Rocket`), Maintenance (`Wrench`), Completed (`CheckCircle2`).

**Logic:** `currentIndex` = case-insensitive find of `currentPhase`; `activeIdx = currentIndex >= 0 ? currentIndex : 5` (fallback to Development). `countsByPhase` from helper **`useMemoMap(milestones)` — a misnomer: it is a plain function with no memoization** despite the name.

**Rendering:** horizontal scrollable stepper (`min-w-[900px]`); per phase: node classes for filtered/current/passed/future states; icon tile (current → `bg-indigo-600 text-white animate-pulse`; passed → shows `CheckCircle2` instead of the phase icon); "ACTIVE" mini-pill on the current phase; `ChevronRight` connectors (emerald if passed); milestone count per phase; click toggles `onSelectPhase(phase.value)`.

### 4.40.18 Sidebar.tsx (116 lines)

**Props:** none — self-contained.

**Navigation config:**
```ts
const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/add', label: 'Add Project', icon: PlusCircle },
  { path: '/kanban', label: 'Kanban Board', icon: Columns },
  { path: '/activity', label: 'Activity Log', icon: Calendar },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/timeline', label: 'Timeline & Planning', icon: Milestone },
  { path: '/explorer', label: 'Project Explorer', icon: FolderOpen },
  { path: '/docs', label: 'Documentation', icon: BookOpen },
  { path: '/github', label: 'GitHub', icon: Github },
  { path: '/settings', label: 'Settings', icon: Settings },
];
```
(`/notifications` is **not** in the sidebar even though it's routed.)

**Theme ownership:** `isDark` lazy-initialized from `localStorage.getItem('theme') === 'dark'` or the OS `prefers-color-scheme`; a `useEffect` toggles the `dark` class on `document.documentElement` and persists the `theme` key. **The Sidebar is the only theme controller in the app.**

**Rendering:** `.sidebar` aside; logo region uses `drag-region` with inner `no-drag` (the frameless-window drag handle); logo tile `bg-gradient-to-br from-[#90EE90] to-emerald-500` with `FolderKanban`; brand text "Junglans" (`text-emerald-800` — a hardcoded color that is not theme-aware); theme toggle button (Sun when dark / Moon when light). Active item detection: root path exact match, others `startsWith(path)`. Footer: "Organization: Junglans", "Developer: Manosakthi".

### 4.40.19 TeamWorkloadMatrix.tsx (119 lines)

**Props:** `members: TeamMember[]`, `milestones: Milestone[]`.

**Memo `workloadStats`** per member:
- `assigned` = milestones where `responsibleMemberId === member.id || responsibleMemberName === member.name`.
- `totalHours = Σ (m.progress ? round(m.progress*0.2) : 10)` — **progress% · 0.2 heuristic**, 10 h default per assigned milestone.
- `weeklyCapacity = 40` (hardcoded); `loadPercentage = round(totalHours/40·100)`; `isOverAllocated = totalHours > 40`.

**Rendering:** card grid; over-allocated members get `bg-red-500/10 border-red-500/30`; avatar = gradient tile with first letter; OVERLOAD chip (`bg-red-500 text-white` + `ShieldAlert`) vs BALANCED (`bg-emerald-500/15 ...`); progress bar red if >100%, amber if >75%, else emerald, width capped at 100.

### 4.40.20 TechStackBadges.tsx (46 lines)

The simplest component: **17-entry color map** (React→cyan, Vue.js→emerald, Angular→red, Svelte→orange, Next.js→zinc, Nuxt.js→emerald, TypeScript→blue, JavaScript→amber, Python→yellow, Java→red, Tailwind CSS→teal, Bootstrap→purple, Node.js→green, WordPress→blue, Vercel→zinc, Netlify→teal, Cloudflare→orange) all in the `bg-X-500/10 text-X-400 border-X-500/20` pattern; unknown → indigo default. `if (techStack.length === 0) return null;` Hover scale 105%.

### 4.40.21 Cross-cutting observations

**Direct `window.api` usage (outside stores) — only 5 sites:**

| Domain | Calls |
|---|---|
| `explorer` | `scanProject(path, false)`, `getFileDetails(path)`, `getDependencies(path)` — all in DependencyGraph |
| `export` | `summary/techstack/architecture/health/full/'ai-generated'(id)`, `save(content, filename)` — ExportButtons, AIPanel |
| `search` | `global(query)` — GlobalSearch |
| `github` | `setToken(token)` — App.tsx |
| `notification` | `onNotificationReceived(cb)`, `removeNotificationListener()` — App.tsx |

Everything else goes through stores.

**Recharts usage patterns:** three components total (HealthPanel AreaChart; InteractiveCategoryDistribution Pie+Sector+Legend; InteractiveWorkTimeTrend Area/Bar/Line). **All chart colors are hardcoded hex** (#6366f1, #10b981, #818cf8, #52525b/#71717a) — charts bypass the CSS-variable theming system entirely, and all tooltips are always dark-styled regardless of theme.

**Synthetic/demo fallback data (important caveat):** several analytics components fabricate data when real data is absent — InteractiveActivityHeatmap (seeded activity + tech counts), InteractiveWorkTimeTrend (commits = hours·1.2), CodebaseCompositionTreemap (fallback counts/sizes), MilestoneBudgetTracker & TeamWorkloadMatrix (hours = progress·0.2–0.25 heuristics), AIWBSGeneratorModal (entirely simulated generation). Charts always render something, but the numbers can be invented.

**Code-quality notes:** many unused imports (`Play` in AIPanel; `Clock/User/AlertCircle/CheckCircle2/ChevronLeft/ChevronRight` in Gantt; `Calendar/GitBranch` in WBS modal; `ExternalLink` in DocumentList; `Sparkles` in Sidebar; `LineChart/Line` in HealthPanel); frequent `any` casts (`lastHealth: any`, `githubData as any`, `fileTree: any`); `useMemoMap` in ProjectPhasePipeline is not memoized; dead computed fields (`dayOfWeek`, `displayDate`, `month` in heatmap CellData).

**Common UI patterns:** pill toggle groups (active `bg-emerald-500 text-white font-semibold shadow-sm` for Gantt zoom/heatmap range, or `bg-indigo-500/20 text-indigo-400` for trend metric); progress bars with `transition-all duration-500` and severity colors; status pills `bg-X-500/10 text-X-400 border-X-500/20`; mono micro-labels (`text-[10px] font-mono text-zinc-500`); glass surfaces (`glass-panel`) for every card/chart; hover-reveal actions; staggered entry animations via inline `animationDelay`.

---

## 4.41 Theming System (`src/index.css`)

`src/index.css` is **581 lines** and is the single most important file for understanding the app's look. The app uses a **hybrid theming approach**: standard Tailwind utilities for layout, plus **CSS variables that redefine the Tailwind zinc/indigo/purple palettes per theme**, plus **explicit light/dark utility pairs** in newer components, plus a **monochrome dark-mode override** for hardcoded dark classes.

### 4.41.1 Font import

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

- **Outfit** (300–800) — primary UI font, applied to `body`.
- **JetBrains Mono** (400–600) — loaded, but **not actually wired into any Tailwind `font-mono` variable** (Tailwind's default mono stack is used; JetBrains Mono is only reachable if `tailwind.config.js` configures `fontFamily.mono`).

### 4.41.2 Layers and light-theme HSL variables

All three Tailwind layers are emitted; custom styles live in `@layer base/components/utilities`. The `:root` block (lines 8–28) uses the shadcn/ui convention of space-separated HSL triplets:

| Variable | Value | Meaning |
|---|---|---|
| `--background` | `0 0% 100%` | Pure white |
| `--foreground` | `215 28% 17%` | Near-black slate text |
| `--card` | `120 100% 98.4%` | Slightly green-tinted white |
| `--popover` | `0 0% 100%` | |
| `--primary` | `120 73% 75%` | **Light green** — the brand accent |
| `--secondary` | `0 0% 100%` | |
| `--muted` | `220 8% 97%` | Light gray |
| `--muted-foreground` | `220 9% 46%` | Medium gray |
| `--accent` | `120 100% 95%` | Very light green |
| `--destructive` | `0 84% 60%` | Red (`btn-danger` uses `hsl(var(--destructive))`) |
| `--border` / `--input` | `220 13% 91%` | Light borders |
| `--ring` | `120 73% 75%` | Green focus ring |
| `--radius` | `0.75rem` | 12 px global radius |

### 4.41.3 The inverted zinc palette (the core trick)

The light-mode zinc scale is **deliberately inverted/remapped** so that light mode reads like "dark mode inverted":

| Variable | Value | Comment |
|---|---|---|
| `--zinc-50` | `#F9FAFB` | near-white (hover bg) |
| `--zinc-100` | `#1F2937` | **dark gray — used as TEXT color in light mode** |
| `--zinc-200` | `#1F2937` | dark gray (same as 100) |
| `--zinc-300` | `#1F2937` | dark gray |
| `--zinc-400` | `#4B5563` | gray-600 |
| `--zinc-500` | `#6B7280` | gray-500 |
| `--zinc-600` | `#9CA3AF` | gray-400 |
| `--zinc-700` | `#9CA3AF` | gray-400 |
| `--zinc-800` | `#D1D5DB` | **light gray border** ("Darker border for higher visibility") |
| `--zinc-900` | `#F3F4F6` | **light gray bg** ("Clear light background") |
| `--zinc-950` | `#FFFFFF` | **pure white card background** |

**Key insight:** the custom components (`glass-card`, `glass-panel`, `btn-secondary`, `input-field`, `.sidebar`) are written **once** using `var(--zinc-*)` and simply flip meaning between themes. In light mode `--zinc-100` = dark text, `--zinc-950` = white card background. In dark mode the zinc scale becomes the standard Tailwind ramp.

### 4.41.4 Remapped indigo and purple palettes (light mode)

- **`--indigo-*` is green.** `--indigo-400: #90EE90` (light green — the brand accent used for primary buttons, focus rings, active sidebar), `--indigo-500: #22C55E` (green-500), `--indigo-600: #16A34A`, down through teal (`--indigo-800: #115E59`) and dark green (`--indigo-950: #064E3B`).
- **`--purple-*` is emerald/teal.** `--purple-500: #10B981` (emerald-500), `--purple-600: #059669`, etc.

> The app's "indigo" (classes like `text-indigo-400`, `bg-indigo-500/15`) is therefore actually a **green** in light mode.

### 4.41.5 Dark theme (`html.dark`)

- **HSL:** standard shadcn dark — `--background: 240 10% 3.9%`, `--foreground: 0 0% 98%`, `--primary: 0 0% 98%` (white), `--destructive: 0 62.8% 30.6%`.
- **Zinc:** standard Tailwind zinc ramp (`--zinc-950: #09090b` … `--zinc-100: #f4f4f5`).
- **Indigo/purple → monochrome white/gray.** The dark theme intentionally collapses accents: `--indigo-400: #ffffff`, `--indigo-500: #fafafa`, `--purple-400: #ffffff`, etc.

> **Dark mode strategy:** green accents in light mode, monochrome white/gray in dark mode.

### 4.41.6 Light-mode overrides for hardcoded dark hexes

```css
html:not(.dark) .bg-\[\#12121a\], /* ~17 escaped arbitrary-value classes */ { 
  background-color: var(--zinc-900) !important;
  color: var(--zinc-100) !important;
  border-color: var(--zinc-800) !important;
}
```

A big list of arbitrary-value Tailwind classes (`bg-[#12121a]`, `bg-[#0c0c12]`, `bg-[#0e0e14]`, `bg-[#09090d]`, `bg-[#0c0c14]/40`, `/80`, `/60`, `bg-[#09090f]/10`, `bg-[#0e0e18]/[0.02]`, `bg-[#0b0b12]/50`, `bg-[#0a0a0f]`, `bg-[#040406]/30`, `bg-[#0c0c12]/80`, `bg-[#0d0d14]/30`, `/95`, …) are force-overridden in light mode. These classes exist because the UI was originally built dark-only; this block **"un-darkens"** them without touching every component file. Form controls get their own override block (`select`, `input[type="text"]`, `input[type="date"]`, `option` → white bg, dark text, light border).

### 4.41.7 Base element styles and custom scrollbar

- `* { border-color: hsl(var(--border)); }` — global default border.
- `body` — `hsl(var(--background))` bg, `hsl(var(--foreground))` text, Outfit font, antialiasing, and **`overflow: hidden`** — the desktop-app pattern: no page scroll; scrolling happens in inner containers.
- **Custom scrollbar:** 6 px wide/thin, transparent track, thumb `var(--indigo-100)` with 3 px radius, hover → `var(--indigo-400)`.

### 4.41.8 Custom component classes (`@layer components`)

- **`.glass-card`** — `var(--zinc-950)` bg, `1px solid var(--zinc-800)` border, `var(--radius)`, `var(--shadow-md)`, `transition: all 0.25s cubic-bezier(0.4,0,0.2,1)`; hover → `border-color: var(--indigo-400)`, `var(--zinc-50)` bg, `var(--shadow-xl)`, `translateY(-2px)` (lift effect).
- **`.glass-panel`** — same base, **no hover effect** (static container).
- **`.gradient-text`** — `bg-clip-text text-transparent` + emerald→teal→indigo gradient.
- **Badges:** `.status-badge`, `.status-healthy/degraded/down/unknown` (emerald/amber/red/gray, with monochrome dark overrides), `.type-badge`, `.type-webapp` (blue), `.type-desktop` (purple), `.type-mobile` (pink), `.type-api` (amber), `.type-library` (emerald); **all `.dark .type-badge` are monochrome**.
- **`.sidebar`** — 16 rem wide, 100vh, `var(--zinc-950)` bg, right border.
- **`.sidebar-item`** — 0.625/0.75 rem padding, radius 0.5 rem, `font-weight: 600`, `var(--zinc-500)`; hover → `var(--zinc-100)`/`var(--zinc-900)`; `.active` → `var(--indigo-800)`/`var(--indigo-100)` + `1px solid var(--indigo-200)` (green pill in light, white/gray pill in dark).
- **Buttons:** `.btn-primary` (indigo-400 bg / zinc-100 text, `active:scale-[0.98]`; dark → `#fafafa` bg / `#09090b` text), `.btn-secondary` (zinc-950 bg / zinc-800 border), `.btn-ghost` (zinc-500 text, hover zinc-900), `.btn-danger` (`hsla(0,84%,60%,0.1)` bg, destructive text).
- **Inputs:** `.input-field` (zinc-950 bg, focus → `border-color: var(--indigo-500)` + `0 0 0 2px var(--indigo-100)` ring; dark focus → `#fafafa` ring), `.input-label`.
- **Tabs:** `.tab-item` with `.active` → `var(--indigo-700)` text + border (dark: white).
- **Loading/effects:** `.pulse-dot` (emerald, `pulse-dot` animation 1.5 s), `.skeleton` (shimmer gradient), `.glow-indigo`/`.glow-emerald` (soft green glows).
- **Toggle switch (premium styles):** `.toggle-switch` 2.25×1.25 rem pill with `.active` → `var(--indigo-500)`; `.toggle-switch-knob` 1 rem white circle, `.active` → `translateX(0.875rem)`; dark overrides flip knob to near-black.

### 4.41.9 Utilities and keyframes

- **`.drag-region`** — `-webkit-app-region: drag` (frameless-window drag handle).
- **`.no-drag`** — `-webkit-app-region: no-drag`.
- **`.text-balance`** — `text-wrap: balance`.
- **Keyframes:** `pulse-dot` (opacity/scale pulse) and `shimmer` (background-position sweep).
- **Note:** `animate-fade-in`, `animate-slide-up`, `animate-scale-in` (used heavily in components) are **not defined in index.css** — they must come from `tailwind.config.js`.

### 4.41.10 The two parallel theming systems

1. **Variable-driven classes** (`glass-card`, `glass-panel`, `btn-*`, `input-field`, `sidebar-*`, `status-*`, `type-badge`, `tab-item`, `toggle-switch`) that flip via zinc/indigo/purple redefinition under `.dark`.
2. **Explicit dual-theme utilities** (`bg-white/95 dark:bg-zinc-950/95`, `border-zinc-200 dark:border-zinc-800`, `text-zinc-900 dark:text-zinc-100`) used in the newer analytics components (InteractiveGanttChart, AIWBSGeneratorModal, CodebaseCompositionTreemap, InteractiveActivityHeatmap).

Both coexist; the overrides in §4.41.6 patch legacy hardcoded classes to work in light mode.

---

## 4.42 GlobalSearch & App Shell

### 4.42.1 `src/main.tsx` (10 lines)

Standard React 18 `createRoot` mount targeting `#root`, wrapped in `<React.StrictMode>`, importing `./index.css`. StrictMode double-fires effects in dev — the app-level effect cleanup (notification listener removal) is written correctly to survive this. Routing is set up inside `App.tsx` (HashRouter), and `ErrorBoundary` lives inside `AppLayout` around `<Routes>` (not at the root).

### 4.42.2 `src/App.tsx` (156 lines) — the application shell

**Structure:** `AppLayout` (inner component using router hooks) renders `GlobalSearch` + `Sidebar` + `<main>` + a fixed toast stack:

```tsx
<div className="flex h-screen overflow-hidden">
  <GlobalSearch />        // overlay modal, renders null when closed
  <Sidebar />             // left nav, width 16rem
  <main className="flex-1 overflow-y-auto">
    <div className="animate-fade-in" key={location.pathname}>  // remount-on-route-change animation
      <ErrorBoundary>
        <Routes>...</Routes>
      </ErrorBoundary>
    </div>
  </main>
  {/* Toast stack: fixed bottom-6 right-6 z-50 */}
</div>
```

- `key={location.pathname}` **forces React to remount the page subtree on every navigation**, replaying the `animate-fade-in` keyframe — a cheap page-transition technique.
- `ErrorBoundary` wraps only routed content, so the sidebar and toasts survive a page crash.

**Effects:**
1. **GitHub token sync** — on mount and whenever `githubToken` changes: `window.api.github.setToken(githubToken)` pushes the persisted token to the main process; guarded by `if (githubToken)`.
2. **Global notification listener** — binds `window.api.notification.onNotificationReceived((notif) => addNotificationReceived(notif))` once on mount, with cleanup `removeNotificationListener()` — the main→renderer push channel wired to the store's live handler (§4.37.9).

**Toast stack:** container `fixed bottom-6 right-6 z-50 ... no-drag pointer-events-none` (no-drag keeps it clickable in the frameless window; each toast re-enables `pointer-events-auto`). Toasts are `glass-card` with a **priority-based left border** (`getPriorityBorder`: critical→red, high→amber, medium→yellow, default→blue) and **category-based icon** (`getCategoryIcon`: github→Github purple, system→Server emerald, project→FolderOpen blue, user→User amber, default→Bell indigo). **Clicking a toast body navigates to `/timeline` and dismisses it**; the X button stops propagation and dismisses only.

### 4.42.3 GlobalSearch.tsx (261 lines) — the Cmd/Ctrl+K palette

A Raycast/VS Code-style command palette searching projects, activities, milestones, documents, and notifications.

**Type config:**
```ts
const typeConfig: Record<string, {icon, color, label}> = {
  project:     { FolderOpen, 'text-indigo-400',  'Project' },
  activity:    { Clock,      'text-emerald-400', 'Activity' },
  milestone:   { Milestone,  'text-amber-400',   'Milestone' },
  document:    { FileText,   'text-blue-400',    'Document' },
  notification:{ Bell,       'text-purple-400',  'Notification' },
};
const HISTORY_KEY = 'global_search_history';
const MAX_HISTORY = 10;
```

**Effects:**
1. **Keyboard shortcut** (dep `[isOpen]`): `(metaKey||ctrlKey) && key==='k'` toggles; `Escape` closes; `window` listener with cleanup.
2. **Open/close side effects** (dep `[isOpen]`): focus input after 50 ms on open; reset query/results on close.
3. **Debounced search** (dep `[query, doSearch]`): 200 ms `setTimeout` before `doSearch(query)`; requires ≥2 chars; timer cleared on cleanup/unmount.
4. `doSearch` is a `useCallback` (empty deps) calling **`window.api.search.global(q)`** → `GlobalSearchResult[]`.

**localStorage helpers:** `getSearchHistory()` / `addToSearchHistory(query)` — JSON array under `HISTORY_KEY`, capped at 10, most-recent-first, deduped.

**Keyboard navigation (`handleKeyDown`):** `ArrowDown`/`ArrowUp` move `selectedIndex` (clamped); `Enter` navigates to `results[selectedIndex]`; mouse hover also sets the index. Selection index is computed against the **flat** results array (`results.indexOf(result)`), so arrows work across the grouped sections.

**Rendering:** overlay `fixed inset-0 z-[100] pt-[15vh] bg-black/60 backdrop-blur-sm`; `max-w-xl glass-panel animate-scale-in`; input row with `⌘K` hint and ESC button; results grouped by type via `reduce` with uppercase micro-label group headers; each row shows icon, title, `matchField` chip, subtitle, `ArrowRight`; selected row `bg-indigo-500/10 border-l-2 border-indigo-400`. History mode (< 2 chars) shows "Recent Searches" with a Clear button. Footer hints: `↑↓ Navigate · ESC Close`.

### 4.42.4 What wires the shell together

The shell's three moving parts — GitHub token sync, notification push, and search — are the only places where the renderer talks to the main process outside a store or page. Together with the stores' refetch-on-mount pattern, they form the complete renderer↔main contract, which maps 1:1 onto the 88 exposed `window.api` methods documented in §2.12.

---

# PART 5 — AI, NOTIFICATIONS, TESTING, BUILD, TROUBLESHOOTING, FAQ

This final part ties the deep dive together around five cross-cutting topics: the AI report pipeline (which spans services, IPC, and the renderer), the background notification system, the testing strategy, the build/packaging pipeline, and then the practical reference material — a troubleshooting guide, an FAQ, a consolidated known-issues list, and the roadmap.

---

## 5.43 The AI Pipeline

The AI report generator is one of the app's marquee features: with one click it walks a project folder, assembles a prompt from the source files, streams a structured Markdown report from a language model, renders it live in the UI, and saves it back into the project as a document. This section is the cross-cutting view of that pipeline. The per-file mechanics live in §3.23 (OllamaService), §3.30 (GeminiService), §3.31 (OpenRouterService), §2.13 (aiHandlers), §4.37.11 (reportStore), and §4.40.2 (AIPanel).

### 5.43.1 The three engines

| | Ollama (local) | Gemini (cloud) | OpenRouter (cloud) |
|---|---|---|---|
| Package | none (plain HTTP) | `@google/generative-ai` | none (plain HTTP + SSE) |
| Auth | none (localhost) | API key from settings | API key from settings |
| Endpoint | `POST {OLLAMA_BASE_URL}/api/generate` (default `http://localhost:11434`) | Google SDK `generateContentStream` | `POST https://openrouter.ai/api/v1/chat/completions` |
| Streaming format | NDJSON lines `{"response": "...", "done": bool}` | SDK stream of chunks (`chunk.text()`) | SSE `data: ...` lines, `[DONE]` terminator, `choices[0].delta.content` |
| Default model | from env or model-name detection | `gemini-3.5-flash` (store default) | `openai/gpt-4o-mini` (store default) |
| Model list | `GET /api/tags` | hardcoded array in reportStore | hardcoded array in reportStore |
| System prompt | fixed per model class (no caller override) | caller-supplied (handlers pass `SYSTEM_PROMPT`) | caller-supplied |
| Cancellation | `cancelGeneration()` exists (AbortController) but is **not wired to IPC** | none | none |
| Report file | `.pm-reports\auto-report.md` (via service) | `.junglans\reports\Architecture_Report_<ts>.md` (via handler) | same as Gemini |

**Key architectural point:** OllamaService, GeminiService, and OpenRouterService all implement the same shape — `generateReport(folderPath, model, onChunk)` (Ollama) or `generateReportStream(folderPath, model, systemPrompt, apiKey, onChunk)` (Gemini/OpenRouter) — and all push plain text chunks through a single callback. That callback is the root of the entire streaming chain (§5.43.4).

### 5.43.2 System prompts and prompt construction

- **Ollama** carries a **huge `SYSTEM_PROMPT` (≈150 lines)** demanding a **17-section** comprehensive Markdown project report: overview, folder structure, a Mermaid architecture diagram, tech stack, per-file documentation, function/class reference, database documentation, API documentation, data flow, execution flow, security review, performance review, missing documentation, improvement suggestions, developer onboarding guide, and conclusion. It instructs **text-only output** and explicitly forbids truncation ("never truncate").
- The Ollama prompt assembly is: `systemPrompt + '\n\n---\n\nProject Files:\n\n' + context + '\n\n---\n\nPlease generate the comprehensive project report now.'`
- **Model-class-based context budget** (Ollama): the service inspects the requested model name — `phi` / `1.5b` / `2b` (and not `gemma`) → **2000** tokens; `gemma` → **8000** tokens; other models fall back to a sensible default. The budget becomes the `maxTokens` argument to `fileWalker.buildContext(folderPath, maxTokens)`, i.e. **the context budget equals the model's max context** — small models get a small context.
- **Gemini/OpenRouter** receive the same (or similar) system prompt from the IPC handlers, and their context budget is overridden to **100,000 tokens** — a very large prompt that most models will reject or truncate; the code does **not** check model context limits for those two providers.

### 5.43.3 Context building (FileWalker)

- `FileWalker` walks the folder with a 19-entry `DEFAULT_IGNORE` list (including `node_modules`, `.git`, `dist`, `build`, `__pycache__`, `venv`, `.next`, `.pm-reports`, and more — full list in §3.29).
- **Priority ordering:** README files first, then config files, then source files — so the most informative content is guaranteed to fit first.
- **Budget enforcement:** a file is skipped entirely if adding it would exceed the limit; if it partially fits and more than 200 characters remain, a **cut-off slice** is emitted followed by `'\n... (context limit reached)\n'`, then the walk breaks.
- The singleton's default budget is **8000 tokens**; callers override as described above.

### 5.43.4 The streaming chain (end-to-end)

```
1. User clicks "Generate Report" in AIPanel (reportStore.generateReport)
2. reportStore registers window.api.ai.onChunk(cb) — cb appends chunk to streamingContent
3. IPC invoke: window.api.ai.generateOllamaReport / generateGeminiReport / generateOpenRouterReport
4. ipcMain handler (aiHandlers.ts) calls the service's streaming method, passing an onChunk wrapper
5. Service parses the wire format (NDJSON / SDK stream / SSE) and calls onChunk(text) per token
6. Handler's wrapper guards `isCancelled`, then `window.webContents.send('ai:chunk', chunk)`
7. Preload's ipcRenderer.on('ai:chunk') forwards to the renderer callback
8. reportStore appends the chunk → React re-renders AIPanel's react-markdown live
9. Service resolves with the full report → handler resolves the IPC promise
10. reportStore replaces streamingContent with the final report, refreshes the project (fetchProject),
    and removes the chunk listener in a finally block
```

The `ai:chunk` channel is the only **push** channel in the AI domain (the other push channel is `notification:received`; both are set up with `ipcRenderer.on` in preload, unlike the 88 `invoke`-style methods — see §2.12).

### 5.43.5 The cancellation gap (important)

There are **three distinct cancellation mechanisms, none of which talk to each other**:

| Layer | Mechanism | What it actually stops |
|---|---|---|
| Renderer (`reportStore.cancelGeneration`) | `ai.cancelStream()` + `removeChunkListener()` + `isGenerating: false` | Stops the UI spinner and chunk appends |
| IPC (`aiHandlers.ts`) | module-level `isCancelled = true` | Drops further chunks; when the service eventually resolves, the handler returns the literal string `'Generation cancelled by user.'` **without saving the report** |
| Ollama service (`OllamaService.cancelGeneration()`) | `AbortController.abort()` | Would abort the HTTP stream — **but is never called by the IPC layer** |

**Consequences:**
- For **Ollama**: clicking "Stop" makes the UI go quiet, but the model keeps generating server-side until completion; only the save is skipped. The request is wasted, but the app stays consistent.
- For **Gemini/OpenRouter**: there is no abort path at all in the service layer; the HTTP connection (especially OpenRouter's, which has **no timeout configured**) runs to completion server-side. A long report can keep burning tokens/quota after the user presses Stop.
- The eventual full report is discarded in all cases (handlers return the cancellation string instead), so there is no data corruption — just wasted compute and a UX lie: "Stop" doesn't stop anything on the wire.

### 5.43.6 Report saving & document attachment

**Two output directories exist** (a classic duplication smell):

| Path | Writer | File name | Notes |
|---|---|---|---|
| `<folder>\.pm-reports\` | `OllamaService.saveReport()` | `auto-report.md` (versioned — appends a suffix if it exists) | In both walkers' ignore lists, so reports never get re-scanned or re-fed |
| `<folder>\.junglans\reports\` | `aiHandlers.ts` `saveReport()` (Gemini/OpenRouter/Ollama-via-IPC) | `Architecture_Report_<timestamp>.md` | `.junglans` is **NOT** in ProjectScannerService's ignore list → AI reports inflate storage stats (§3.19) |

Both then insert a `documents` row (`docType: 'auto-generated'`, `is_ai_generated: 1`) so the report appears in the project's DocumentList with the 🤖 icon (§4.40.6). The renderer then refreshes the project record so the new document shows up immediately.

### 5.43.7 Ollama availability probing

- `reportStore.checkOllama()` is called on AIPanel mount: `ai:checkOllama` → `ollamaService.isAvailable()` (any error → `false`), then `ai:listOllamaModels` → `GET /api/tags` (any error → `[]`).
- The store auto-selects `models[0]` as the default Ollama model.
- AIPanel disables the Ollama engine button with the tooltip "Ollama is not running locally" when the probe fails. Because the probe runs once on mount, **starting Ollama after opening the app requires navigating away and back** (or reloading) for the button to re-enable.

### 5.43.8 Failure modes

1. **Model not found / not pulled** → Ollama returns an error on `/api/generate`; the stream rejects and the store surfaces the message in the error banner.
2. **Huge context, small model** → a 100k-token context sent to a 4k-context model produces a 4xx from the provider or truncation; no retry logic exists.
3. **No timeout on OpenRouter stream** → a hung upstream keeps the "Generating…" state alive indefinitely (the store has no overall timeout).
4. **`export:ai-generated` is a dangling channel** — exposed and typed in preload, but no `ipcMain.handle` exists, so invoking it rejects at runtime with "No handler registered" (§2.13.16). The "AI Report (Qwen)" export button in ExportButtons (fed by `EXPORT_TYPES`) will always fail until the handler is implemented.

### 5.43.9 Legacy artifacts

- The `EXPORT_TYPES` label "AI Report (Qwen)" references the long-gone Qwen-only era; the current engines are Ollama/Gemini/OpenRouter.
- The architecture document (`PROJECT_MANAGEMENT_ARCHITECTURE_FINAL.md`) describes an Ollama-only pipeline triggered when `project.documents.length === 0`, with channels `ollama:check` etc. — none of those channels exist anymore; the live channels are `ai:*` (§2.13).

---

## 5.44 The Notification System

Notifications are the app's only autonomous background behavior: a timer-driven service in the main process performs three kinds of checks and pushes results to the renderer in real time. Full service mechanics are in §3.21; the renderer side is in §4.37.9 and §4.42.2. This section is the end-to-end view.

### 5.44.1 Architecture overview

```
main process                           renderer
──────────────────────                ──────────────────────
NotificationService (scheduler)
   │  runAllChecks every 5 min
   ├─ checkWebHealthAndSSL()  ──┐
   ├─ checkGitHubActivity()    ──┤ each finds an issue
   └─ checkActivityLogReminders() ─┘
                                     │
   create(input)                     │
   ├─ INSERT INTO notifications      │
   ├─ Electron Notification (native)│
   ├─ win.flashFrame(true)           │
   ├─ app.setBadgeCount(unread)      │
   └─ webContents.send('notification:received', n) ───► preload ipcRenderer.on ──►
                                                          useNotificationStore
                                                          .addNotificationReceived(n)
                                                          ├─ dedupe by id
                                                          ├─ play Web-Audio sound
                                                          ├─ desktop Notification
                                                          └─ toast (5.5 s auto-dismiss)
```

### 5.44.2 Categories, priorities, and types

- **Categories** (`NotificationCategory`): `'project' | 'system' | 'github' | 'user'`.
- **Priorities** (`NotificationPriority`): `'low' | 'medium' | 'high' | 'critical'`.
- **Concrete notification types raised by the service:**
  - `downtime` — system/critical — a hosted URL is down (dedup window: 15 min).
  - `ssl_expired` — system/critical — certificate already expired (dedup: 1 day).
  - `ssl_expiry_warning` — system/high — certificate expires within 10 days (dedup: 3 days; metadata includes `expiry`).
  - `pushed` — github/medium — a linked repo's `pushed_at` changed.
  - `issue_created` — github/medium — `open_issues_count` increased.
  - `daily_reminder` — user/medium — no `working` activity logged today after 5 PM.

### 5.44.3 The scheduler

- `startScheduler(intervalMs = 300000)`: clears any existing interval; runs an **initial `runAllChecks()` after 5 seconds** (so the user sees fresh state shortly after launch); then `setInterval(runAllChecks, 300000)` — **every 5 minutes**.
- `stopScheduler()`: clears the interval and nulls the field; called from both shutdown handlers (idempotent).
- `runAllChecks()` runs the three checks **sequentially** inside one try/catch with a single `log.error` on total failure; each check has its own per-project try/catch so one bad project can't kill the pass.

### 5.44.4 `checkWebHealthAndSSL()`

- Selects `is_hosted = 1` projects; for each:
  - **HTTP check:** `axios.get(url, { timeout: 8000, validateStatus: () => true, headers: { 'User-Agent': 'ProjectManager-HealthCheck/1.0' } })`; `isUp = 200 <= status < 400`; request failure → `isUp = false, statusCode = 0`.
  - **Always persists** a row in `health_logs` and **always overwrites** `projects.last_health` with `JSON.stringify({ url, statusCode, responseTime, isUp, checkedAt })`.
  - **Downtime alert** only if no `downtime` notification in the last 15 minutes (`datetime(created_at) > datetime('now', '-15 minutes')`).
  - **SSL check** (https URLs only) via `tls.connect` + `getPeerCertificate()`: `daysRemaining <= 0` → `ssl_expired`; `<= 10` → `ssl_expiry_warning`.
- **Known drift:** the `last_health` JSON written here has **no `sslValid`/`sslExpiry` fields**, but `MarkdownExporter` reads exactly those fields when rendering the health export (§3.26) — exported health reports show `undefined` for SSL until the two shapes are aligned. Also, `NotificationService` computes `daysRemaining` with `Math.ceil` while `HealthService.checkSSL` uses `Math.floor` — the same certificate can report differently by one day depending on which path checked it.

### 5.44.5 `checkGitHubActivity()`

- For every project with a `github_url`: parse owner/repo via `/github\.com\/([^/]+)\/([^/]+)/`, then an **unauthenticated** `GET https://api.github.com/repos/{owner}/{repo}` (UA `ProjectManager-Agent/1.0`, 5 s timeout).
- Compares the stored `github_data` JSON with the fresh payload: `pushed_at` change → `pushed` (medium); `open_issues_count` increase → `issue_created` (medium). Always rewrites `github_data` with the fresh payload.
- **Rate-limit footgun:** unauthenticated GitHub is capped at **60 requests/hour**; with several linked repos plus the AnalyticsService commit loop plus manual GitHub-page browsing, the hourly quota can be exhausted mid-check — the check degrades to failure notifications-free silence (the per-project catch swallows it).

### 5.44.6 `checkActivityLogReminders()`

- Only runs when `now.getHours() >= 17` (5 PM **local** time).
- Computes `todayStr = now.toISOString().slice(0, 10)` (**UTC date**) — near midnight in non-UTC timezones the "today" can be yesterday.
- If no `working` log exists for that date → `daily_reminder` (medium), deduped via `date(created_at) = date('now')` (also UTC).

### 5.44.7 `create()` — the emission path

1. UUID id + ISO timestamp; `INSERT` with `metadata` JSON-stringified (or null); re-fetch via `getById(id)!`.
2. **Native OS notification** when `ElectronNotification.isSupported()` (title/body, `silent: false`).
3. **Taskbar flash:** `win.flashFrame(true)` on all non-destroyed windows.
4. **Live push:** `broadcast()` → `webContents.send('notification:received', notification)` to all windows.
5. **Badge:** `app.setBadgeCount(unread)` guarded by `typeof app.setBadgeCount === 'function'`.

### 5.44.8 The renderer experience

- `App.tsx` binds the push channel once on mount (`onNotificationReceived` → `addNotificationReceived`, cleanup `removeNotificationListener` — StrictMode-safe).
- `addNotificationReceived` (store, §4.37.9): dedupes by id, **prepends** the notification, recomputes `unreadCount`, plays the **synthesized Web Audio sound** (three priority variants — critical double-beep, high ascending chime, medium/low bubble), fires a **desktop Notification** (icon `./assets/icon.png`), and spawns a **toast** that auto-dismisses after 5.5 s.
- The toast stack (§4.42.2) styles by priority (left border red/amber/yellow/blue) and category (Github/Server/FolderOpen/User icons). **Clicking a toast navigates to `/timeline`** and dismisses it.
- The Notifications page (`/notifications`) reads the same store: list, category/priority filters, mark-read/mark-all/delete/clear-all, and the `pm_audio_notifications` toggle.

### 5.44.9 Cross-cutting issues

- **UTC vs local:** all dedup windows (`15 minutes`, `1 day`, `3 days`, `today`) are computed against UTC timestamps while the UI displays local time — dedup windows and daily reminders can be off by the timezone offset.
- **Notification rows accumulate**: there is no pruning job; `clearAll()` nukes the table but nothing auto-deletes old rows.
- **`notification:received` listeners are one-way**: only the scheduler path creates notifications; the `NotificationSimulatePayload` type exists for a dev/test UI that the main process does not actually expose.
- Deleting a project does **not** cascade to its notifications (see §3.22) — orphaned rows keep their `project_id` pointing at nothing; the UI handles the null join gracefully.

---

## 5.45 Testing Strategy

### 5.45.1 Infrastructure

- **Runner:** Vitest 4 (`vitest.config.ts`, 18 lines):
  - `environment: 'node'` — tests run in Node, not jsdom (all current tests are main-process/service tests).
  - `globals: true` — `describe`/`it`/`expect` are global.
  - `setupFiles: []` — no global setup.
  - `include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']`; `exclude: ['node_modules', 'dist', '.idea', '.git', '.cache']`.
  - Aliases `@` → `./src` and `@shared` → `./shared` (the `@shared` alias currently has no matching directory — a stale config entry).
- **Scripts:** `npm test` → `vitest run` (single run, no watch).
- **Test framework deps present:** `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` are installed but **no renderer/component test uses them yet** — the renderer currently has zero tests.

### 5.45.2 The test inventory (4 files, ~23 tests)

| File | Tests | Covers |
|---|---|---|
| `services/GitHubService.test.ts` | 11 | `parseGitHubUrl` (standard / `.git` / scp-style SSH URLs), `detectHostingProvider` (Vercel, GitHub Pages), `validateRepo` with mocked axios, `getMetadata` mapping |
| `services/HealthService.test.ts` | 6 | `getHealthStatus` (healthy/degraded/down logic), `check()` building a `HealthResult` with mocked HTTP + TLS, graceful failure paths |
| `services/ProjectManager.test.ts` | 4 | `create` with mocked fs + SQLite insert, `list` with document mapping, `delete` with correct UUID |
| `src/utils/CriticalPathCalculator.test.ts` | 2 | empty input → empty Map; sequential milestones with `dependencies: ['m1']` → both flagged `isCritical: true` |

All **21** service tests (per the June 2026 QA report) pass; the two critical-path tests also pass. Test fixtures build full `Milestone`/`Project` objects inline, which serves as documentation of the type contracts.

### 5.45.3 Coverage gaps (substantial)

- **Untested services:** ActivityService, AnalyticsService, NotificationService, TimelineService, GitService, FileWalker, MarkdownExporter, ProjectScannerService, AnalysisService, OllamaService, GeminiService, OpenRouterService, TeamService, ProjectNotesService, ProjectTemplateManager.
- **No store tests** (Zustand actions) despite the stores containing real logic (weekly summary math, dedupe, engine dispatch).
- **No component tests** despite jsdom + testing-library being installed.
- **No IPC-layer tests** (handler error behavior, the cancellation flag, the dangling `export:ai-generated`).
- **No e2e/Playwright tests**; the QA evidence is manual.
- The tests that do exist mock at the `axios`/`fs` level but run against **real `initSqlJs`-backed databases** where the services import `getDatabase()` — this works in CI because `ProjectManager.test.ts` uses the in-memory wrapper, but it couples tests to the sql.js wasm loading path.

### 5.45.4 Verification results (June 2026 QA run)

- `npm run typecheck` (`tsc --noEmit`) — **passed**.
- `npm run lint` (`eslint src/ electron/ services/ database/`) — **failed**: 8 errors and 288 warnings (296 total), dominated by `@typescript-eslint/no-explicit-any` and unused variables (the unused imports catalogued in §4.40.21 are a large part of the warning count).
- `npm run build` (`tsc && vite build`) — **passed**, with a warning about chunks larger than 500 kB (recharts + exceljs being the heavyweights).

### 5.45.5 How to work with tests

```bash
npm test               # single run
npx vitest watch       # interactive watch
npx vitest run --coverage   # (requires @vitest/coverage-v8 — not installed yet)
```

To add a test: drop a `*.test.ts` next to the module (the include glob picks it up automatically), follow the existing style (describe/it, `vi.mock` for axios, real or mocked DB), and run `npm test`. There is no CI pipeline configured in the repository — tests are run locally.

---

## 5.46 Build, Packaging & Distribution

### 5.46.1 The dev workflow

- `npm run electron:dev` → `concurrently "vite" "wait-on http://localhost:5173 && electron ."` — starts the Vite dev server on port 5173, waits for it, then launches Electron against it.
- `vite.config.ts` uses **`vite-plugin-electron`** with two entries:
  1. `electron/main.ts` → builds to `dist-electron/` with `rollupOptions.external: ['sql.js', 'electron']` (sql.js is loaded from node_modules at runtime, not bundled).
  2. `electron/preload.ts` → same outDir, with `onstart(args) { args.reload(); }` so preload changes hot-reload the Electron window in dev.
- `vite-plugin-electron-renderer` makes the renderer bundle compatible with Electron's `file://` loading.
- Aliases: `@` → `./src`, `@shared` → `./shared` (the latter is unused).
- `npm run dev` alone serves the renderer without Electron (useful for UI-only work, though `window.api` will be undefined).

### 5.46.2 The production build

`npm run electron:build` = `npm run build && electron-builder`:

1. `npm run build` → `tsc` (type-checks the whole project and emits) + `vite build` (renderer → `dist/`, main/preload → `dist-electron/`).
2. `electron-builder` packages the app from the config below.

`package.json` `main` points at `dist-electron/main.js` — the compiled main process is the entry the packaged app launches.

### 5.46.3 electron-builder configuration (`electron-builder.yml`, 37 lines)

| Key | Value | Notes |
|---|---|---|
| `appId` | `com.junglans.projectmanager` | |
| `productName` | `Project Manager` | Distinct from the npm name `project-manager`; affects installer names, not the userData path (that derives from the package `name` — see §1.1.1) |
| `directories.buildResources` | `assets` | icons live here |
| `directories.output` | `dist-app` | artifacts are written to `dist-app/` |
| `files` | `dist`, `dist-electron` | only the two build outputs — node_modules are auto-included by electron-builder's dependency resolution |
| `win.target` | `nsis`, `x64` | Windows installer, 64-bit only |
| `win.icon` | `assets/icon.ico` | |
| `nsis.oneClick` | `false` | installer wizard, not one-click |
| `nsis.allowToChangeInstallationDirectory` | `true` | user can pick the install dir |
| `mac.target` | `dmg`, `x64` + `arm64` | Intel + Apple Silicon |
| `mac.icon` | `assets/icon.png` | |
| `linux.target` | `AppImage`, `x64` | |

There is **no `publish` block** — despite `PROJECT_MANAGEMENT_ARCHITECTURE_FINAL.md` mentioning electron-updater/auto-update via GitHub Releases, the live config does **not** enable auto-updates, and `electron-updater` is not in `package.json`. Distribution is: run `npm run electron:build`, take the `.exe` from `dist-app/`, upload to GitHub Releases manually.

### 5.46.4 Packaging caveats

1. **sql.js WASM:** `initSqlJs()` is called with **no `locateFile`** (see §2.14) — the loader must find `sql-wasm.wasm` next to the bundled module. Vite/electron-builder's handling of the wasm asset is implicit; if the wasm file is missing at runtime, the database layer fails at startup with an init error. This is the most likely first-boot failure in a fresh packaging environment.
2. **No code signing** on Windows or macOS — SmartScreen / Gatekeeper warnings on first run.
3. **`sandbox: false`** in the BrowserWindow webPreferences (§2.11) — Electron shows a console warning in newer versions; required because the preload does module-level requires beyond `electron`'s sandboxed API surface.
4. **Chunk size warnings** — the renderer bundle is large (>500 kB chunks) due to recharts/exceljs-in-ui-paths; startup on slow disks is noticeably slower.
5. **`dist/` and `dist-electron/` must both exist** — running `electron-builder` without `npm run build` first produces an app with a missing renderer.
6. The `.env` handling: `dotenv` is loaded in the main process; **a real `GEMINI_API_KEY` was committed to the repo's `.env` at some point** (flagged in `report.md`) — rotate it if you inherited this repo. `.env` is not in the packaging `files` list, so production builds fall back to the settings store's keys.

---

## 5.47 Troubleshooting Guide

### 5.47.1 The app window opens blank

1. Check the dev console (View → Toggle Developer Tools, `Ctrl+Shift+I`).
2. `window.api` undefined? The preload failed — check the terminal for preload build errors, then run `npm run electron:dev` fresh (preload changes need a full restart, not just a page reload).
3. White screen with an error boundary UI instead? The ErrorBoundary (§4.40.7) caught a render crash — the recovery button reloads to the dashboard.
4. If the window shows but the DB is empty: the userData path changed (see §1.1.1) or the DB file is corrupt (next entry).

### 5.47.2 Database failure on startup / "sql-wasm.wasm" errors

- The whole database lives in `%APPDATA%\project-manager\project-manager.db` (see §2.14). If `initSqlJs` can't load the wasm, **every** `getDatabase()` call throws and the app appears dead.
- **Fix:** verify `sql-wasm.wasm` is present in `dist-electron/` after `npm run build`; if missing, copy it from `node_modules/sql.js/dist/` or add an explicit `locateFile` in `database/db.ts`.
- If a **migration fails** mid-upgrade, the app throws at startup (migrations are sequential and not wrapped per-step — see §2.14.4). The `.sql`-file-based migrations on disk (001–003) do not match the 13 inline migrations the code actually runs (§2.16) — do not manually apply files from `database/migrations/` to fix a runtime database; use the in-app backup instead.

### 5.47.3 Recovering from a corrupted database

- `ProjectManager.backupDatabase()` writes `junglans-backup-<date>.db` snapshots (see §3.22). To restore: **stop the app**, copy the backup over `project-manager.db`, and **restart the app** — the "restore" path in the UI only swaps the file on disk; the in-memory sql.js database is not reloaded, so the restore does not take effect until the process restarts.
- Backups contain full exports of the single-file database, so they are portable across machines.

### 5.47.4 "Ollama is not running locally" / engine button disabled

- The availability probe runs **once per AIPanel mount**. Start Ollama (`ollama serve`), pull the model (`ollama pull gemma:2b` or similar), then navigate away from the project and back (or reload) to re-trigger `checkOllama()`.
- Context budget by model class: small models (`phi`, `1.5b`, `2b`) get 2000 tokens; `gemma` gets 8000. If the generated report stops abruptly with little content, switch to a larger model.
- Ollama logs go to the terminal where `ollama serve` runs; `electron-log` also records the service's errors.

### 5.47.5 "Stop" doesn't actually stop generation

Expected behavior given §5.43.5: the UI stops updating and the save is skipped, but the model keeps computing. If you need a hard stop, kill the `ollama serve` process (Ollama) or cancel the provider's request dashboard (Gemini/OpenRouter). The wiring gap is a known issue (§5.49).

### 5.47.6 Gemini/OpenRouter report fails with "API key is not configured"

- Keys are read from `useSettingsStore` (persisted under `junglans-settings` in localStorage — plain text). Enter the key in Settings, verify it persists across reloads, then retry.
- Remember the renderer only sends the key to the main process at generation time (for Gemini/OpenRouter) — the GitHub token, by contrast, is pushed to the main process live via `github:setToken` on every change (§4.42.2).

### 5.47.7 The "AI Report (Qwen)" export always fails

`window.api.export['ai-generated']` is typed and exposed but has **no `ipcMain.handle`** — every invocation rejects with `Error: No handler registered for 'export:ai-generated'`. Use the AI panel instead (§4.40.2); the export button is a stub (see §5.49, item 2).

### 5.47.8 GitHub features suddenly return 403 / rate-limit errors

- Unauthenticated GitHub API = **60 requests/hour per IP**. The notification scheduler (every 5 min, per repo), the AnalyticsService commit loop, and manual browsing share the same quota.
- Fix: set a token in Settings. A token raises the limit to 5000/hr and is required for private repos. The token is validated via `github:validateToken` (returns `GitHubTokenScope` with `rateLimit` info).

### 5.47.9 Health checks report wrong/different SSL days

- `NotificationService` uses `Math.ceil` for days-remaining while `HealthService.checkSSL` uses `Math.floor` — the same certificate can differ by a day between the two paths (§3.21 vs §3.28). Cross-check against the raw `sslExpiry` value rather than the derived day count.
- Exported health reports may show `undefined` for SSL fields: the `last_health` JSON written by the scheduler lacks `sslValid`/`sslExpiry` (§5.44.4). Run a manual health check from the Health panel first — `HealthService.check()` writes the full shape.

### 5.47.10 Charts show numbers that don't match reality

Several analytics components **invent data** when real data is absent (§4.40.21): the heatmap seeds pseudo-random activity; the work-time trend derives commits as `hours × 1.2`; the treemap falls back to hardcoded counts; budget/workload matrices estimate hours from `progress × 0.2–0.25`; the WBS modal is fully simulated. If a dashboard looks "too alive", check whether the underlying data (activity logs, milestones) exists — the visuals are demo-mode by design.

### 5.47.11 Lint/typecheck failures

- `npm run typecheck` should pass; if it doesn't, the most common breakage is a type mismatch between `electron.d.ts` (`ElectronAPI`) and `preload.ts` — the typed surface must match the exposed object exactly (a one-to-one contract; see §2.12).
- `npm run lint` fails by default (8 errors, 288 warnings — mostly `no-explicit-any` and unused imports). To make CI pass, prioritize the 8 errors first; they are all `any`-related in service/handler code.

### 5.47.12 Deleted milestone still appears in charts/dependencies

`deleteMilestone` does not clean up other milestones' `dependencies` arrays or related rows (§3.25). If a Gantt/dependency view references a ghost id, edit the remaining milestone's dependencies manually. Similarly, `ProjectManager.delete` leaves orphaned documents/health logs/milestones/notifications/activity rows (only `hardDelete` cascades — §3.22).

### 5.47.13 Storage stats look inflated

AI reports written via the IPC path land in `<folder>\.junglans\reports\` — a directory the scanner does **not** ignore (§3.19), so storage stats include your AI reports. The `.pm-reports` path is ignored, so Ollama-service-saved reports do not inflate stats. This asymmetry is a known issue.

### 5.47.14 Notification timing seems off

All notification dedup windows and the daily reminder's "today" are computed in **UTC** (`datetime('now')`, `toISOString().slice(0,10)`) while the UI shows local time (§5.44.9). If a daily reminder fires on the wrong day near midnight, that's the cause. The reminder also only fires when the local hour is ≥ 17 — if the machine is asleep then, it fires on the next scheduler tick after wake.

### 5.47.15 Theme looks wrong in light mode

Some legacy components hardcode dark hex classes (`bg-[#12121a]` etc.); index.css force-overrides ~17 of them via `html:not(.dark)` (§4.41.6). If a component still looks dark in light mode, it uses an arbitrary class not yet in that override list — add it there (or convert the component to the variable-driven classes).

---

## 5.48 Frequently Asked Questions (FAQ)

**Q1. Where is my data stored?**
A single SQLite file at `%APPDATA%\project-manager\project-manager.db` (Windows; the `project-manager` name comes from `package.json` `name` — §1.1.1). The DB is sql.js (WASM), loaded entirely into memory and written back to disk on every write (§2.14.2).

**Q2. Is there any cloud sync?**
No. The app is local-first; the only outbound traffic is GitHub API calls (explicit actions + the 5-minute scheduler), health checks to user-provided URLs, and AI generation when you pick Gemini/OpenRouter (§1.2).

**Q3. Which AI models can I use?**
Three engines: local Ollama (any pulled model, e.g. `gemma:2b`, with model-size-aware context budgets), Google Gemini (`gemini-3.5-flash` recommended), and OpenRouter (`openai/gpt-4o-mini` recommended, plus Claude Haiku and Llama-3-8B in the picker). Model lists for Gemini/OpenRouter are hardcoded in `reportStore` (§4.37.11).

**Q4. Are my API keys safe?**
No — they are stored in plain text in `localStorage` under `junglans-settings` (§4.37.8) and sent to the main process when used. There is no keychain integration in the current implementation (the architecture doc mentions keytar, but it is not implemented). Use scoped tokens with limited permissions.

**Q5. How does the weekly summary work?**
Monday–Sunday weeks (UTC-based date slicing); a day's status precedence is `working > holiday > leave`; `totalHours` is summed from per-log `totalHours` computed by `ActivityService.calculateHours`. The math lives in the renderer (`activityStore.getWeeklySummary`) — the service-side `WeeklySummary` is dead code (§4.37.2, §3.18).

**Q6. What does "critical path" mean in the timeline?**
`CriticalPathCalculator` marks milestones whose delay would push the whole project (§3.35). Caveats: it does not topologically sort (depends on array order), treats durations in whole days, and uses float comparisons — treat results as advisory.

**Q7. Why does the dashboard show data I never entered?**
Demo-mode fallbacks: synthetic heatmap cells, `commits = hours × 1.2`, hardcoded treemap sizes, and budget/workload hour heuristics (§4.40.21). Real data always overrides them when present.

**Q8. How do I export my data?**
Markdown: the Export panel (summary/techstack/architecture/health/full — each opens a save dialog). Excel: weekly activity export (`activity.exportWeekly`) and the 4-sheet analytics export (`analytics.export`) via exceljs. Database: manual copy of the `.db` file, or the backup snapshots written to the userData folder.

**Q9. What are the 13 migrations and why do only 5 have .sql files?**
The runtime applies 13 migrations defined inline in `db.ts` (§2.14.4); only 001–005 have matching `.sql` files in `database/migrations/`, and those files are **not read by the app at all** (they are documentation artifacts, and they drifted from the inline definitions — §2.16). Never hand-edit the database expecting the .sql files to be applied.

**Q10. Can I use the app offline?**
Yes for everything except GitHub metadata refresh, health checks (obviously), and cloud AI engines. Local Ollama works fully offline.

**Q11. Why is there a `.pm-reports` AND a `.junglans` folder?**
Two generations of AI-report saving (§5.43.6): `OllamaService.saveReport` uses `.pm-reports` (ignored by scanners); `aiHandlers.saveReport` uses `.junglans\reports` (not ignored — inflates storage stats).

**Q12. Is there an auto-updater?**
No. `electron-builder.yml` has no `publish` block and `electron-updater` is not installed, despite the architecture doc's claims (§5.46.3). Releases are manual: build → upload installer to GitHub Releases.

**Q13. How do I add a new IPC channel?**
The four-touch contract (§1.7): implement the service method → register `ipcMain.handle` in `electron/ipc/<domain>Handlers.ts` → expose in `electron/preload.ts` → call via `window.api.*`. Miss any of the four and TypeScript (via `electron.d.ts`) or the runtime ("No handler registered") will tell you.

**Q14. Why does the app have a "Project Manager" name but "Junglans" branding?**
`package.json` `name` is `project-manager` and `electron-builder.yml` `productName` is `Project Manager`, while the UI brand is "Junglans". The userData folder derives from the npm `name` — rename it only if you want a fresh (empty) data directory for existing users (§1.1.1).

**Q15. The database is in memory — what happens on a crash?**
Every `run()`/`exec()` triggers a full export + write to disk (no transactions, no atomic rename — §2.14.3). A crash mid-write can truncate the file; the backup snapshots are the recovery path (§5.47.3).

**Q16. Why do StrictMode dev quirks exist (double fetches, double effects)?**
`main.tsx` renders under `<React.StrictMode>`; in dev, effects fire twice (§4.42.1). The app's effects are written idempotently (listener cleanup), so double-fires are harmless — but you'll see duplicate IPC calls in the devtools network/console.

**Q17. Which pages exist and why is Notifications not in the sidebar?**
12 routes total (§4.39.1). `/notifications` is routed but deliberately absent from `navItems` (§4.40.18) — a UX gap; the only navigation into it is direct.

---

## 5.49 Known Issues & Gotchas (consolidated)

This is the master list of every problem documented throughout this README, with pointers to the detailed sections.

### Database & persistence
1. **No transactions / no atomicity** — every write is a full-DB export + `writeFileSync`; a crash mid-write can corrupt the file (§2.14.3).
2. **Migration .sql drift** — 5 of 13 migrations exist as files; the files aren't executed and have drifted (missing CHECK/FKs); 8 migrations exist only inline (§2.16).
3. **DB restore doesn't reload memory** — the "restore" path swaps the file only; requires an app restart (§5.47.3).
4. **Dead seeding code** — ~400 lines of `if (false)` demo inserts in `db.ts`; migration 010 deletes exactly those ids (§2.14.5).
5. **`ProjectManager.rowToProject` doesn't guard JSON parses** — a corrupted row throws during `list()`/`getById()` (§3.17.6).
6. **Delete cascades are incomplete** — `ProjectManager.delete` leaves orphans; only `hardDelete` cleans up (manually, not transactionally) (§3.22). Same for `deleteMilestone` → orphaned dependencies/notifications (§3.25).
7. **`app.setBadgeCount`/taskbar behavior** — notification badge only counts unread; no per-app-configuration (§3.21).

### AI pipeline
8. **Cancel wiring gap** — `ai:cancelStream` stops chunk forwarding only; Ollama's AbortController is never invoked; Gemini/OpenRouter have no abort at all (§5.43.5).
9. **`export:ai-generated` dangling channel** — exposed + typed, no handler; rejects at runtime (§5.43.8).
10. **100k-token contexts for Gemini/OpenRouter** with no model-context awareness — rejections/truncation possible (§5.43.2).
11. **No timeout on the OpenRouter stream** — a hung upstream hangs the UI's "Generating" state forever (§5.43.8).
12. **Two AI output directories** — `.pm-reports` (ignored) vs `.junglans` (not ignored, inflates stats) (§5.43.6).
13. **Stale Ollama availability probe** — engine button stays disabled until remount if Ollama starts after the app (§5.43.7).

### Health & notifications
14. **`last_health` JSON drift** — scheduler writes `{url,statusCode,responseTime,isUp,checkedAt}`; MarkdownExporter reads `sslValid`/`sslExpiry` → `undefined` in exports (§5.44.4).
15. **ceil vs floor SSL days** — NotificationService vs HealthService differ by a day (§5.44.4).
16. **UTC-vs-local windows** — dedup windows and daily reminder "today" use UTC while UI displays local (§5.44.9).
17. **GitHub rate limiting** — 60 req/hr unauthenticated; scheduler + analytics + manual browsing share the quota (§5.44.5).
18. **Health-check concurrency** — scheduler runs checks concurrently with manual HealthPanel checks; both write `health_logs`/`last_health` (§3.21, §3.28).

### UI / theming / components
19. **Synthetic/demo data everywhere** — heatmap seeding, commits=hours×1.2, treemap fallbacks, budget/workload heuristics, simulated WBS (§4.40.21).
20. **Hardcoded chart colors** — Recharts hex values bypass the CSS-variable theme; tooltips always dark (§4.40.21).
21. **~17 hardcoded dark hexes patched for light mode** — new arbitrary-value classes need manual inclusion in the override list (§4.41.6).
22. **Two parallel theming systems** — variable-driven vs explicit `dark:` pairs; inconsistent in newer components (§4.41.10).
23. **Dead props and imports** — `fileTree`, `projectId` (DocumentList), `onUpdateMilestoneStatus`, `Play`, several lucide icons, `TeamMember` import in Analytics types (§4.40.21, §4.38.11).
24. **`useMemoMap` misnomer** — no memoization (§4.40.17).
25. **`/notifications` not in sidebar** (§4.40.18).
26. **Toast click always navigates to `/timeline`** regardless of the notification's domain (§4.42.2).

### Renderer state
27. **Only settingsStore persists** — zoom/filters/models reset on reload (§4.37).
28. **Plain-text secrets in localStorage** (`junglans-settings`) — no keychain (§4.37.8).
29. **No optimistic concurrency / stale-state guards** — wholesale list overwrites after refetch (§4.37.12).
30. **`explorerStore.explainFile` swallows errors into `aiExplanation`** (§4.37.7).

### Build & config
31. **sql.js wasm `locateFile` fragility** — packaging must co-locate `sql-wasm.wasm` (§5.46.4).
32. **`sandbox: false`** with `contextIsolation: true` — moderate security posture (§2.11).
33. **No code signing / no auto-updater** (§5.46.3–5.46.4).
34. **Large bundles** (>500 kB chunks; recharts/exceljs) (§5.45.4).
35. **`@shared` alias points at a nonexistent directory** in vite/vitest configs.
36. **Committed `.env` with a real GEMINI_API_KEY** in repo history — rotate it (§5.46.4).
37. **Lint fails by default** (8 errors, 288 warnings) (§5.45.4).

### Architecture-doc inaccuracies (in `PROJECT_MANAGEMENT_ARCHITECTURE_FINAL.md`)
38. Claims better-sqlite3 — actual is sql.js WASM; claims Ollama-only AI — actual has 3 engines; claims 5 IPC handler files — actual has 16; claims keytar/keychain — not implemented; claims auto-update — not configured; claims 3 SQL migrations 001–003 — actual is 13 inline migrations; claims `src/hooks/` — doesn't exist (§2.16.3, §4.38 intro, §5.46.3).

---

## 5.50 Roadmap

The app is at **v1.2.0**. The roadmap below combines the priorities stated in `PROJECT_MANAGEMENT_ARCHITECTURE_FINAL.md` §13 with the highest-impact fixes this README has surfaced.

### 5.50.1 Planned (from the architecture document)

| Priority | Item | Notes |
|---|---|---|
| High | Multi-workspace support | Multiple project root folders |
| High | Dependency vulnerability scan | Uses the scanner infrastructure (§3.19) |
| Medium | Cloud sync via Supabase/Firebase | Would break the local-first promise — design carefully |
| Medium | CI/CD pipeline viewer | Git integration already exists (§3.27) |
| Medium | Docker detection | Extension of the language/stack detection |
| Medium | Automated screenshots | Companion to the AI report pipeline |
| Medium | Git log viewer | Reuses `gitService` |
| Low | Team collaboration over LAN | Would need a server component |
| Low | Plugin system | Would need a public API surface |
| Low | React Native mobile app | Unrelated stack |

### 5.50.2 Highest-impact fixes this README recommends (in rough order)

1. **Wire the cancellation properly** — call `ollamaService.cancelGeneration()` from `ai:cancelStream`; add AbortControllers to Gemini/OpenRouter; add a hard timeout to the OpenRouter stream (§5.43.5).
2. **Implement `export:ai-generated`** or remove it from the preload/`EXPORT_TYPES` (§5.43.8).
3. **Unify AI report output** — one directory (ignore `.junglans` in the scanner or migrate saving to `.pm-reports`) (§5.43.6).
4. **Align `last_health` JSON** between `NotificationService` and `HealthService`/`MarkdownExporter`; unify the ceil/floor SSL math (§5.44.4).
5. **Add transactions** for `hardDelete` and migration steps; consider WAL-style journaling or atomic rename (`writeFileSync` to temp + rename) in `DatabaseWrapper` (§2.14.3).
6. **Prune dead code** — the `if (false)` seeding block, the `WeeklySummary` dead import, `useMemoMap`, ~20 unused props/imports, and the 288 lint warnings (§5.49).
7. **Add tests** for the untested services and the store logic (§5.45.3); wire a CI pipeline (GitHub Actions: typecheck + lint + vitest run).
8. **Fix `deleteMilestone`/`ProjectManager.delete` orphans** with explicit dependency/notification cleanup (§3.22, §3.25).
9. **Add `locateFile` for sql.js wasm** and verify the packaged app boots from a clean install (§5.46.4).
10. **Security hardening** — optional keychain storage for secrets (electron `safeStorage` is the native, zero-dependency option), and rotation of the leaked committed `GEMINI_API_KEY` (§5.46.4).

### 5.50.3 The final word

Junglans Project Manager is a **feature-rich, genuinely useful local-first project dashboard** whose breadth (registry, time tracking, milestones, codebase analysis, health monitoring, GitHub integration, three-engine AI reporting, notifications, exports) far exceeds what most Electron side-projects ship. Its weaknesses are the classic ones of ambitious single-developer apps: duplicated code paths (two report directories, two SSL computations, two week-math implementations), documented-but-not-implemented features (auto-update, keychain, better-sqlite3), demo data leaking into real dashboards, and a test suite that covers only a sliver of the logic. Every one of those weaknesses is catalogued in §5.49 with pointers to the exact code, which makes this codebase an unusually tractable one to harden — start with the ten fixes above.

---

# PART 6 — APPENDIX: REFERENCE CATALOGS

This part is pure reference material for working in the codebase: a signature catalog for every service method, the complete typed `window.api` surface, step-by-step walkthroughs of the most important user flows, the file inventory, a constants registry, and a glossary. Everything here restates content from Parts 1–5 in a form you can keep open while coding — no new facts, just denser packaging.

---

## 6.51 Service Method Catalog (signature reference)

For prose analysis of each service, see Part 3 (§3.17–§3.36). This appendix is the "call-signature cheat sheet": every public method with its parameters and return type. Line counts refer to the source files as of v1.2.0.

### 6.51.1 ActivityService.ts (447 lines)

```ts
// class ActivityService; export const activityService = new ActivityService();
// DB: activity_logs R/W (+ projects/team_members joins)

calculateHours(inTime: string | null, outTime: string | null): number
// 'HH:MM' → decimal hours; 0 on missing/NaN; PM-crossing heuristic adds 12h when out<in;
// 2-decimal rounding; pure function (no DB)

getLogs(startDate?: string, endDate?: string): ActivityLog[]
// LEFT JOINs project/member names; dynamic WHERE on date range (lexicographic YYYY-MM-DD);
// NO LIMIT when both args omitted; totalHours computed on the fly per row

getLogsByProject(projectId: string, limit = 20): ActivityLog[]
// WHERE project_id = ? ORDER BY date DESC, in_time DESC LIMIT ?

getTotalHoursByProject(projectId: string): number
// sum of totalHours over getLogsByProject(projectId, 9999) WHERE status === 'working'

create(payload: ActivityLogPayload): ActivityLog
// INSERT 10 columns; re-read via getLogs(date,date)+find; throws if read-back missing

update(id: string, payload: Partial<ActivityLogPayload>): ActivityLog
// throws 'Activity log with ID ${id} not found'; per-field fallback; full UPDATE

delete(id: string): boolean
// DELETE; always returns true (no changes check)

async exportWeeklyExcel(startDate: string, endDate: string, savePath: string): Promise<boolean>
// ExcelJS workbook 'Weekly Activity Log': frozen header (navy 1F4E78, Segoe UI 11 bold white),
// 8 columns, status mapped Working Day/Common Holiday/Personal Leave, conditional fills
// (holiday green E2EFDA/375623, leave orange FCE4D6/C65911), hours=0 for non-working,
// summary block with SUM() Excel formula; writeBuffer → writeFile
```

### 6.51.2 ProjectScannerService.ts (713 lines)

```ts
// class ProjectScannerService; export const projectScannerService = new ProjectScannerService();
// DB: none (filesystem only)

scanProject(dirPath: string, includeHidden = false): ProjectScanResult
// { tree: ProjectTreeNode | null, stats: ProjectStorageStats | null, files: unknown[],
//   folders: unknown[] } — recursive walk, hidden handling, per-file stats, language
// breakdown, heatmap data; 2MB read cap for content; failed subpaths → fake zero-size nodes

getFileDetails(filePath: string): AdvancedFileDetails
// stat + line/function/class/import counts (regex heuristics) + sha256 + git last
// author/commit (via exec, `--` separated) + language mapping

getDependencies(filePath: string): string
// Mermaid graph source (import/require/from scanning)

findDuplicateFiles(dirPath: string): DuplicateFileInfo[]
// hash-based duplicate detection

findDeadFiles(dirPath: string): string[]
// files not referenced by any other file (heuristic)
```

### 6.51.3 AnalyticsService.ts (671 lines)

```ts
// class AnalyticsService; export const analyticsService = new AnalyticsService();
// DB: projects/documents/team_members/activity_logs (read); deps: gitService,
// activityService, projectScannerService (teamService imported, unused)

async getSummary(startDate?: string, endDate?: string): Promise<DashboardSummary>
// project metrics (status counts, hosted/github counts, doc counts, attentionRequired),
// team metrics (weekly/monthly hours over Mon–Sun / calendar month, productivity score
// with 0.85 workday factor, 8h/day, fallback 85), dev metrics (git commits loop per
// project, top-10 truncation, doc/ai coverage %)

async getProjectAnalytics(projectId: string): Promise<ProjectAnalytics | null>
// git stats (isRepo/commitCount/contributors/recent 10 commits), activity stats
// (getLogsByProject limit 9999, sum working hours), storage stats (scanProject in
// try/catch → null on missing folder)

async exportAnalyticsExcel(startDate?: string, endDate?: string, savePath?: string): Promise<boolean>
// 4 sheets: Overview Summary (project/team/dev metric rows with color-coded headers),
// Projects List (status color-coding), Team Timesheet (per-member hours/attendance/
// leave/score), Recent Commits
```

### 6.51.4 NotificationService.ts (508 lines)

```ts
// class NotificationService; export const notificationService = new NotificationService();
// DB: notifications R/W, projects R/W, health_logs W, activity_logs R; the only
// timer-driven service

// exported types: NotificationCategory = 'project'|'system'|'github'|'user'
//                 NotificationPriority = 'low'|'medium'|'high'|'critical'

create(input): NotificationData
// INSERT + read-back; native Electron notification (if supported); win.flashFrame(true)
// on all windows; broadcast 'notification:received'; app.setBadgeCount(unread)

getById(id: string): NotificationData | null      // LEFT JOIN projects for name
list(filters?: { category?; isRead?; priority? }): NotificationData[]
markRead(id: string, isRead = true): NotificationData     // non-null assertion
markAllRead(): void
delete(id: string): void
clearAll(): void                                  // unconditional DELETE

startScheduler(intervalMs = 300000): void          // initial run after 5s, then setInterval
stopScheduler(): void                              // idempotent

async runAllChecks(): Promise<void>
// sequential: checkWebHealthAndSSL → checkGitHubActivity → checkActivityLogReminders

// private: checkWebHealthAndSSL (axios 8s, UA ProjectManager-HealthCheck/1.0, dedup
// windows 15min/1day/3days), checkSSLDetails (tls.connect 6s, Math.ceil daysRemaining),
// checkGitHubActivity (unauthenticated, UA ProjectManager-Agent/1.0, 5s, 60req/hr),
// checkActivityLogReminders (local hour ≥17, UTC date, daily dedup), updateAppBadge,
// rowToData, broadcast
```

### 6.51.5 ProjectManager.ts (385 lines)

```ts
// class ProjectManager; export const projectManager = new ProjectManager();
// DB: projects R/W, documents R/W + hardDelete across 6 tables

// module-level helpers: rowToProject(row, documents) (unguarded JSON parses, defaults
// primary_category 'Web Application', status 'active', current_phase 'planning',
// health_indicator 'on-track'; 0 → null for estimated_hours/progress_percentage),
// docRowToDocument(row)

create(input: ProjectCreateInput): ProjectData
// throws 'Folder path does not exist: ...' if !fs.existsSync; 15-col INSERT;
// is_on_github/is_hosted flags derived; documents attached via addDocument

list(includeArchived = false): ProjectData[]       // N+1 documents query per row
getById(id: string): ProjectData | null            // + documents
update(id: string, data: Partial<ProjectData>): ProjectData
// dynamic SET of 22 optional fields + forced updated_at; JSON fields stringified

delete(id: string): void                            // plain DELETE — no cascade
archive(id: string): ProjectData                    // archived = 1
restore(id: string): ProjectData                    // archived = 0
hardDelete(id: string): void
// ordered manual cascade: documents → health_logs → milestone_dependencies (subquery)
// → milestones → notifications → activity_logs (project_id SET NULL, history kept)
// → projects; NOT transactional

addDocument(projectId: string, filePath: string, isAiGenerated = false): DocumentData
// docType = 'auto-generated' | extension-derived; INSERT documents

removeDocument(documentId: string): void
// deletes the file from disk for AI-generated docs (fs.unlinkSync, guarded), then DELETE row

getDocuments(projectId: string): DocumentData[]     // ORDER BY created_at DESC
backupDatabase(): string                            // junglans-backup-<date>.db snapshot
restoreDatabase(backupPath: string): void           // swaps file only — restart required
```

### 6.51.6 OllamaService.ts (451 lines)

```ts
// class OllamaService; export const ollamaService = new OllamaService();
// DB: none; deps: fileWalker; private fields: baseUrl (env OLLAMA_BASE_URL or
// http://localhost:11434), defaultModel (env OLLAMA_DEFAULT_MODEL or llama3),
// abortController

// module-level exported constants: SYSTEM_PROMPT (~150 lines, 17-section report,
// text-only, never truncate), PHI_SYSTEM_PROMPT (7-section condensed variant)

async isAvailable(): Promise<boolean>               // GET /api/tags, 5s timeout, 200 → true
async listModels(): Promise<string[]>               // GET /api/tags → model names; [] on error
async generateReport(folderPath: string, model?: string, onChunk?: (chunk: string) => void): Promise<string>
// no caller-supplied system prompt; maxTokens by model-name substring:
//   qwen|llama3.1|llama3.3 → 24000, phi|1.5b|2b → 2000 (gemma → 8000), else 6000;
// lightweight (phi|gemma|2b|1.5b) → PHI_SYSTEM_PROMPT; POST /api/generate stream:true,
// signal: abortController, timeout 300000; NDJSON per-chunk line parse {response,done};
// resolves on done:true or end; error body drained & surfaced 'Ollama Error: ...'
cancelGeneration(): void
// AbortController.abort() — NOT invoked by ai:cancelStream (wiring gap, §5.43.5)
async saveReport(folderPath: string, content: string): Promise<string>
// .pm-reports/auto-report.md, versioned -v2/-v3…; 4 disclaimer-scrub regexes; returns path
async explainFile(filePath: string, fileContent: string, model?: string): Promise<string>
// non-streaming POST /api/generate, 60s timeout, returns response.data.response
```

### 6.51.7 GitHubService.ts (388 lines)

```ts
// class GitHubService; export const githubService = new GitHubService();
// DB: none; private: baseUrl 'https://api.github.com', token (in-memory only)

setToken(token: string): void / getToken(): string | null   // never persisted
parseGitHubUrl(url: string): { owner: string; repo: string } | null
// /github\.com\/([^\/]+)\/([^\/\s#?]+)/ and scp-style /github\.com:([^\/]+)\/([^\/\s#?.]+)/;
// .git stripped
async validateRepo(url: string): Promise<boolean>    // GET /repos/o/r, 10s, 200 → true
async getMetadata(url: string): Promise<GitHubRepoData>
// ~19 mapped fields; topics||[], license?.spdx_id||null; throws 'Invalid GitHub URL'
async detectPages(url: string): Promise<GitHubPagesInfo>
// has_pages → GET /pages → {hasPages, pagesUrl, customDomain}; catch → {hasPages:false}
detectHostingProvider(homepage: string | null): string | null
// substring checks: .github.io, vercel.app, netlify.app, surge.sh, herokuapp.com,
// railway.app, fly.dev, render.com; other non-null → 'Custom Domain'
async getUser(): Promise<GitHubUser>                 // GET /user
async checkTokenScopes(): Promise<GitHubTokenScope>
// GET /user; x-ratelimit-* headers; x-oauth-scopes (classic tokens only); masked token;
// 401 → isValid:false; scopes '(no token configured)' when tokenless
async getUserRepos(page = 1, perPage = 50): Promise<GitHubRepo[]>   // sort=updated&type=all
async getBranches(owner: string, repo: string): Promise<GitHubBranch[]>  // per_page=100
async getCommits(owner, repo, branch = 'main', page = 1, perPage = 30): Promise<GitHubCommit[]>
async getFileTree(owner, repo, branch = 'main'): Promise<GitHubFileEntry[]>
// NOTE: Contents API at repo ROOT only (not git-tree recursion) despite the name
async getDirContents(owner, repo, path, branch = 'main'): Promise<GitHubFileEntry[]>
async getFileContent(owner, repo, path, branch = 'main'): Promise<string>
// Accept: application/vnd.github.v3.raw; JSON.stringify fallback if object returned
```

### 6.51.8 TimelineService.ts (410 lines)

```ts
// class TimelineService; export const timelineService = new TimelineService();
// DB: milestones R/W, milestone_dependencies R/W, team_members join, projects R/W

getById(id: string): MilestoneData | null
// LEFT JOIN member name/role; deps via SELECT depends_on_id; defaults workflow 'Backlog'
listMilestones(projectId: string): MilestoneData[]   // ORDER BY target_date ASC; N+1 deps
createMilestone(payload): MilestoneData
// 16-col INSERT; defaults status 'pending', progress 0, workflowStatus 'Backlog';
// deps inserted; NO validation of dep ids or date order
updateMilestone(id, payload: Partial<...>): MilestoneData
// throws 'Milestone not found'; dynamic SET; payload.dependencies → full replace
// (DELETE all + re-insert); no orphan cleanup on delete
deleteMilestone(id: string): void
// only DELETE milestones row — orphaned milestone_dependencies rows remain (§5.49)
updateProjectPlanning(projectId: string, payload): void
// dynamic UPDATE projects (start/expected/actual end, current_phase, health_indicator,
// estimated_hours, priority); skips when no fields; no read-back
getTimelineAnalytics(projectId: string): TimelineAnalytics
// overallCompletion (avg progress), phaseCompletion (avg per currentPhase), delayed
// (status≠completed && targetDate < today UTC), upcoming, calculatedHealth
// (>2 delayed → critical; >0 → at-risk; overdue expected_end without actual → critical;
// else on-track), durationDays = ceil((end-start)/day), end = actual||expected
```

### 6.51.9 MarkdownExporter.ts (269 lines)

```ts
// class MarkdownExporter; export const markdownExporter = new MarkdownExporter();
// DB: none (delegates); deps: projectManager, healthService; log imported unused

generateSummary(projectId: string): string
// '# {name} — Project Summary' + info table + GitHub block + tech stack + documents;
// unguarded githubData.* reads; emoji: ⭐🍴💬🔤👁📅📄🟢⬜
generateTechStack(projectId: string): string        // table with categorizeTech()
generateArchitecture(projectId: string): string
// Mermaid graph LR with isolated T0["..."] nodes — NO edges (rendering quirk)
generateHealth(projectId: string): string
// 'not hosted' early-return; current-status table from lastHealth
// (sslValid/sslExpiry → undefined — writer mismatch §5.44.4); history table from
// getHealthLogs(projectId, 20)
generateFull(projectId: string): string
// summary + techstack + architecture + health joined by '\n\n---\n\n'
```

### 6.51.10 GitService.ts (111 lines)

```ts
// class GitService; export const gitService = new GitService();
// DB: none; git CLI via execSync (BLOCKS the main process)

isGitRepository(folderPath: string): boolean        // fs.existsSync(<path>/.git)
getCommitCount(folderPath: string): number          // git rev-list --count HEAD, 5s
getRecentCommits(folderPath: string, projectName: string, limit = 10): CommitActivity[]
// git log -n ${limit} --pretty=format:"%h|%an|%ad|%s"; pipes in messages rejoined;
// date parse failure → now
getContributorsCount(folderPath: string): number    // unique %an names via Set
```

### 6.51.11 HealthService.ts (192 lines)

```ts
// class HealthService; export const healthService = new HealthService();
// DB: health_logs R/W; exported types HealthResult, SSLResult

async check(url: string): Promise<HealthResult>
// axios 15s, maxRedirects 10, validateStatus true, UA ProjectManager-HealthCheck/1.0;
// redirectCount via axios-internal _redirectable (brittle); finalUrl via request.res.responseUrl;
// responseTime INCLUDES the SSL handshake; failures → statusCode 0, isUp false
async checkSSL(url: string): Promise<SSLResult>
// non-https → invalid; tls.connect 10s; daysRemaining = Math.floor (NotificationService
// uses Math.ceil — inconsistency); issuer cert.issuer?.O
saveHealthLog(projectId: string, result: HealthResult): void
// INSERT; redirectCount/finalUrl DROPPED (no columns)
getHealthLogs(projectId: string, limit = 50): HealthResult[]
// rehydrates redirectCount:0 and finalUrl:row.url (fabricated)
getHealthStatus(result: HealthResult): 'healthy' | 'degraded' | 'down'
// !isUp → down; responseTime>2000 → degraded; !sslValid && url.startsWith('https') →
// degraded; else healthy
```

### 6.51.12 FileWalker.ts (268 lines)

```ts
// class FileWalker; export const fileWalker = new FileWalker();
// constructor(ignoreDirs?, maxTokens = 8000) — singleton default budget 8000
// DB: none; deps: none
// module constants: DEFAULT_IGNORE (19 entries incl. .pm-reports), SOURCE_EXTENSIONS
// (39 incl. .env/.gitignore/.dockerfile/.md/.txt/.sql), PRIORITY_FILES (24 entries:
// README, package.json, requirements.txt, Pipfile, pyproject.toml, Cargo.toml, go.mod,
// build.gradle, pom.xml, pubspec.yaml, Gemfile, composer.json, tsconfig.json,
// vite/next/webpack configs, .env.example, Dockerfile, docker-compose.*)

walkDirectory(dirPath: string): FileInfo[]
// recursive; skips ignoreDirs + dot-dirs except .env.example; no-extension files included
// only if named Preferences/First Run/Local State/Dockerfile/Makefile/LICENSE/config;
// >1MB files skipped; relativePath \\ → /
buildContext(dirPath: string, maxTokensOverride?: number): string
// priority files first then extension-sorted; token estimate chars/4; '## Project File
// Structure' tree; per-file 4000-char cap with '(truncated)' marker; budget skip;
// partial fit emits cut-off slice + '(context limit reached)'
getProjectStats(dirPath: string): { totalFiles; languages: Record<string, number>; totalSize }
```

### 6.51.13 GeminiService.ts (83 lines)

```ts
// class GeminiService; export const geminiService = new GeminiService();
// private modelName = 'gemini-3.5-flash' (placeholder — callers pass the real model)
// DB: none; deps: fileWalker; @google/generative-ai

async generateReportStream(folderPath, modelName: string | undefined, systemPrompt: string,
                           apiKey: string, onChunk: (chunk: string) => void): Promise<string>
// throws 'Gemini API key is not configured in Settings.' without key; buildContext(…, 100000);
// model.generateContentStream(prompt) with systemInstruction; per-chunk chunk.text() → onChunk
async explainFile(filePath, fileContent, apiKey): Promise<string>
// non-streaming generateContent; standard explanation prompt
```

### 6.51.14 OpenRouterService.ts (132 lines)

```ts
// class OpenRouterService; export const openRouterService = new OpenRouterService(); // stateless
// DB: none; deps: fileWalker; axios

async generateReportStream(folderPath, modelName: string, systemPrompt: string,
                           apiKey: string, onChunk): Promise<string>
// POST https://openrouter.ai/api/v1/chat/completions; headers Authorization Bearer,
// HTTP-Referer https://github.com/manosakthi/project-manager, X-Title 'Junglans Project
// Manager'; responseType stream; NO TIMEOUT (can hang); SSE parse: 'data: ' lines,
// [DONE] skip, choices[0].delta.content → onChunk
async explainFile(filePath, fileContent, apiKey): Promise<string>
// HARD-CODED model 'openai/gpt-4o-mini' regardless of caller preference
```

### 6.51.15 TeamService.ts (131 lines)

```ts
// class TeamService; export const teamService = new TeamService();
// DB: team_members R/W

list(): TeamMember[]                                // ORDER BY name ASC; isActive = is_active===1
create(payload: TeamMemberPayload): TeamMember
// isActive default 1; avatar = payload.avatar || getRandomAvatarColor(); no read-back
update(id: string, payload: Partial<TeamMemberPayload>): TeamMember
// throws 'Team member with ID ${id} not found'; per-field fallback; preserves createdAt
delete(id: string): boolean                          // always true; dangling refs possible
// private getRandomAvatarColor(): 'indigo'|'emerald'|'blue'|'purple'|'rose'|'amber'|'pink'|'teal'
```

### 6.51.16 ProjectNotesService.ts (50 lines)

```ts
// OBJECT LITERAL: export const ProjectNotesService = { get, upsert, delete };
// DB: project_notes R/W; ids via crypto.randomUUID() (inconsistent with uuid.v4 elsewhere)

get(projectId: string): ProjectNote | null          // one note per project
upsert(projectId: string, content: string): ProjectNote   // SELECT→UPDATE or INSERT
delete(projectId: string): void
```

### 6.51.17 ProjectTemplateManager.ts (113 lines)

```ts
// OBJECT LITERAL: export const ProjectTemplateManager = { list, get, create, update, delete };
// DB: project_templates R/W; ProjectTemplate = { id, name, description, type,
// primaryCategory, tags[], techStack[], milestones: {name, phase, description}[], … }

list(): ProjectTemplate[]                           // ORDER BY name ASC
get(id: string): ProjectTemplate | null
create(payload): ProjectTemplate                    // tags/techStack/milestones JSON
update(id, payload: Partial<...>): ProjectTemplate  // throws 'Template not found'; full-column UPDATE
delete(id: string): void
```

### 6.51.18 AnalysisService.ts (223 lines)

```ts
// class AnalysisService; export const analysisService = new AnalysisService(); // stateless
// DB: none; axios only (Puppeteer dropped — no real browser)

async analyze(url: string): Promise<AnalysisResult>
// axios 30s, maxRedirects 5, Chrome-120 UA; loadTime = HTTP round-trip only;
// SEO via ORDER-SENSITIVE regexes (meta name-before-content; canonical link rel-before-href);
// techStack via HTML substring checks + headers (server/x-powered-by/x-vercel-id/
// x-netlify-request-id); links via href regex (counts script/comment hrefs);
// broken always []; images <img> count + missing/empty alt;
// totalJsSize/totalCssSize = INLINE script/style char counts only (external assets not fetched);
// fcp/lcp/tti always null; robots/sitemap via HEAD 200 check
```

---

## 6.52 The Complete Typed `window.api` Surface

The single source of truth for renderer→main access is `electron.d.ts`. This appendix reproduces the full declaration shape (17 namespaces, 88 invoke methods, 2 event listeners, 2 cleanup helpers) so you can see the contract at a glance without opening the file. Types marked `any` are genuinely loose in the real declaration — the app relies on services to do shape validation.

```ts
declare global {
  interface Window {
    api: {
      project: {
        create(payload: ProjectCreatePayload): Promise<Project>;
        list(includeArchived?: boolean): Promise<Project[]>;
        get(id: string): Promise<Project | null>;
        update(id: string, data: Partial<ProjectCreatePayload>): Promise<Project>;
        delete(id: string): Promise<void>;
        archive(id: string): Promise<Project>;
        restore(id: string): Promise<Project>;
        hardDelete(id: string): Promise<void>;
        addDocument(projectId: string, filePath: string): Promise<void>;
        removeDocument(documentId: string): Promise<void>;
        readDocument(filePath: string): Promise<string>;
      };
      github: {
        validateRepo(url: string): Promise<boolean>;
        getMetadata(url: string): Promise<GitHubRepoData>;
        detectPages(url: string): Promise<GitHubPagesInfo>;
        setToken(token: string): Promise<void>;
        checkTokenScopes(): Promise<GitHubTokenScope>;
        getUser(): Promise<GitHubUser>;
        getUserRepos(page?: number, perPage?: number): Promise<GitHubRepo[]>;
        getBranches(owner: string, repo: string): Promise<GitHubBranch[]>;
        getCommits(owner: string, repo: string, branch?: string, page?: number): Promise<GitHubCommit[]>;
        getFileTree(owner: string, repo: string, branch?: string): Promise<GitHubFileEntry[]>;
        getDirContents(owner: string, repo: string, path: string, branch?: string): Promise<GitHubFileEntry[]>;
        getFileContent(owner: string, repo: string, path: string, branch?: string): Promise<string>;
      };
      git: {
        isRepo(folderPath: string): Promise<boolean>;
        commitCount(folderPath: string): Promise<number>;
        recentCommits(folderPath: string, projectName: string, limit?: number): Promise<CommitActivity[]>;
        contributorsCount(folderPath: string): Promise<number>;
      };
      health: {
        check(url: string, projectId?: string): Promise<HealthResult>;
        ssl(url: string): Promise<SSLResult>;
        analyze(url: string): Promise<AnalysisResult>;
        getLogs(projectId: string, limit?: number): Promise<HealthResult[]>;
      };
      ai: {
        generateGeminiReport(projectId: string, folderPath: string, model: string, apiKey: string): Promise<string>;
        generateOpenRouterReport(projectId: string, folderPath: string, model: string, apiKey: string): Promise<string>;
        generateOllamaReport(projectId: string, folderPath: string, model: string): Promise<string>;
        checkOllama(): Promise<boolean>;
        listOllamaModels(): Promise<string[]>;
        cancelStream(): Promise<void>;
        onChunk(callback: (chunk: string) => void): void;
        removeChunkListener(): void;
      };
      export: {
        summary(projectId: string): Promise<string>;
        techstack(projectId: string): Promise<string>;
        architecture(projectId: string): Promise<string>;
        health(projectId: string): Promise<string>;
        full(projectId: string): Promise<string>;
        'ai-generated'(projectId: string): Promise<string>;   // ⚠ dangling — no handler
        save(content: string, defaultName?: string): Promise<string | null>;
      };
      dialog: {
        selectFolder(): Promise<string | null>;
        selectFiles(filters?: FileFilter[]): Promise<string[]>;
      };
      activity: {
        list(startDate?: string, endDate?: string): Promise<ActivityLog[]>;
        getByProject(projectId: string, limit?: number): Promise<ActivityLog[]>;
        getTotalHoursByProject(projectId: string): Promise<number>;
        create(payload: ActivityLogPayload): Promise<ActivityLog>;
        update(id: string, payload: Partial<ActivityLogPayload>): Promise<ActivityLog>;
        delete(id: string): Promise<boolean>;
        exportWeekly(startDate: string, endDate: string): Promise<string | null>;
      };
      team: {
        list(): Promise<TeamMember[]>;
        create(payload: TeamMemberPayload): Promise<TeamMember>;
        update(id: string, payload: Partial<TeamMemberPayload>): Promise<TeamMember>;
        delete(id: string): Promise<boolean>;
      };
      analytics: {
        getSummary(startDate?: string, endDate?: string): Promise<DashboardSummary>;
        getProjectAnalytics(projectId: string): Promise<ProjectAnalytics | null>;
        export(startDate?: string, endDate?: string): Promise<string | null>;
      };
      notification: {
        list(filters?: { category?: string; isRead?: number; priority?: string }): Promise<Notification[]>;
        markRead(id: string, isRead?: boolean): Promise<Notification>;
        markAllRead(): Promise<void>;
        delete(id: string): Promise<void>;
        clearAll(): Promise<void>;
        simulate(payload: NotificationSimulatePayload): Promise<Notification>;
        onNotificationReceived(callback: (notification: Notification) => void): void;
        removeNotificationListener(): void;
      };
      search: {
        global(query: string): Promise<GlobalSearchResult[]>;
      };
      database: {
        getInfo(): Promise<any>;
        backup(): Promise<string>;
        restore(): Promise<boolean>;
      };
      timeline: {
        listMilestones(projectId: string): Promise<Milestone[]>;
        createMilestone(payload: any): Promise<Milestone>;
        updateMilestone(id: string, payload: Partial<any>): Promise<Milestone>;
        deleteMilestone(id: string): Promise<void>;
        updateProjectPlanning(projectId: string, payload: any): Promise<void>;
        getAnalytics(projectId: string): Promise<TimelineAnalytics>;
      };
      explorer: {
        scanProject(dirPath: string, includeHidden?: boolean): Promise<any>;
        getFileDetails(filePath: string): Promise<AdvancedFileDetails>;
        explainFile(filePath: string, provider: 'gemini' | 'openrouter', apiKey: string, model?: string): Promise<string>;
        auditProject(dirPath: string): Promise<AuditResults>;
        getDependencies(filePath: string): Promise<string>;
      };
      template: {
        list(): Promise<ProjectTemplate[]>;
        get(id: string): Promise<ProjectTemplate | null>;
        create(payload: any): Promise<ProjectTemplate>;
        delete(id: string): Promise<void>;
      };
      note: {
        get(projectId: string): Promise<ProjectNote | null>;
        upsert(projectId: string, content: string): Promise<ProjectNote>;
        delete(projectId: string): Promise<void>;
      };
    };
  }
}
```

**Notes on the declaration:**
- `window:minimize/maximize/close` exist as main-process channels but are **not exposed** here — dead surface (§2.12.3).
- `export['ai-generated']` is exposed and typed but has no handler — invoking rejects (§5.43.8).
- `notification.simulate` is exposed; the main process implements `notification:simulate` but nothing in the UI calls it (it exists for manual testing of the notification UX).
- `GlobalSearchResult`, `ProjectTemplate`, `ProjectNote`, `FileFilter` come from the shared/renderer types; the renderer-side components consume the same types.

---

## 6.53 End-to-End Walkthroughs

Five traced flows tying Parts 2–5 together. Each step names the exact channel/method.

### 6.53.1 Adding a project (the main onboarding flow)

1. User clicks "Add Project" (sidebar → `/add`).
2. `AddProject` page collects the form; folder picked via `window.api.dialog.selectFolder()`.
3. On submit: `useProjectStore.createProject(payload)` → sets loading → `window.api.project.create(payload)` → `project:create` → `projectManager.create` (validates folder exists, UUID, 15-column INSERT, attaches documents) → returns `ProjectData` → store refetches the full list and returns the project.
4. `fetchProjects()` → `project:list` → N+1 documents → `Project[]`.
5. If the project form included a GitHub URL, the page (or the detail page) calls `github.getMetadata(url)` to hydrate `githubData`; if `isHosted`, `HealthPanel`'s `checkHealth` populates `lastHealth`.
6. Navigation to `/project/:id` → `fetchProject(id)` → `project:get` + documents.

### 6.53.2 Exporting the weekly activity Excel

1. ActivityLog page → "Export" button → `activityStore` (via `window.api.activity.exportWeekly(start, end)`).
2. `activity:exportWeekly` → `activityService.exportWeeklyExcel` → `getLogs(startDate, endDate)` → ExcelJS workbook built with the styling rules in §6.51.1 → `writeBuffer` → `fs.writeFile` at a path chosen by the main process (userData or dialog).
3. The resolved path is returned to the renderer; the store surfaces it (and the UI can open the file).

### 6.53.3 Generating an AI report (Ollama engine example)

1. `AIPanel` → "Generate Report" → `reportStore.generateReport(projectId, folderPath)`.
2. Store: clears stream, registers `window.api.ai.onChunk(chunk => append)`, dispatches per `aiEngine`.
3. `window.api.ai.generateOllamaReport(projectId, folderPath, selectedOllamaModel)` → `ai:generateOllamaReport` → `ollamaService.generateReport(folderPath, model, onChunk)`.
4. Service: walks folder (FileWalker, model-class token budget), builds prompt, `POST /api/generate` stream:true, parses NDJSON lines, calls `onChunk(text)` per line.
5. Handler wrapper: if `!isCancelled` → `webContents.send('ai:chunk', text)` → preload `ipcRenderer.on` → store append → react-markdown re-render (live typing).
6. On `done: true` the service resolves with the full text; handler inserts a `documents` row for `<folder>\.junglans\reports\Architecture_Report_<ts>.md` (aiHandlers' own `saveReport`); the IPC promise resolves.
7. Store: replaces `streamingContent` with the final report, refreshes the project (`useProjectStore.fetchProject`), removes the chunk listener in `finally`.

### 6.53.4 The notification push (end-to-end)

1. Scheduler ticks (initial +5 s, then every 5 min) → `runAllChecks`.
2. `checkWebHealthAndSSL` finds a hosted URL down → dedup check passes → `create({category:'system', type:'downtime', priority:'critical', …})`.
3. `create`: INSERT → native OS notification → `flashFrame` → `broadcast` → `webContents.send('notification:received', n)` → badge count refresh.
4. Renderer: `App.tsx` listener → `useNotificationStore.addNotificationReceived(n)` → dedupe, prepend, unread count, Web Audio chime (critical double-beep), desktop Notification, toast (auto-dismiss 5.5 s).
5. User clicks the toast → navigates to `/timeline` and dismisses; the notification persists in the `/notifications` page.

### 6.53.5 Restoring a database backup

1. Settings → database section → `database.backup()` (`db:backup` → `projectManager.backupDatabase`) writes `junglans-backup-<date>.db` into userData.
2. On the restore path, `database.restore()` swaps `project-manager.db` with the backup **on disk only**.
3. **The in-memory sql.js database is not reloaded** — the user must restart the app for the restore to take effect (§5.47.3).

---

## 6.54 File Inventory & Cross-Reference

### 6.54.1 Services inventory (23 files, ~6,300 lines)

| # | File | Lines | Export | Style | Role |
|---|---|---|---|---|---|
| 1 | ActivityService.ts | 447 | `activityService` | class | Daily work-log CRUD + weekly Excel |
| 2 | ProjectScannerService.ts | 713 | `projectScannerService` | class | FS tree walk, stats, details, audits, mermaid |
| 3 | AnalyticsService.ts | 671 | `analyticsService` | class | Dashboard aggregation, 4-sheet Excel |
| 4 | NotificationService.ts | 508 | `notificationService` | class | Notifications + scheduler + 3 checks |
| 5 | ProjectManager.ts | 385 | `projectManager` | class | Project CRUD, archive/hardDelete, documents, backups |
| 6 | OllamaService.ts | 451 | `ollamaService` | class | Local LLM streaming reports, models, explain |
| 7 | GitHubService.ts | 388 | `githubService` | class | GitHub REST wrapper |
| 8 | TimelineService.ts | 410 | `timelineService` | class | Milestones, deps, planning, analytics |
| 9 | MarkdownExporter.ts | 269 | `markdownExporter` | class | Markdown report generation |
| 10 | FileWalker.ts | 268 | `fileWalker` | class | Source discovery + LLM context builder |
| 11 | AnalysisService.ts | 223 | `analysisService` | class | HTTP-only web analysis |
| 12 | HealthService.ts | 192 | `healthService` | class | HTTP+TLS checks, health log persistence |
| 13 | TeamService.ts | 131 | `teamService` | class | Team member CRUD |
| 14 | OpenRouterService.ts | 132 | `openRouterService` | class | OpenRouter streaming reports + explain |
| 15 | GitService.ts | 111 | `gitService` | class | Git CLI wrapper (sync) |
| 16 | GeminiService.ts | 83 | `geminiService` | class | Gemini streaming reports + explain |
| 17 | ProjectNotesService.ts | 50 | `ProjectNotesService` | **object literal** | One note per project |
| 18 | ProjectTemplateManager.ts | 113 | `ProjectTemplateManager` | **object literal** | Project template CRUD |
| 19 | GitHubService.test.ts | 115 | — | — | 11 Vitest tests (axios mocked) |
| 20 | HealthService.test.ts | 89 | — | — | 6 Vitest tests (axios/tls/db mocked) |
| 21 | ProjectManager.test.ts | 120 | — | — | 4 Vitest tests (fs/uuid/db mocked) |
| 22 | CriticalPathCalculator.ts | 113 | `calculateCriticalPath` | pure fn | CPM forward/backward pass |
| 23 | CriticalPathCalculator.test.ts | 61 | — | — | 2 Vitest tests (pure function) |

### 6.54.2 Tables touched per service

| Service | Tables |
|---|---|
| ActivityService | activity_logs (R/W), projects (join), team_members (join) |
| ProjectScannerService | none |
| AnalyticsService | projects, documents, team_members, activity_logs (all R) |
| NotificationService | notifications (R/W), projects (R/W), health_logs (W), activity_logs (R) |
| ProjectManager | projects (R/W), documents (R/W); hardDelete: + health_logs, milestones, milestone_dependencies, notifications (W), activity_logs (null-out) |
| OllamaService | none (filesystem `.pm-reports`) |
| GitHubService | none |
| TimelineService | milestones (R/W), milestone_dependencies (R/W), team_members (join), projects (R/W via updateProjectPlanning) |
| MarkdownExporter | none (delegates) |
| FileWalker | none |
| AnalysisService | none |
| HealthService | health_logs (R/W) |
| TeamService | team_members (R/W) |
| OpenRouterService | none |
| GitService | none (git CLI) |
| GeminiService | none |
| ProjectNotesService | project_notes (R/W) |
| ProjectTemplateManager | project_templates (R/W) |

### 6.54.3 Handler files ↔ namespaces (16 files, 85 channels + 5 in main.ts)

| Handler file | Namespace | Channels |
|---|---|---|
| projectHandlers.ts | project | 11 |
| githubHandlers.ts | github | 12 |
| aiHandlers.ts | ai | 6 (+ ai:chunk push) |
| healthHandlers.ts | health | 4 |
| activityHandlers.ts | activity | 7 |
| teamHandlers.ts | team | 4 |
| analyticsHandlers.ts | analytics | 3 |
| notificationHandlers.ts | notification | 6 (+ notification:received push) |
| searchHandlers.ts | search | 1 |
| gitHandlers.ts | git | 4 |
| timelineHandlers.ts | timeline | 6 |
| explorerHandlers.ts | explorer | 5 |
| exportHandlers.ts | export | 6 (ai-generated missing) |
| templateHandlers.ts | template | 4 |
| noteHandlers.ts | note | 3 |
| dbHandlers.ts | database | 3 |
| (in main.ts) | dialog, window | 5 (window:minimize/maximize/close dead) |

---

## 6.55 Magic Numbers & Constants Registry

The codebase hard-codes many policy values. This registry collects them in one place (sources: §3.17–§3.36, §4.37–§4.41, §5.43–§5.46).

| Value | Meaning | Location |
|---|---|---|
| 300000 ms | notification scheduler interval (5 min) | NotificationService.startScheduler |
| 5000 ms | initial scheduler run delay | NotificationService.startScheduler |
| 8000 ms | scheduler HTTP health-check timeout | checkWebHealthAndSSL |
| 15000 ms | manual health check timeout | HealthService.check |
| 6000 ms | scheduler TLS timeout | NotificationService.checkSSLDetails |
| 10000 ms | manual TLS timeout | HealthService.checkSSL |
| 300000 ms | Ollama generation timeout (5 min) | OllamaService.generateReport |
| 60000 ms | Ollama explain timeout | OllamaService.explainFile |
| — (none) | OpenRouter stream timeout | OpenRouterService (can hang) |
| 2000 ms | degraded threshold (response time) | getHealthStatus (both copies) |
| 15 min | downtime notification dedup window | NotificationService |
| 1 day / 3 days | ssl_expired / ssl_expiry_warning dedup | NotificationService |
| 17:00 | daily reminder start hour (local) | checkActivityLogReminders |
| 60 req/hr | unauthenticated GitHub rate limit | NotificationService, GitHubService docs |
| 5 s / 10 s / 15 s | GitHub API timeouts (validate/metadata 10s; repos 15s; scheduler 5s) | GitHubService |
| 2000 / 6000 / 8000 / 24000 | Ollama model-class token budgets | OllamaService.generateReport |
| 100000 | Gemini/OpenRouter context budget | GeminiService, OpenRouterService |
| 8000 | FileWalker singleton default budget | FileWalker constructor |
| 4000 chars | per-file context truncation cap | FileWalker.buildContext |
| 200 chars | partial-fit cutoff threshold | FileWalker.buildContext |
| 1 MB | file size cap for walking | FileWalker.walkDirectory |
| 2 MB | content read cap for file details | ProjectScannerService |
| 500 KB / 20 MB | scanner read limits (health/data) | ProjectScannerService internals |
| 0.85 | workday factor in productivity score | AnalyticsService |
| 8 h | expected hours per member per day | AnalyticsService |
| 85 | fallback productivity score | AnalyticsService |
| 9999 | unbounded activity query limit | ActivityService/AnalyticsService |
| 10 / 20 / 50 | commit, health-log, health-history limits | GitService, HealthService, MarkdownExporter |
| 40 | hardcoded weekly capacity (h) | TeamWorkloadMatrix |
| 65 | default hourly rate ($) | MilestoneBudgetTracker |
| 0.2 / 0.25 | progress→hours heuristics | TeamWorkloadMatrix / MilestoneBudgetTracker |
| 1.2 | synthetic commits factor (hours × 1.2) | InteractiveWorkTimeTrend |
| 5500 ms | toast auto-dismiss | notificationStore |
| 200 ms | search debounce | GlobalSearch |
| 1200 ms | simulated WBS "AI" delay | AIWBSGeneratorModal |
| 365 / 180 / 90 | heatmap range options | InteractiveActivityHeatmap |
| 40 | Gantt tick cap | InteractiveGanttChart |
| 7 / 14 | Gantt zoom day-steps (weeks/months) | InteractiveGanttChart |
| 0.75 rem | global radius | index.css --radius |
| 65 / 85 | Recharts donut inner/outer radius | InteractiveCategoryDistribution |

---

## 6.56 Glossary

| Term | Meaning |
|---|---|
| **Main process** | Electron's Node.js process (`electron/main.ts` + `dist-electron/main.js`). Owns the DB, services, IPC handlers, windows, and the scheduler. |
| **Renderer process** | The Chromium process running the React app (`src/`). Sandboxed from Node; talks to main only via `window.api`. |
| **Preload / bridge** | `electron/preload.ts` — `contextBridge.exposeInMainWorld('api', …)`; the only door between renderer and main. |
| **window.api** | The typed global exposing 88 invoke methods + 2 listeners (see §6.52). |
| **IPC channel** | A named main↔renderer path. 90 `ipcMain.handle` channels total (85 in `electron/ipc/`, 5 in main.ts). |
| **sql.js** | SQLite compiled to WebAssembly; the DB runs in memory and is exported to `project-manager.db` on every write. |
| **Migration** | A versioned SQL step applied at startup. 13 exist, all inline in `db.ts`; only 5 have matching `.sql` files. |
| **Singleton** | The `export const x = new X()` pattern every service uses (two object-literal exceptions). |
| **Zustand store** | A renderer-side state container (`create<State>()(…)`); 10 stores, one persisted (`junglans-settings`). |
| **onChunk / ai:chunk** | The push channel carrying AI stream tokens main→renderer. |
| **notification:received** | The push channel carrying live notifications main→renderer. |
| **NDJSON** | Newline-delimited JSON — Ollama's `/api/generate` stream format. |
| **SSE** | Server-Sent Events — OpenRouter's `data: …` stream format. |
| **Mermaid** | Text-based diagram syntax; the app generates it but never renders it (user copies into an external renderer). |
| **CPM** | Critical Path Method — `CriticalPathCalculator` forward/backward pass over milestones. |
| **WBS** | Work Breakdown Structure — milestone decomposition; the modal's "AI" is a simulated `setTimeout` stub. |
| **userData** | Electron per-user data dir: `%APPDATA%\project-manager` (Windows). Holds the DB, backups, and electron-log output. |
| **Dedup window** | The time-based guard preventing repeated notifications for the same event (15 min / 1 day / 3 days). |
| **Dangling channel** | Exposed in preload but missing an `ipcMain.handle` — invoking rejects (`export:ai-generated`). |
| **StrictMode** | React dev double-rendering mode (`main.tsx`); effects fire twice in dev. |
| **Synthetic data** | Demo-mode fabricated values in analytics components when real data is absent (§4.40.21). |
| **HashRouter** | `react-router-dom` router using URL hashes — required for Electron `file://` loading. |
| **.pm-reports / .junglans** | The two AI-report output directories (service path vs handler path). |
| **Dangling FK reference** | A row pointing at a deleted parent (e.g. orphaned `milestone_dependencies` after `deleteMilestone`). |

---

*End of Part 6. Continue to the top of this document for the table of contents; the section index links every part of the deep dive.*
