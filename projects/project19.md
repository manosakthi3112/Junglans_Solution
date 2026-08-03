# 🌿 Junglans — Telegram Stranger Chat Bot

An anonymous, encrypted stranger-chat bot for Telegram. Users are matched with random strangers worldwide, chat via text/photo/voice/stickers, unlock premium tiers, earn badges and karma, and stay safe through moderation, reporting, blocking, and an SOS panic button.

> The "Junglans" experience: instant matches, flirty personalities, gamified engagement, and premium monetization — bootstrapped to run on a free-tier host (Render webhook mode + auto keep-alive pinger).

---

## Table of Contents

- [1. High-Level Architecture](#1-high-level-feature-architecture)
- [2. Project Structure](#2-project-structure)
- [3. Core Features](#3-core-features)
- [4. Deep Dive: Modules](#4-deep-dive-modules)
- [5. Database Schema](#5-database-schema)
- [6. Encryption Pipeline](#6-encryption-pipeline)
- [7. Matching & Session Lifecycle](#7-matching--session-lifecycle)
- [8. The Fake Bot Chatter System](#8-the-fake-bot-chatter-system)
- [9. Moderation & Safety](#9-moderation--safety)
- [10. Monetization & Payments](#10-monetization--payments)
- [11. Deployment](#11-deployment)
- [12. Command Reference](#12-command-reference)
- [13. Configuration](#13-configuration)

---

## 1. High-Level Feature Architecture

```
                 ┌────────────────────────────────────────────┐
                 │                 Telegram Cloud             │
                 │     Updates: texts, photos, calls, polls   │
                 └─────────────────────┬──────────────────────┘
                                       │ webhooks (Render) / polling (local)
┌──────────────────────────────────────▼───────────────────────────────────┐
│                               bot.py (main)                              │
│  • get_or_create_user / sessions / matching                             │
│  • callback router for every inline button                              │
│  • scheduled jobs: morning/night engagement, fake chatters              │
└───────┬──────────────┬──────────────────┬──────────────┬────────────────┘
        │              │                  │              │
┌───────▼──────┐ ┌─────▼───────┐ ┌────────▼───────┐ ┌───▼──────────────────┐
│ registration │ │  moderation │ │  fake_chat.py  │ │  encryption_service   │
│  step-by-step│ │ profanity   │ │  FakeChatManager│ │  AES-GCM + RSA-AES +   │
│  profile +   │ │ rate limiting│ │  state machine │ │  optional Transformer │
│  photos       │ │ report reasons│ │  profiles      │ │                      │
└───────┬──────┘ └─────┬───────┘ └───────┬────────┘ └───┬──────────────────┘
        │              │                 │              │
        └──────────────▼─────────────────▼──────────────▼─────────────────┐
                                 models.py (SQLAlchemy)                    │
              PostgreSQL (Render) or SQLite (local) · pool_pre_ping       │
┌───────────────────────────────────────────────────────────────────────────┐
│                    keep_alive.py (Flask + auto-pinger)                    │
│                    admin.py (CLI admin / DB tool)                   │
└───────────────────────────────────────────────────────────────────────────┘
```

**Module responsibilities**

| File | Role |
|------|------|
| `bot.py` (~4.7k lines) | The whole app: matching, messaging, commands, callbacks, jobs, admin tools, webhook/polling bootstrap |
| `models.py` | SQLAlchemy ORM schema — 15+ tables |
| `encryption_service.py` | Chat encryption layer (AES-256-GCM + RSA-2048 + optional transformer hardening) |
| `registration.py` | Multi-step onboarding conversation (`ConversationHandler`, 11 states) |
| `moderation.py` | Profanity filter, contact-info scrub, rate limiter, report reason keyboard |
| `fake_chat.py` | Simulated "human" bot partners for an always-alive app |
| `icebreakers.py` | Conversation starter question bank |
| `admin.py` | Interactive CLI database admin (list users, set subs) |
| `keep_alive.py` | Flask health server + 30 second self-pinger (Render-friendly) |

---

## 2. Project Structure

```
stranger chat/
├── bot.py                    # Main entrypoint & the entire feature set
├── models.py                 # SQLAlchemy ORM models
├── config.py                 # Env config, plan tiers, referral constants
├── encryption_service.py     # AES + RSA + transformer hardening
├── registration.py           # Profile onboarding conversation
├── moderation.py             # Profanity / spam / rate limiting
├── fake_chat.py              # Fake persona engine
├── icebreakers.py            # Icebreaker question bank
├── keep_alive.py             # Flask + auto-pinger
├── admin.py                  # CLI admin tool
├── requirements.txt          # Lightweight deps (no torch)   ← for Render free tier
├── requirements-render.txt   # Identical light profile (kept as a convenience copy)
├── chat_master.key           # Static RSA private key file (git-ignored)
├── dummy/ scratch/           # Unused/scratch (git-ignored via .gitignore)
└── README.md
```

---

## 3. Core Features

### Matching & Chat
- `text` `/find` → search for a partner ->`WaitingQueue` matching engine
- `text` `/next` → skip with daily limits (5/day free, unlimited premium)
- `text` `/stop` → leave out gracefully
- Real-time routing of text, photos, voices, stickers between two matched users
- `/icebreaker` one-tap opener; `/reveal` identity-reveal feature

### Profiles & Registration
- Multi-step onboarding: name, DOB, email, gender, interests, socials, main photo + up to 5 shared
- `/editprofile`, `/viewprofile`, `/setpreference` (age range, country, language, preferred gender), `/invisible` stealth mode
- `/verifyage` for 18+ gating

### Premium & Monetization
- 3 tiers: **Free / Premium (₹50/mo) / Pro (₹150/mo)**
- Pro unlocks video calls; invisible mode; priority matching
- `python-telegram-bot` built-in payments — `PreCheckoutQueryHandler` + `SUCCESSFUL_PAYMENT` handler
- Admin overrides: `/approve`, `/setsub`, `/resetimages`

### Calls
- `/call` (audio) and `/videocall` — requests tracked through `CallRequest`

### Safety & Trust
- `/report` with reason picker, `/block`, `/sos` panic button
- Moderation: profanity list (EN+HIN+leetspeak), contact-info scrub, URL/phone detection, rate limiting
- Verification / warning-point system, ban/unban admin tooling

### Gamification
- Karma (rating-based), chat streaks, badges/achievements, weekly leaderboard, chat stats, refer-to-earn (10 referrals = 1 mo Premium)

### Engagement Automation
- Scheduled 9 AM/9 PM IST engagement blasts (`job_queue.run_daily`)
- Fake bot chatters for queued users (see section 7)

---

## 4. Deep Dive: Modules

### `config.py`
Single source of truth pulled from `.env` (`BOT_TOKEN`, `DATABASE_URL`, `RENDER_EXTERNAL_URL`, `LOW_MEMORY_MODE`). Hard-codes `SUPER_ADMIN_IDS`, subscription tier matrix, encryption toggle, `LOW_MEMORY_MODE` auto-enabling on Render, and referral constants.

### `registration.py`
A `ConversationHandler` with 11 states (`NAME, DOB, EMAIL, GENDER, INTERESTS, INSTAGRAM, SNAPCHAT, TWITTER, PHONE, MAIN_PHOTO, ADDITIONAL_PHOTOS`). Deep-link `start?ref_XXXXAIFF` parsing wires referral attribution. Writes `User` + `Referral` rows and stores Telegram photo `file_id`s into `UserPhoto`.

### `moderation.py`
- `contains_profanity()` → normalized word-set scan (leetspeak variants included) → tuple `(bool, matched_word)`
- `CONTACT_PATTERNS` regex to redact phone/telegram/WA/URLs
- `rate_limiter` — token-bucket-ish per-user throttle
- `REPORT_REASONS` + `get_report_reason_keyboard()` inline menu

### `keep_alive.py`
- `flask` web server (health endpoints `/`, `/health`)
- `auto_ping()` loop pings `RENDER_EXTERNAL_URL/health` every 60s to prevent free tier sleep
- `start_auto_pinger()` non-blocking daemon thread

### `admin.py`
- CLI tool for listing users / granting premium for testing (`python admin.py`)

---

## 5. Database Schema

All models in `models.py` inherit SQLAlchemy `Base`; between PostgreSQL (Production) and local SQLite fallbacks.

| Table | Purpose | Notable columns |
|-------|---------|-----------------|
| `users` | Everything about a human | subscription_tier/expires, skip counters, image quota, profile data, preferences, trust flags (warnings, verified, banned), online/invisible, gamification (karma, streak, badges, chats), referral codes |
| `chat_sessions` | Active/past matched pairs | user1_id, user2_id, is_active, message_count |
| `waiting_queue` | Users looking for a match | user_id (unique), joined_queue_at |
| `fake_chat_sessions` | Persistent fake-bot states | bot profile fields, stage, used_messages |
| `call_requests` | Audio/video call between matched | type, status |
| `user_photos` | Profile gallery | file_id, is_main, order |
| `reports` | Abuse logs | reason, status |
| `blocked_users` | Block relationships | pair |
| `chat_ratings` | Post-chat ratings | rating 1-5, feedback |
| `achievements` | Badge awards | badge_name |
| `bot_stats` | Daily aggregates | counts, premium_users |
| `admin` | Admin list | — |
| `referrals` | Referral records | referred_by, flag |
| `messages` | Stored chat history | (in `models.py`) |

Engine tuned for cheap hosting: `pool_pre_ping=True`, `pool_recycle=1800`.

Config qualifies `postgres://` → `postgresql://` automatically.

---

## 6. Encryption Pipeline

`encryption_service.py` layers crypto:

- **Symmetric** — AES-256-GCM for message payload encryption at rest and in transit.
- **Asymmetric** — RSA-2048 keypairs (OAEP padding) for key exchange between matched peers; master RSA key persisted to `chat_master.key`.
- **Transformer hardening** — *optional*, enabled only when `LOW_MEMORY_MODE` is false:
  - imports PyTorch + `enc` components (`TransformerHardener`, `TransformerValidator`)
  - if those are unavailable, falls back to a **built-in 12-layer transformer** that reshapes key material through GELU, while a `TransformerValidator` penalizes out-of-bound deviation and adjacent-sample roughness to guarantee a bounded, "hardened" output.
- `LOW_MEMORY_MODE` (or Render auto-detect) drops torch/numpy entirely → pure AES+RSA fallback; `requirements-render.txt` never includes PyTorch, keeping the free tier under RAM budgets.

---

## 7. Matching & Session Lifecycle

```
User taps /find
      │
      ▼
profile complete? ── no ──▶ registration flow
      │ yes
      ▼
find_command()
      │
      ├── existing active session?  ──►  resume (no duplicate)
      ├── in waiting queue (unique) ──►  "already searching"
      └── add to waiting_queue
              │
              ▼  (job every 30s: fake_chatter_job)
   attempt real match: pick a queue partner honoring preferences
      ├── match found ─────────────► ChatSession(user1, user2) active
      └── none ──► wait ≥10s ──► FAKE BOT gets assigned
              │
              ▼
   messages flow through message_handler ─► partner relay
```

Lifecycle states tracked via `ChatSession.is_active`, `WaitingQueue` entry removal on match, `app.get_session()` / `remove_active_session()` helpers, and `daily_skips` enforcement from `User.can_skip()`.

---

## 8. The Fake Bot Chatter System

When fewer than 2 real users are queued, users get lonely — so Junglans answers with **simulated personality** from `fake_chat.py`:

- **Profile generator** — randomized name (Indian + international), gender picked from the user's `preferred_gender`, age, bio, personality tag, social handles
- **Staged conversation engine** — progression through `conversation_stage` with phases (greetings → get-to-know → flirty `adult` lines → deep). Message bank per stage; `get_bot_response()` picks stage-appropriate, never-repeating lines (`used_messages`)
- **Human-like feel** — simulates `ChatAction.TYPING` before replies, random reply `delay` (capped at 4s in batch job)
- **Unprompted proactive messages** — bot occasionally messages first if the user stays silent (`get_unprompted_targets`)
- **Persistent** — states in `FakeChatSession` rows survive restarts
- When a real user actually matches later, the fake chat is stopped and the user is handed off

This keeps the matchmaking "magic" alive on an empty/low-traffic free-tier host.

---

## 9. Moderation & Safety

Every inbound message routed via `moderate_message`:

1. **Profanity** — `contains_profanity()` catches EN/Hindi/leetspeak; flagged messages are rejected and the sender warned (warning_count tracked)
2. **PII / links** — `CONTACT_PATTERN` regex standalone fields (phones, @handles, URLs, `wa.me`, `t.me`) are scrubbed
3. **Rate limiting** — `rate_limiter` blocks spam bursts
4. **Report & block** — `/report` inline reason keyboard → `Report` row → admin action; `/block` → `BlockedUser` row, message relay blocked
5. **SOS** — `/sos` panic command
6. **Admin tooling** — `/ban`, `/unban`, `/whois`, `/users`, `/broadcast`, `/admin` panel, manage admins

---

## 10. Monetization & Payments

| Tier | Price | Features |
|------|-------|----------|
| Free | ₹0 | 5 skips/day, text, encryption |
| Premium | ₹50/mo | Unlimited skips, audio → laptops, visible socials, priority matching |
| Pro | ₹150/mo | Everything + **video calls**, invisible mode |

- Interception via Telegram **native payments** (`/subscribe` → inline invoice → `PreCheckoutQueryHandler` → `successful_payment_handler`
- Admin `/approve`, `/setsub` for manual/offline activation
- Referral: invite 10 → free 30 days → `referral_code` system with deep-link `ref_`

---

## 11. Deployment

### Local dev
```bash
pip install -r requirements.txt
# .env must have:
#   BOT_TOKEN=...
#   DATABASE_URL=sqlite:///stranger.db  (or leave blank → local sqlite fallback)
#   (no RENDER_EXTERNAL_URL / RENDER => polling mode)
python bot.py
```

### Render (free tier, webhooks)
1. Set env: `BOT_TOKEN`, `DATABASE_URL` (Postgres), `RENDER_EXTERNAL_URL` (e.g. `https://<app>.onrender.com`)
2. Set build command / startup: `python bot.py`
3. `render.yaml` equivalent — framework will set `PORT`
4. `requirements-render.txt` keeps the bundle torch-free → boots on free RAM
5. Keep-alive: the bot binds the webhook port; `start_auto_pinger` pings `/health` every 60s; Flask `/` returns "I'm alive"

### Modes
- `RENDER_EXTERNAL_URL` set → **webhook mode** (`listen 0.0.0.0`, `url_path=BOT_TOKEN`, webhook URL = `https://.../BOT_TOKEN`)
- else → **polling mode** + optional keep-alive Flask in a background thread.

---

## 12. Command Reference

**Everyone**

| Command | What it does |
|---|---|
| `/start` | Begin journey |
| `/find` | Match with stranger |
| `/next` | Skip (5/day free) |
| `/stop` | Leave current chat |
| `/profile` / `/viewprofile` | Show mine / stranger's |
| `/subscribe` | Unlock premium |
| `/status` | Your tier |
| `/referral` / `/myreferrals` | Invite to earn premium |
| `/call` / `/videocall` | Audio & video calls (Premium/Pro) |
| `/report` / `/block` / `/sos` | Safety tools |
| `/verifyage` | 18+ check |
| `/settings` / `/setpreference` / `/editprofile` / `/invisible` | Personalize |
| `/icebreaker` | Opener |
| `/chatstats` / `/achievements` / `/leaderboard` / `/rating` | Gamification |
| `/reveal` | Reveal identity |
| `/help` | All commands |

**Admin-only** (SUPER_ADMIN_IDS + admin model)
`/admin`, `/stats`, `/users`, `/whois`, `/broadcast`, `/approve`, `/setsub`, `/resetimages`, `/ban`, `/unban`, `/addadmin`, `/removeadmin`, `/listadmins`.

---

## 13. Configuration

| Key | Purpose |
|-----|---------|
| `BOT_TOKEN` | **Required** — Telegram bot token (`@BotFather`) |
| `DATABASE_URL` | Postgres URI (production) / SQLite locally |
| `RENDER_EXTERNAL_URL` | Public URL → webhook + auto-pinger |
| `RENDER` / `LOW_MEMORY_MODE` | `true` → disable transformer, pure AES/RSA |
| `PORT` | Webhook/listen port |

---