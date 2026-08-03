# JunglansChat - Secure Communication Platform

Real-time encrypted messaging platform with gRPC-Web streaming, E2EE, WebRTC calling, and AI-powered features.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Client (Next.js 16)                │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │   REST /    │  │  gRPC-Web    │  │ Socket.IO  │  │
│  │  HTTP API   │  │   Stream     │  │  WebSocket │  │
│  └──────┬──────┘  └──────┬───────┘  └─────┬──────┘  │
└─────────┼─────────────────┼────────────────┼─────────┘
          │                 │                │
    ┌─────┴─────────────────┴────────────────┴─────┐
    │              Nginx (WAF / Proxy)              │
    └─────────────────────┬─────────────────────────┘
                          │
┌─────────────────────────┴──────────────────────────┐
│               Backend (FastAPI + gRPC)               │
│  ┌────────────┐ ┌──────────┐ ┌───────────────────┐ │
│  │ REST Routes│ │ gRPC     │ │ Background Workers│ │
│  │ (26 route  │ │ Servicers│ │ (cleanup, archive,│ │
│  │  modules)  │ │ (3 svcs) │ │  telemetry, AI)   │ │
│  └─────┬──────┘ └────┬─────┘ └────────┬──────────┘ │
│        │             │                │            │
│  ┌─────┴─────────────┴────────────────┴──────────┐ │
│  │           Services Layer                       │ │
│  │  Auth | Message | File | Encryption | AI       │ │
│  │  Push | Email | CDN | Notification | Telemetry │ │
│  └────────────────────┬───────────────────────────┘ │
│  ┌────────────────────┴───────────────────────────┐ │
│  │           Data Layer (SQLAlchemy ORM)           │ │
│  │  User | Message | Group | File | Call | Status  │ │
│  │  Poll | Note | Meeting | Audit | PushSubscription│ │
│  └────────────────────┬───────────────────────────┘ │
└───────────────────────┼─────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
  ┌─────┴─────┐                   ┌─────┴─────┐
  │ PostgreSQL│                   │   Redis   │
  │  (primary)│                   │ (cache,   │
  │  + SQLite │                   │  rate lim,│
  │  (dev)    │                   │  pub/sub) │
  └───────────┘                   └───────────┘
```

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Framework | **FastAPI 0.115** (async Python 3.11) |
| API Protocols | REST (HTTP/2), gRPC (HTTP/2), gRPC-Web, Socket.IO |
| ORM | **SQLAlchemy 2.0** with asyncpg |
| Database | PostgreSQL 15 (prod), SQLite (dev) |
| Cache/Queue | **Redis 7** (rate limiting, pub/sub, token blacklist) |
| gRPC | **grpcio 1.71**, Sonora 0.2 (gRPC-Web compat) |
| Encryption | **cryptography** (AES-256-GCM, RSA-4096), bcrypt, PyJWT |
| Auth | JWT (access + refresh), CSRF tokens, session management |
| Rate Limiting | **SlowAPI** (Redis-backed) |
| Monitoring | Sentry, OpenTelemetry, Prometheus metrics |
| WS | **python-socketio** (real-time messaging fallback) |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (React 19, App Router) |
| Language | **TypeScript** 5 |
| State | **Zustand** + **TanStack React Query** |
| Styling | **Tailwind CSS 4**, Framer Motion |
| Real-time | gRPC-Web (@protobuf-ts), Socket.IO client |
| i18n | **next-intl** |
| Forms | **Zod** validation |
| UI | Lucide React, Sonner (toasts), Emoji Picker |
| Testing | **Vitest**, Testing Library |
| WebRTC | Custom peer-to-peer call implementation |

### Infrastructure
| Component | Technology |
|-----------|-----------|
| Container | **Docker** + multi-stage builds |
| Orchestration | **Docker Compose** (4 services) |
| Reverse Proxy | **Nginx** (WAF rules) |
| Secrets | Environment variables (HashiCorp Vault-ready) |
| CI/CD | GitHub Actions (.github/workflows) |

## Project Structure

```
├── backend/                        # Python FastAPI backend
│   ├── main.py                     # App entry, middleware, router registration, gRPC-Web mount
│   ├── config.py                   # Environment-based configuration (dev/staging/prod)
│   ├── socket_server.py            # Socket.IO server for WS fallback
│   ├── alembic_setup.py            # Alembic migration bootstrap
│   ├── create_tables.py / init_db.py
│   ├── run.py / run_migrations.py  # Dev entry points
│   ├── core/
│   │   ├── audit_utils.py          # Audit logging middleware
│   │   ├── exceptions.py           # Domain exception hierarchy
│   │   ├── logging_config.py       # Structured JSON logging
│   │   ├── rate_limiter.py         # SlowAPI-based rate limiter
│   │   ├── redis_client.py         # Redis connection manager
│   │   ├── response.py             # Standardized API responses
│   │   ├── secrets_manager.py      # HashiCorp Vault integration
│   │   ├── security.py             # Password policies, CSRF, token utils
│   │   ├── telemetry.py            # OpenTelemetry middleware
│   │   └── validation.py           # Input sanitization helpers
│   ├── models/                     # SQLAlchemy ORM models
│   │   ├── user.py                 # Users, roles, E2E key storage
│   │   ├── message.py              # Encrypted messages, replies, threads
│   │   ├── group.py                # Groups, memberships
│   │   ├── file.py                 # Encrypted file metadata
│   │   ├── call.py                 # WebRTC call records
│   │   ├── contact.py              # User contacts/address book
│   │   ├── meeting.py              # Scheduled meetings
│   │   ├── poll.py                 # Polls & votes
│   │   ├── note.py                 # User notes
│   │   ├── status.py               # Story-like status updates
│   │   ├── message_reaction.py     # Emoji reactions
│   │   ├── message_thread.py       # Slack-style threads
│   │   ├── scheduled_message.py    # Delayed/scheduled messages
│   │   ├── starred_message.py      # Bookmarked messages
│   │   ├── push_subscription.py    # Web push subscriptions
│   │   ├── user_settings.py        # Per-user settings
│   │   ├── user_session.py         # Session tracking
│   │   ├── chat_wallpaper.py       # Chat customization
│   │   ├── audit_log.py            # Audit trail
│   │   ├── database.py / database_async.py
│   │   └── meeting.py              # Meeting/calendar
│   ├── routes/                     # REST API route handlers (26 modules)
│   │   ├── auth_routes.py          # Register, login, refresh, verify email
│   │   ├── message_routes.py       # Send/receive messages, conversations
│   │   ├── group_routes.py         # Group CRUD, members, invite codes
│   │   ├── file_routes.py          # Upload/download encrypted files
│   │   ├── call_routes.py          # WebRTC signaling
│   │   ├── contact_routes.py       # Contact management
│   │   ├── user_routes.py          # Profile, avatar, presence
│   │   ├── settings_routes.py      # User settings
│   │   ├── admin_routes.py         # Admin panel operations
│   │   ├── status_routes.py        # Status/story CRUD
│   │   ├── poll_routes.py          # Poll creation/voting
│   │   ├── note_routes.py          # User notes
│   │   ├── thread_routes.py        # Threaded replies
│   │   ├── reaction_routes.py      # Message reactions
│   │   ├── scheduled_routes.py     # Scheduled messages
│   │   ├── meeting_routes.py       # Meeting scheduling
│   │   ├── push_routes.py          # Web push notifications
│   │   ├── audit_routes.py         # Audit log queries
│   │   ├── cdn_routes.py           # CDN content delivery
│   │   ├── metrics_routes.py       # Prometheus metrics endpoint
│   │   ├── privacy_routes.py       # Data export/deletion (GDPR)
│   │   ├── external_routes.py      # External integrations
│   │   ├── dependencies.py         # Route DI (DB session, current user)
│   │   └── ...
│   ├── services/                   # Business logic layer
│   │   ├── auth_service.py         # JWT, password, session management
│   │   ├── message_service.py      # Message encryption, delivery, threads
│   │   ├── file_service.py         # File encryption, upload pipeline
│   │   ├── encryption_service.py   # AES-256-GCM encrypt/decrypt
│   │   ├── upload_encryption.py    # Vault-style encrypted file storage
│   │   ├── notification_service.py # In-app notifications
│   │   ├── push_service.py         # Web push (pywebpush)
│   │   ├── email_service.py        # Async SMTP (aiosmtplib)
│   │   ├── cdn_service.py          # CDN origin pull
│   │   ├── link_preview_service.py # URL metadata extraction
│   │   ├── redis_notification_service.py
│   │   ├── grpc_server.py          # gRPC async server (port 50051)
│   │   ├── grpc_servicers/
│   │   │   ├── messaging_servicer.py      # gRPC real-time messaging
│   │   │   └── ai_processing_servicer.py  # AI task processing
│   │   ├── message_cleanup.py      # Background: delete expired messages
│   │   ├── message_archive.py      # Background: archive old messages
│   │   ├── file_cleanup.py         # Background: delete expired files
│   │   ├── status_cleanup.py       # Background: expire statuses
│   │   ├── scheduled_message_worker.py  # Background: deliver scheduled msgs
│   │   └── telemetry_worker.py     # Background: metrics aggregation
│   └── protos/                     # gRPC protobuf definitions
│       ├── messaging.proto         # MessagingService RPCs
│       ├── ai_processing.proto     # AIProcessingService RPCs
│       └── service.proto           # InternalService RPCs
│
├── frontend_1/                     # Next.js 16 client
│   ├── src/
│   │   ├── app/[locale]/           # Internationalized routes
│   │   │   ├── (app)/              # Authenticated app layout
│   │   │   │   ├── chat/           # 1-on-1 and group chat
│   │   │   │   ├── groups/         # Group management
│   │   │   │   ├── contacts/       # Contact list
│   │   │   │   ├── calls/          # Call logs
│   │   │   │   ├── call/           # Active WebRTC call UI
│   │   │   │   ├── meetings/       # Scheduled meetings
│   │   │   │   ├── files/          # File gallery
│   │   │   │   ├── status/         # Stories/statuses
│   │   │   │   ├── polls/          # Polls
│   │   │   │   ├── notes/          # Personal notes
│   │   │   │   ├── starred/        # Starred/bookmarked messages
│   │   │   │   ├── profile/        # User profile
│   │   │   │   ├── settings/       # App settings
│   │   │   │   └── admin/          # Admin dashboard
│   │   │   ├── (auth)/             # Auth pages
│   │   │   │   ├── login/          # Login
│   │   │   │   ├── register/       # Registration
│   │   │   │   └── verify-email/   # Email verification
│   │   │   └── (public)/           # Public pages
│   │   ├── components/
│   │   │   ├── chat/               # Chat UI components
│   │   │   ├── files/              # File upload/gallery
│   │   │   ├── layout/             # App shell, sidebar, headers
│   │   │   ├── meetings/           # Meeting UI
│   │   │   ├── settings/           # Settings panels
│   │   │   └── ui/                 # Reusable design system
│   │   ├── lib/                    # Client utilities
│   │   │   ├── api.ts              # Axios REST client
│   │   │   ├── grpc-client.ts      # @protobuf-ts gRPC-Web client
│   │   │   ├── socket.ts           # Socket.IO client
│   │   │   ├── webrtc.ts           # WebRTC peer connection
│   │   │   ├── e2e-crypto.ts       # Client-side E2EE
│   │   │   ├── local-ai.ts         # AI feature helpers
│   │   │   ├── local-cache.ts      # IndexedDB cache
│   │   │   ├── notifications.ts    # Browser notifications
│   │   │   ├── push-notifications.ts  # Web push
│   │   │   ├── security.ts         # CSP, content security
│   │   │   ├── call-audio.ts       # Audio management
│   │   │   ├── utils.ts            # General utilities
│   │   │   └── validation.ts       # Zod schemas
│   │   ├── stores/                 # Zustand state stores
│   │   ├── hooks/                  # React hooks
│   │   ├── providers/              # React context providers
│   │   ├── generated/              # Generated protobuf TS types
│   │   ├── types/                  # TypeScript type definitions
│   │   ├── messages/               # i18n translation files
│   │   └── navigation.ts          # Route definitions
│   ├── Dockerfile                  # Multi-stage build (node:20-alpine)
│   └── next.config.ts              # Standalone output, rewrites to backend
│
├── nginx/
│   ├── Dockerfile
│   └── waf.conf                   # Web Application Firewall rules
├── certs/                          # TLS certificates
├── scripts/
│   ├── backup-db.ps1              # Windows DB backup
│   └── backup-db.sh               # Linux DB backup
├── docker-compose.yml              # 4 services: postgres, redis, backend, frontend
├── docker-compose.staging.yml      # Staging overrides
├── docker-compose.waf.yml          # Nginx WAF overrides
└── Dockerfile                      # Backend multi-stage build (python:3.11-slim)
```

## Communication Protocols

### 1. REST API (HTTP/2)
Standard CRUD endpoints for auth, user management, file uploads, settings, etc. All requests go through CORS, CSRF, rate limiting, and security headers middleware.

### 2. gRPC-Web (HTTP/2 Streaming)
Real-time bidirectional streaming via **three protobuf services**:
- `MessagingService` — Server-streaming for messages, typing indicators, read receipts
- `AIProcessingService` — Async AI task offloading
- `InternalService` — Internal inter-service RPCs

The backend mounts gRPC-Web via **Sonora ASGI** with monkey-patches for browser compatibility (`application/grpc-web+proto` content-type enforcement).

### 3. Socket.IO (WebSocket Fallback)
python-socketio server mounted at `/` for legacy/broadcast real-time events (presence, typing, notifications).

## Security Architecture

### Encryption Layers
| Layer | Algorithm | Key Management |
|-------|-----------|----------------|
| Messages (E2EE) | **X3DH + AES-256-GCM** | Key stored in user.public_key / backup_encrypted_key |
| File Uploads | **AES-256-GCM** (Vault format with JSON header) | UPLOADS_ENCRYPTION_KEY env var |
| Master Key | **RSA-4096** | EV-less file in production; Vault-ready |
| Passwords | **bcrypt** | Built-in salt + hash |
| JWT | **HS256** | JWT_SECRET_KEY env var |
| Transport | **TLS 1.3** | Production only; gRPC supports mutual TLS |

### Middleware Stack (per-request)
```
Request
  ├── SecurityHeadersMiddleware (HSTS, CSP, XFO, CORS, Permissions-Policy)
  ├── CSRFMiddleware (cookie+header validation, exempt auth/health paths)
  ├── CORSMiddleware (env-configured origins, explicit in production)
  ├── RequestCountMiddleware (Prometheus metrics)
  ├── TelemetryMiddleware (OpenTelemetry spans)
  ├── RateLimiter (SlowAPI, Redis-backed)
  └── Route Handler
```

### Security Hardening
- **Rate limiting**: 60/min default, 5/min on login, 3/min on password change
- **CSRF**: Double-submit cookie pattern, Redis-stored tokens
- **Session rotation**: New tokens on refresh, old blacklisted in Redis
- **File uploads**: 50MB limit, content validation, mime whitelist, encrypted at rest
- **Docker**: Non-root users (`appuser`/`nextjs`), dropped capabilities (`no-new-privileges`), read-only root FS
- **Audit logging**: Configurable retention (default 90 days), exempt health/metrics paths
- **Database**: Parameterized queries (SQLAlchemy), connection pooling, SSL mode required

### Environment-Based Configuration
Three tiers with strictness escalation:
- **Development**: Relaxed CORS, longer token expiry (1h/30d), Swagger UI enabled
- **Staging**: Production-like with relaxed CORS, hourly tokens
- **Production**: 15min access tokens, 7d refresh, explicit CORS validation, Swagger disabled, custom encryption key required

## Data Models (22 ORM tables)

| Model | Purpose |
|-------|---------|
| `User` | Auth, roles, E2E keys, profiles |
| `UserSession` | Session tracking, device management |
| `UserSettings` | Per-user preferences |
| `Message` | Encrypted messages, replies, threads, forwarding |
| `MessageReaction` | Emoji reactions |
| `MessageThread` | Slack-style thread structure |
| `StarredMessage` | Bookmarked messages |
| `ScheduledMessage` | Delayed delivery |
| `Group` / `GroupMember` | Group chats with invite codes |
| `Contact` | User address book |
| `File` | Encrypted file metadata |
| `Call` | WebRTC call history |
| `Meeting` | Calendar meetings |
| `Status` | Story-like ephemeral updates |
| `Poll` / `PollVote` | Polls with voting |
| `Note` | Personal user notes |
| `PushSubscription` | Web push endpoints |
| `ChatWallpaper` | Chat background customization |
| `AuditLog` | Security event audit trail |

## Real-time Messaging Flow

```
Client                          Backend                        gRPC Server
  │                                │                               │
  │── gRPC-Web ConnectRequest ────►│                               │
  │    (JWT token)                 │── auth validate ─────────────►│
  │                                │◄── success ──────────────────│
  │◄── StreamResponse stream ──────│                               │
  │                                │                               │
  │── SendMessage (gRPC) ─────────►│                               │
  │    (encrypted content)         │── encrypt & store DB ────────►│
  │                                │── notify recipient (Redis) ──►│
  │                                │── push notification (webpush) │
  │◄── SendMessageResponse ────────│                               │
  │                                │                               │
  │◄── NewMessageEvent (stream) ───│   (recipient receives)        │
```

## Deployment

### Docker Compose (Local/Staging)
```bash
docker compose up -d
```
- PostgreSQL 15 on port 5433
- Redis 7 on port 6379
- Backend (FastAPI) on port 5001 + gRPC on 50051
- Frontend (Next.js) on port 3000

### Production
1. Set all required env vars (SECRET_KEY, JWT_SECRET_KEY, ENCRYPTION_PASSWORD, UPLOADS_ENCRYPTION_KEY, POSTGRES_PASSWORD, REDIS_PASSWORD)
2. Set `APP_ENV=production`
3. Configure CORS_ORIGINS explicitly
4. Deploy using `docker compose -f docker-compose.yml -f docker-compose.waf.yml up -d`

### Environment Variables (Required)
| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | 64-char random string (session signing) |
| `JWT_SECRET_KEY` | 64-char random string (token signing) |
| `ENCRYPTION_PASSWORD` | 64-char random string (master key derivation) |
| `UPLOADS_ENCRYPTION_KEY` | Base64-encoded AES key (file encryption) |
| `DATABASE_URL` | PostgreSQL async connection string |
| `POSTGRES_PASSWORD` | Database password |
| `REDIS_PASSWORD` | Redis password |

See `.env.example` for complete reference.

## API Documentation

REST API docs (Swagger/Redoc) available at `/docs` and `/redoc` in development mode. Three gRPC-Web services mounted at:
- `/messaging.MessagingService/`
- `/aiprocessing.AIProcessingService/`
- `/internal_service.InternalService/`

Health endpoints:
- `GET /api/health` — Simple liveness check
- `GET /api/health/deep` — Database + Redis connectivity check

## Monitoring & Observability

- **Sentry**: Error tracking (SENTRY_DSN env var)
- **OpenTelemetry**: Distributed tracing middleware
- **Prometheus Metrics**: `GET /api/metrics` (request count, error rate)
- **Structured JSON Logging**: All services output JSON logs (LOG_LEVEL, JSON_LOGS)
- **Audit Trail**: Configurable-retention audit log for security events
