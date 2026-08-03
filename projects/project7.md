# Junglans Expense Tracker — Deep Dive

A full-stack, AI-powered expense tracking system: a hardened Python/Flask JSON API with a hybrid AES-256-GCM + RSA-2048 + neural-hardened encryption engine, mated to a React Native 0.82 mobile app (Android + iOS) that automatically extracts transactions from bank SMS.

> **Maturity:** Production-hardened. `task.md` tracks the full run from a sibling "4/10 → 10/10" production-readiness pass (P0–P4: ship-blocking, high-risk, scaling, polish). `SECURITY_AUDIT.md` contains two independent security reviews (standard + hacking-level) that drove the remediation work reflected throughout this repo.

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Repository Layout](#2-repository-layout)
3. [Backend Deep Dive (`APP/`)](#3-backend-deep-dive)
   - 3.1 [app.py — Flask API](#31-apppy--flask-api)
   - 3.2 [enc.py — Encryption Engine](#32-encpy--encryption-engine)
   - 3.3 [schemas.py — Request Validation](#33-schemaspy--request-validation)
   - 3.4 [models.py — SQLAlchemy / PostgreSQL](#34-modelspy--sqlalchemy--postgresql)
   - 3.5 [Celery Worker](#35-celery-worker)
   - 3.6 [backup_db.py](#36-backup_dbpy)
   - 3.7 [Utilities](#37-utilities)
   - 3.8 [Docker // APP](#38-docker--app)
4. [Frontend Deep Dive (`JunglansExpense/`)](#4-frontend-deep-dive-junglansexpense)
   - 4.1 [Entry Points](#41-entry-points)
   - 4.2 [Dependencies](#42-dependencies)
   - 4.3 [API Client](#43-api-client)
   - 4.4 [Context Providers](#44-context-providers)
   - 4.5 [Navigation](#45-navigation)
   - 4.6 [Screens](#46-screens)
   - 4.7 [Reusable Components](#47-reusable-components)
   - 4.8 [Custom Hooks](#48-custom-hooks)
   - 4.9 [Utilities & Services](#49-utilities--services)
   - 4.10 [Theme System](#410-theme-system)
5. [Database Schema](#5-database-schema)
6. [SMS Parsing & AI Pipeline](#6-sms-parsing--ai-pipeline)
7. [Background Services](#7-background-services)
8. [API Reference](#8-api-reference)
9. [Security Posture](#9-security-posture)
10. [Testing](#10-testing)
11. [CI/CD & Developer Tooling](#11-cicd--developer-tooling)
12. [Docker & Deployment](#12-docker--deployment)
13. [Environment Variables](#13-environment-variables)
14. [Setup & Installation](#14-setup--installation)
15. [Known Issues & Roadmap](#15-known-issues--roadmap)

---

## 1. System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    React Native App (TS/JS, Hermes)                │
│  ┌─────────┐ ┌───────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │ Screens │ │Components  │ │ Contexts │ │ Utils / Services  │   │
│  │  (13)   │ │ (11)       │ │  (3)     │ │  Background, SMS, │   │
│  └─────────┘ └───────────┘ └──────────┘ │  Encryption, Sync  │   │
│       │            │            │        └───────────────────┘   │
│       └────────────┴────────────┴────────────────┘               │
│                        │                                         │
│            Navigation: Stack + Bottom Tabs                        │
│            (custom animated ModernTabBar)                        │
│                        │                                         │
│              API Client (axios, JWT interceptor,                 │
│              30s GET cache, configurable base URL)               │
│                        │                                         │
│              Client Crypto: AES-CBC + RSA-2048 (JSEncrypt)       │
└─────────────────────────┬────────────────────────────────────────┘
                          │ REST over HTTPS (JSON)
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                  Python Flask Backend (APP/)             │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ Bootstrap: bcrypt(13) · JWT · token blacklist · rate limit │ │
│   │            login lockout · audit log · SSL · security      │ │
│   │            headers · DB migrations · Sentry · Swagger      │ │
│   └────────────────────────────────────────────────────────────┘ │
│   ┌──────────────┐  ┌───────────────┐  ┌──────────────────────┐ │
│   │ REST Routes  │  │   Queue:      │  │  AI Parser (Ollama)  │ │
│   │ (22) all JWT │  │  daemon thread│  │  phi3 · JSON mode ·  │ │
│   │  + rate limit│  │  retry×3, 2s  │  │  15s timeout · 512-  │ │
│   └──────────────┘  └───────────────┘  │  entry LRU · regex   │ │
│                       (optional:       │  fallback            │ │
│                        Celery worker)  └──────────────────────┘ │
│   ┌───────────────────────────── Encryption Engine ─────────────┐ │
│   │  AES-256-GCM · RSA-2048 OAEP(+CBC compat) · nonce store    │ │
│   │  12-Layer TransformerHardener · TransformerValidator ·     │ │
│   │  MetricsCollector (attack/eval/threat metrics)             │ │
│   └────────────────────────────────────────────────────────────┘ │
│                      │                                          │
│                      ▼                                          │
│       SQLite (default) ⇄ PostgreSQL (DATABASE_URL)             │
└──────────────────────────────────────────────────────────────────┘
```

Key flows (all end-to-end):

- **SMS sync:** App reads SMS → filters bank-senders + keywords → encrypts payload (AES-CBC + RSA) → `POST /api/sync-sms` → dedup via `processed_sms` → queue → AI parse → expense row (raw SMS stored GCM-encrypted).
- **Manual entry:** `POST /api/add-manual` → direct `expenses` insert.
- **Budgets:** per-category limit + period, spending computed from expenses; UI warns at 80% and 100%.
- **Reminders:** due-date tracking with local + recurring `NotificationService` checks.
- **Offline:** `SyncService` queues `manual_expense` / `sms_sync` jobs offline and replays on reconnect.

---

## 2. Repository Layout

```
E:\EXP-JUNGLANS\
├── APP/                          # Python Flask backend
│   ├── app.py                     # Flask API (1226 lines)
│   ├── enc.py                     # Encryption engine (1057 lines)
│   ├── schemas.py                 # Marshmallow request schemas
│   ├── models.py                  # SQLAlchemy models (PostgreSQL-ready)
│   ├── celery_worker.py           # Celery SMS task worker
│   ├── celery_config.py           # Celery broker config (Redis)
│   ├── backup_db.py               # Rotating DB backup script (keeps 30)
│   ├── dummy.py                   # Alternative/legacy API server
│   ├── extract_key.py             # Print RSA public key for frontend
│   ├── fix_db.py                  # Purge rows whose SMS fail key decrypt
│   ├── read.py                    # DB inspection (users + expenses)
│   ├── test_encryption_flow.py    # end-to-end encrypt→decrypt check
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .gitignore                 # ignores keys/, *.db, logs/
│   ├── keys/private_key.pem       # RSA-2048 (generated, gitignored)
│   ├── logs/audit.log             # rotating audit log
│   ├── tests/
│   │   ├── conftest.py            # env + per-test clean DB + fixtures
│   │   └── test_api.py            # 14 API tests
│   └── expenses.db                # SQLite (generated)
│
├── JunglansExpense/               # React Native 0.82 mobile client
│   ├── App.js                      # Root: providers, PIN, splash, onboarding
│   ├── index.js                    # Headless background-fetch task
│   ├── package.json
│   ├── app.json                    # atom of config; name/displayName/slug/scheme
│   ├── babel.config.js · metro.config.js · jest.config.js · jest.setup.js
│   ├── .eslintrc.js · .prettierrc.js · tsconfig.json · Gemfile
│   ├── patches/react-native-disable-battery-optimizations-android+1.0.7.patch
│   ├── __tests__/                  # jest suites + snapshot
│   ├── android/ · ios/             # native projects
│   └── src/
│       ├── api/client.js
│       ├── components/  (11)
│       ├── context/     · ThemeContext · AuthContext · NetworkContext
│       ├── hooks/       · useNetworkStatus · useDebounce
│       ├── navigation/  · AppNavigator · ModernTabBar
│       ├── screens/     (13)
│       ├── services/    · SyncService
│       ├── theme/theme.js
│       └── utils/       · BackgroundWorker · BatteryOpt · BiometricAuth
│                          · Encryption · KeepAliveService
│                          · NotificationService · SmsReader · formatters
│
├── .github/workflows/ci.yml      # lint → test → docker build → deploy
├── .pre-commit-config.yaml       # whitespace, YAML, secrets, black, flake8
├── docker-compose.yml            # api + ollama (Healthcheck-gated)
└── README.md · SECURITY_AUDIT.md · task.md
```

---

## 3. Backend Deep Dive (`APP/`)

### 3.1 `app.py` — Flask API

The server is fully env-driven. On startup it:

1. Boots **Sentry** if `SENTRY_DSN` is set; else logs a warning.
2. Enables **Swagger/OpenAPI** at `/docs/` only in dev (`FLASK_ENV=testing` or `FLASK_DEBUG=true`). Production sees the UI explicitly disabled.
3. Configures a **rotating audit logger** (`logs/audit.log`, 5 × 5 MB).
4. Reads `JWT_SECRET_KEY` — **fails hard** (`sys.exit(1)`) if absent outside tests. No more hardcoded fallback.
5. Applies **CORS** — `ALLOWED_ORIGIN` env; a wildcard `*` is only allowed with `supports_credentials=False`, and an explicit origin enables credentials.
6. Sets JWT expiry to **14 days**, body limit **16 MB**, and **bcrypt cost 13**.
7. Installs security headers on every response (`nosniff`, `DENY` frames, HSTS preload, CSP `default-src 'self'`, `Cache-Control: no-store`, strips `Server`).
8. Optionally redirects HTTP→HTTPS in production, configurable via `SSL_CERT`/`SSL_KEY` or `SSL_CONTEXT=adhoc`.

**Security subsystems:**

- **DB-backed token blacklist** (`token_blacklist`, `login_attempts` tables). `POST /api/logout` revokes the JWT's `jti`; `@jwt.token_in_blocklist_loader` rejects blacklisted tokens even after a restart.
- **Login lockout** — `login_attempts` tracks failures per username; after `MAX_LOGIN_ATTEMPTS = 5` within 15 minutes it returns a generic `Invalid credentials`.
- **Rate limiting** — Flask-Limiter, global `200/day · 50/hour`, with per-route ceilings (register `10/hour`, login `20/hour`, etc.), disabled under `TESTING`.
- **Schema-versioned DB migrations** — `_schema_version` table, currently at version 1; future schema changes append versioned steps.
- **Input validation everywhere** — every write route validates via Marshmallow `schemas.py`; register/login reject weak passwords.

**AI SMS parser** — see [§6](#6-sms-parsing--ai-pipeline). Highlights: 15s timeout via `ThreadPoolExecutor`, 512-entry LRU cache, JSON-mode Ollama with regex fallback.

**Background queue worker** — a daemon thread polls `pending_sms` every 2 s, marks each task `processing → (saved | retried) → deleted`, dedupes via `processed_sms` and the `expenses` UNIQUE constraint, survives DB reconnect blips, and is skipped in test mode. A Celery drop-in replacement also ships (see 3.5).

**Endpoints (all under `/api`):**

| Verb + Path | Auth | Limit | Notes |
|---|---|---|---|
| `GET  /health` | — | 30/min | DB + Ollama probe + schema version |
| `POST /register` | — | 10/hr | validation, 201/400 |
| `POST /login` | — | 20/hr | blind 401, lockout |
| `POST /logout` | JWT | 30/hr | blacklists jti |
| `POST /change-password` | JWT | 10/hr | strength-validated |
| `DELETE /delete-account` | JWT | 5/hr | cascades user DATA |
| `POST /sync-sms` | JWT | 30/hr | encrypted payload or `sms_list` (≤200/message) |
| `GET  /expenses` | JWT | 60/hr | decrypts `raw_sms` on read |
| `GET  /dashboard` | JWT | 60/hr | range `all\|week\|month\|year` |
| `POST /add-manual` | JWT | 30/hr | direct insert |
| `GET  /budgets` | JWT | 60/hr | list |
| `POST /budgets` | JWT | 30/hr | upsert (INSERT OR REPLACE) |
| `DELETE /budgets/<id>` | JWT | 30/hr | — |
| `GET  /budget-status` | JWT | 60/hr | % spent vs limit, periods |
| `GET  /reminders` | JWT | 60/hr | ascending due date |
| `POST /reminders` | JWT | 30/hr | recurring support |
| `DELETE /reminders/<id>` | JWT | 30/hr | — |
| `POST /reminders/<id>/paid` | JWT | 30/hr | flip flag |
| `GET  /export` | JWT | 30/hr | `json` or `csv`, range filtering, injection-escaped CSV |
| `GET  /insights` | JWT | 30/hr | Ollama-generated spending insight w/ fallback |
| `GET  /monthly-comparison` | JWT | 60/hr | MoM change |

### 3.2 `enc.py` — Encryption Engine

The purpose-built engine (`SecureFileSystem`), three layers:

1. **AES-256-GCM** for bulk payloads — fresh 32-byte key + 12-byte nonce per operation, authenticated (tamper-evident).
2. **RSA-2048** for key transport — the symmetric key is RSA-encrypted (OAEP on the server side; CBC+PKCS1v15 path kept for the React-Native CryptoJS/JSEncrypt client, see §9 caveats).
3. **Neural hardening** — `TransformerHardener`: input‑projection → 768-dim positional encoder → **12 transformer encoder layers** (GELU, 12 heads) → Tanh output. `TransformerValidator` checks outputs stay on the `[-1,1]` manifold and scores roughness. Only used for the optional full **file** path (GPU/FP16-accelerated, 4 KB chunking, batch 256).

Helpers: `MetricsCollector` audits entropy, diffusion, avalanche effect, and attack resistance (brute-force, pattern, timing, known-plaintext) to `encryption_log.txt` + JSON. **Nonces are persisted and collision-checked** (`_used_nonces`) across process restarts.

| Method | Purpose |
|---|---|
| `encrypt_string` / `decrypt_string` | AES-GCM string bundle used for `raw_sms` storage |
| `encrypt_file` / `decrypt_file` | SHA-256-wrapped, neural-hardened file packages |
| `rsa_encrypt_bytes` / `rsa_decrypt_bytes` | key exchange primitives |
| `generate_keys` / `save_keys` / `load_keys` | key lifecycle; PEM or `PRIVATE_KEY_PEM` env |
| `get_public_key_pem` | printed at boot to wire the frontend |
| `interactive_menu` (`__main__`) | CLI encrypt/decrypt demo |

### 3.3 `schemas.py` — Request Validation

All user input is Marshmallow-validated before reaching routes:

- `RegisterSchema` — username 3–64 chars; **password ≥8 with upper+lower+digit**.
- `LoginSchema` — plain presence.
- `SmsItemSchema` / `SyncSmsSchema` — per-item body 1–5000 chars, list payload, or encrypted `payload` string.
- `ManualExpenseSchema` — merchant ≤200, amount ≥ 0.01, `type ∈ income|expense`.
- `BudgetSchema` — limit ≥ 1, period `weekly|monthly|yearly`.
- `ReminderSchema` — title ≤ 200, amount ≥ 0, due-date + recurrence.

### 3.4 `models.py` — SQLAlchemy / PostgreSQL

ORM layer with pool (`pool_size=5, max_overflow=10`, `pool_pre_ping`). Set `DATABASE_URL=postgresql://…` and `app.py` switches the storage dialect while keeping the raw `sqlite3` route layer (the SQL written is portable). Point: turn on PostgreSQL for multiple replicas; `docker-compose` gives a live reference.

### 3.5 Celery Worker

`celery_worker.py` + `celery_config.py` provide a production-grade queue: Redis broker, JSON serialization, `acks_late`, `worker_prefetch_multiplier=1`, auto-retry ×3 / default delay 60s, and the same AI extraction core reused from `app.py`. Run with:

```bash
celery -A celery_worker worker --loglevel=info
```

### 3.6 `backup_db.py`

Timestamps `expenses.db` copies into `backups/` and prunes to the **last 30**. Cron the recommended:

```bash
0 3 * * * cd /app && python backup_db.py
```

### 3.7 Utilities

- `extract_key.py` — dump RSA public key PEM (for `Encryption.js`).
- `fix_db.py` — iterate expenses; delete rows whose `raw_sms` can't decrypt with the current key (key-rotation repair).
- `read.py` — pretty-print users/expenses from the DB.
- `test_encryption_flow.py` — symmetric round-trip test of the CBC client-compat path.
- `dummy.py` — legacy/alternate server (few-shot AI prompt, payment-method tracking, 7-day trend).

### 3.8 Docker // APP

`Dockerfile` — `python:3.11-slim`, `gcc` build tooling, optional requirements, code copied in, `VOLUME /data`, default env (`DATABASE_PATH=/data/expenses.db`, `KEY_DIR=/data/keys`, `FLASK_DEBUG=false`), runs `python app.py:5000`.

---

## 4. Frontend Deep Dive (`JunglansExpense/`)

### 4.1 Entry Points

- **`index.js`** — imports `react-native-get-random-values` (crypto), registers the **headless task** feeding `react-native-background-fetch`: when the app is killed, the OS wakes it, `runBackgroundSync()` runs, and the task finishes.
- **`App.js`** — provider tree `ErrorBoundary → ThemeProvider → AuthProvider → NetworkProvider → ToastProvider`, then gate sequence: **SplashScreen → OnboardingScreen** (first run, stored in AsyncStorage) → **PIN lock** (foreground-switch re-checks) → `Navigator + NetworkBanner`. Monitors `AppState` to re-lock and re-check due reminders; starts the foreground service on mount.

### 4.2 Dependencies

React 19.1.1 · react-native 0.82.1 (Hermes, New Architecture). Notable: `@react-navigation/*` v7, `@react-native-async-storage/async-storage`, `axios`, `crypto-js` + `jsencrypt`, `react-native-background-actions` / `-fetch`, `react-native-get-sms-android`, `react-native-biometrics`, `react-native-chart-kit`, `react-native-vector-icons`, `react-native-linear-gradient`, `@react-native-community/blur`, `netinfo`, `react-native-svg`, `react-native-date-picker`, `gesture-handler`.

### 4.3 API Client (`src/api/client.js`)

Single axios instance:
- Base URL from AsyncStorage (`apiBaseUrl`), falling back to `__DEV__ ? 'http://10.0.2.2:5000' : 'https:/…'`; exports `getBaseURL()` / setter for the Settings.
- Request interceptor injects the JWT `Bearer` from AsyncStorage **and** serves a 5s warm GET-cache (ported across renders/refreshes).
- Response interceptor re-serves stale cache on network/error and flags `__fromCache` / `__stale`.
- Exports `clearCache()` and `invalidateCache(pattern)` for invalidation on mutations.

### 4.4 Context Providers

- **AuthContext** — `login` / `logout`; token persisted in AsyncStorage; 401 auto-logout listener.
- **NetworkContext** — NetInfo monitor; exposes `isConnected`; triggers sync on reconnect.
- **ThemeContext** — dark/light themes (30+ props each) persisted to AsyncStorage; `toggleTheme`, `setDarkMode`.

### 4.5 Navigation

- **AppNavigator** — auth stack (`Login`, `Register`), main bottom tabs (Home, History, Add, Stats, Profile) with center floating add button, and detail screens (TransactionDetails, Profile, Budgets, Reminders). Custom SVG gradient icons.
- **ModernTabBar** — animated spring indicator, glow dot, gradient background (avoids BlurView to prevent native null-crashs), center button elevated.

### 4.6 Screens

| Screen | Highlights |
|---|---|
| `HomeScreen` | Hero balance card (gradient, sync, trend), budget banner >80%, mini spending-velocity line chart, glass stat cards, pulsing AI-insight card, quick actions, recent 5, pull-to-refresh, 10 s auto-sync, manual SMS sync |
| `HistoryScreen` | search, Income/Expense chips, SectionList grouped by Today/Yesterday/date, empty state, details nav |
| `AddExpenseScreen` | expense/income toggle, merchant/amount/category inputs, submit |
| `AnalyticsScreen` | Week/Month/Year ranges, category chips, dual-line cash-flow chart, category progress, pie chart, budget usage |
| `BudgetScreen` | progress bars, color-coded status, add/delete modals, period selector |
| `RemindersScreen` | status indicators, mark-paid, delete, add modal w/ recurrence |
| `ProfileScreen` | avatar+badge, currency picker (INR/USD/EUR/GBP/JPY/CAD/AUD persisted), theme toggle, nav to budgets/reminders, logout, version |
| `TransactionDetailsScreen` | animated header, detail rows, decrypted raw SMS in a terminal-style window, native share-sheet export |
| `LoginScreen` / `RegisterScreen` | animated hero, inputs w/ icons, gradient CTA |
| `PinLockScreen` | 4-digit PIN create/confirm/enter, shake on error, **biometric auto-prompt** |
| `SyncSmsScreen` | manual upload UI, last-sync time, status |
| `OnboardingScreen` | 3-step first-run (Security, AI, Insights) |

### 4.7 Reusable Components

`BubbleBackground` (animated gradient bubbles), `ScreenWrapper` (LinearGradient shell), `TransactionCard`, `UIComponents` (GlassCard/ErrorCard/ComingSoonCard/EmptyState/Skeleton + `handleApiError`), `OfflineBanner`, `NetworkBanner` (animated top banner from `useNetworkStatus`), `SplashScreen`, `Toast` (provider + `useToast`), `ErrorBoundary`, `SwipeableRow` (gesture delete), `DashboardSkeleton`.

### 4.8 Custom Hooks

- `useNetworkStatus()` — NetInfo subscription exposing a boolean, cached.
- `useDebounce(value, ms)` — debounced value box (used by History search).

### 4.9 Utilities & Services

- **SmsReader** — Android SMS permission request, read last N SMS, filter by `isBankSender` against **40+ Indian bank/payment patterns** (HDFC, ICICI, Axis, SBI, UPI apps, TRAI format, etc.) and 30+ transaction keywords; tracks `lastSyncTime` in AsyncStorage.
- **BackgroundWorker** — reads unprocessed SMS, filters transactions, `EncryptionService`-encrypts the payload, POSTs them, updates the timestamp; shared by foreground service and headless task.
- **KeepAliveService** — `react-native-background-actions` foreground notification ("Syncing transactions…"), runs sync every 60 s.
- **NotificationService** — local due-reminder alerts + budget warnings at 80%/100%, dedupe-guarded.
- **BatteryOpt** — battery-optimization dialog → opens Android battery settings.
- **BiometricAuth** — sensor detection, `simplePrompt` authentication, key enrollment (guarded for missing native module).
- **Encryption** — client-side AES-CBC + RSA-OAEP package: `base64{ ct, iv, tag, ek, mode:'CBC' }`.
- **formatters** — `CATEGORY_ICONS` (30 emojis), date grouping, currency (locale-aware for 7 symbols), relative time, stored-currency helpers.

### 4.10 Theme System (`src/theme/theme.js`)

Global `COLORS` (primary/neon palette), `GRADIENTS` (primary, cards, buttons, danger), `FONTS`, `SPACING`/`RADIUS`. Glassmorphism language: translucent surfaces, blur, neon glow shadows, rounded 8–32px, spacing 4–48.

---

## 5. Database Schema

| Table | Columns | Uniqueness |
|---|---|---|
| `users` | id, username, password | username UNIQUE |
| `expenses` | id, user_id, merchant, amount, currency, category, payment_method, type, date, raw_sms (encrypted), timestamp | (user_id, raw_sms) |
| `processed_sms` | user_id, sms_hash | (user_id, sms_hash) |
| `pending_sms` | id, user_id, raw_sms, date, status | — |
| `budgets` | id, user_id, category, limit_amount, period, created_at | (user_id, category, period) |
| `reminders` | id, user_id, title, amount, due_date, recurring, frequency, is_paid, created_at | — |
| `token_blacklist` | jti (PK), expires_at | — |
| `login_attempts` | username, attempted_at | (username, attempted_at) |
| `_schema_version` | version | — |

---

## 6. SMS Parsing & AI Pipeline

1. Device reads SMS → `SmsReader` filters (bank sender + txn keywords).
2. Client encrypts → `POST /sync-sms` (or raw list fallback).
3. Server SHA-256-hashes each body for dedup (history or already-queued are skipped), enqueues ≤ 200.
4. Daemon worker (or Celery) pops one, invokes `extract_data_with_ai()`:
   - Builds the anti-injection prompt: body quotes escaped→`, clipped to 500 chars, strict JSON rules + schema example.
   - Calls `ollama.chat(model=phi3, format='json')`, timeout 15 s, cached by hash (LRU 512).
   - Falls back to regex (`_regex_fallback`) if unmountable: `₹/Rs/INR` amount, `paid to/at/via` merchant, `credited/salary` → income.
5. Valid record inserted into `expenses`; SMS body stored via `encrypt_string()`. Duplicates silently skipped by IntegrityError.
6. Insights endpoint separately prompts phi3 with the 30-day budget; falling back to deterministic savings text.

---

## 7. Background Services

```
App foreground ──► KeepAliveService (foregroundService) ── every 60 s
                        ├─ BackgroundWorker.runBackgroundSync()
                        └─ persistent notification "Syncing transactions…"
                  Home auto-sync loop (every 10 s while visible)
                  Manual trigger from Home / SyncSmsScreen

App killed   ──► Headless Task (BackgroundFetch) ─► runBackgroundSync()
Offline      ──► SyncService queue (manual_expense | sms_sync) ──► flush on reconnect
```

---

## 8. API Reference

All `/api/*` (except `/health`, `/register`, `/login`) require `Authorization: Bearer <JWT>`. Full interactive OpenAPI at `/docs/` when `FLASK_ENV=testing` (or debug). Example bundles:

- **login** → `{ token }` (200) / `{ msg:"Invalid credentials" }` (401).
- **/sync-sms** → `sms_list` or `payload`, returns `{status:"queued", queued:N}`.
- **/dashboard?range=week** → `{ income, expense, balance, categories, trend:[{date, income, expense}] }`.
- **/budget-status** → `[{id, category, limit, spent, remaining, percentage, period, over_budget}]`.
- **/export?format=json|csv&range=week|month|year` → data rows or CSV (cells formula-escaped `=,-,@,+`).

---

## 9. Security Posture

Hardened against the `SECURITY_AUDIT.md` findings (P0–P2 in `task.md`):

- **No hardcoded secrets** — `JWT_SECRET_KEY` required at boot; RSA keys optional via `PRIVATE_KEY_PEM`; key files gitignored.
- **Encryption at rest / transit** — HMAC-wrapped GCM for SMS; HSTS + HTTPS redirect; disabled debug; 16MB body cap.
- **Identity** — bcrypt 12 → 13, account lockout, DB-backed JWT blacklist, 14-day expiry (shortened from 90), logout revokes `jti`.
- **Validation** — Marshmallow schemas on every write route; 14 API tests.
- **Observability** — rotating audit log, Sentry, `/health`.

**Remaining (documented in SECURITY_AUDIT.md):**
- CBC + PKCS1v15 fallback in `enc.py` is an intentional client-compat path (RSA 2048/OAEP preferred); gating-room to remove entirely for public keys-only devices.
- Password policy is length+case+digit (no symbol requirement); JWT expiry could shrink further with refresh-token rotation.
- SMS permission is Android-wide; keep `READ_SMS` scoped, since all apps receive the same device-level SMS access.
- `PIN` is stored in AsyncStorage (hash-on-device is the next step).

---

## 10. Testing

**Backend** — pytest suite (`APP/tests/`):
```bash
cd APP
FLASK_ENV=testing python -m pytest tests/ -v
```
`conftest.py` spins an isolated temp DB per session, disables rate limiting under `TESTING`, and both `client` and `auth_client` fixtures cover the 14 route tests.

**Frontend** — Jest (RN preset):
```bash
cd JunglansExpense && npm test
```
Suites: `App.test.tsx` (render), `HomeScreen.test.js` (loading + snapshot), `BackgroundWorker.test.js` (mock SmsAndroid, upload happy/empty paths), `SmsReader.test.js` (bank/transaction filters + sync timestamp). `jest.setup.js` mocks AsyncStorage, NetInfo, SafeArea, jsencrypt, vector-icons, KeepAlive, Notifications, navigation.

---

## 11. CI/CD & Developer Tooling

- **GitHub Actions** (`.github/workflows/ci.yml`) — Python 3.11 `py_compile` + flake8 (soft), pytest, ESLint, `docker build ./APP`, and an SSH deploy (`appleboy/ssh-action`) pulling the image with `docker compose up -d --no-deps api` on main-only push.
- **pre-commit** (`.pre-commit-config.yaml`) — trailing whitespace, EOF-fixer, YAML, large-file, secret-detection + black (line-length 160) + flake8 scoped to `APP/`.

---

## 12. Docker & Deployment

```bash
# build & run both services (api + ollama) with healthchecked dependency
docker compose up --build -d
```

`docker-compose.yml` services: **api** (built locally, ports 5000, `app_data` volume, `depends_on ollama: service_healthy`) and **ollama** (image, port 11434, its own volume, `ollama list` healthcheck). Adjust `JWT_SECRET_KEY` / `ALLOWED_ORIGIN` (see §15). A production nginx reverse-proxy in front should terminate TLS.

---

## 13. Environment Variables

| Var | Default | Purpose |
|---|---|---|
| `JWT_SECRET_KEY` | *(none — required)* | JWT signing **fails startup if missing** |
| `ALLOWED_ORIGIN` | *(none — required)* | CORS origin for the frontend |
| `DATABASE_PATH` | `expenses.db` | SQLite file path |
| `DATABASE_URL` | `sqlite:///expenses.db` | SQLAlchemy/PostgreSQL URL (`postgresql+psycopg2://…`) |
| `KEY_DIR` / `KEY_FILE` | `keys` / `private_key.pem` | RSA private key location |
| `PRIVATE_KEY_PEM` | — | base64 PEM override (no disk key) |
| `JWT_ACCESS_TOKEN_EXPIRES` | 14 days | inside config (JWT lib constant) |
| `SSL_CERT` / `SSL_KEY` | — | TLS cert+key pair to enable HTTPS |
| `SSL_CONTEXT` | — | `adhoc` for local TLS |
| `FLASK_DEBUG` | `false` | debug mode |
| `FLASK_ENV` | — | `testing` for env-secure boot + Swagger |
| `PORT` | `5000` | server port |
| `OLLAMA_MODEL` | `phi3` | model name |
| `OLLAMA_TIMEOUT` | `15` | per-LLM-call seconds |
| `OLLAMA base URL` | n/a | docker-compose passes to `ollama` service; note the Python client honors `OLLAMA_HOST` |
| `CELERY_BROKER_URL` / `CELERY_RESULT` | `redis://localhost:6379/0` | Celery broker/backend |
| `SENTRY_DSN` | — | error monitoring |
| `BACKUP_DIR` | `backups` | backup database dir |
| `Docker floor` | — | `DATABASE_PATH=/data/expenses.db`, `KEY_DIR=/data/keys`, `FLASK_DEBUG=false` |

---

## 14. Setup & Installation

**Backend**
```bash
cd APP
pip install -r requirements.txt
# PyTorch optional (skip for CPU-only? torch is in requirements)
# Ensure Ollama + model:
#   ollama pull phi3
# Configure env, then:
export JWT_SECRET_KEY="$(openssl rand -hex 32)"
export ALLOWED_ORIGIN="http://localhost:8081"
python app.py          # prints the RSA public key on first boot
```
(The server generates `keys/private_key.pem`, creates the DB, and prints the public key to embed into `src/utils/Encryption.js`.)

**Frontend**
```bash
cd JunglansExpense
npm install
# iOS only: cd ios && bundle install && bundle exec pod install
# Set backend URL (runtime-rigged): AsyncStorage key 'apiBaseUrl'
npm run android   # or npm run ios
npm test          # jest
```

**End-to-end wiring:** backend public key → `Encryption.js`; `apiBaseUrl` → AsyncStorage; Ollama up with `phi3`. For Android emulators `10.0.2.2:5000` reaches the host.

---

## 15. Known Issues & Roadmap

- **`SECURITY_AUDIT.md`** (dated 2026-07-16) is the authoritative list; its P0/P1 are implemented, P2 partially (notes in §9).
- **CBC/PKCS1v15 compatibility path** in `enc.py` — architecture debt, flag as legacy.
- **Test coverage** is backend-first; frontend tests mock native modules heavily—an end-to-end (device) test is the next step.
- **SQLite** default → PostgreSQL switch documented (models ready, `DATABASE_URL=postgresql://…`, `psycopg2-binary`).
- **QR/`OLLAMA_URL`**: the Python client defaults to `localhost:11434`; container deployments must point the model host accordingly.

---

*Generated deep-dive README — reflects the post-hardening state per `task.md` and `SECURITY_AUDIT.md`.*