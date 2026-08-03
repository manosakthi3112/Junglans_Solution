# BotForge — SaaS Chatbot Builder Platform

> Build, customize, and embed AI-powered chatbots on any website. No coding required.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Knowledge Base Guide](KNOWLEDGE_BASE_GUIDE.md)
- [Node Flow Builder](#node-flow-builder)
- [Embedding Your Chatbot](#embedding-your-chatbot)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**BotForge** is a multi-tenant SaaS platform that lets any business sign up, build their own AI chatbot using a visual node-based flow editor, customize it with their company branding, and embed it on their website with a single line of code.

Think of it like **Chatbase** or **Botpress** — but built by you, your way.

```
Business signs up → Builds chatbot flow → Customizes branding → Embeds on website → End users chat
```

---

## Features

### v1 (Current)

| Feature | Description |
|---|---|
| User Auth | Signup, login, JWT-based sessions, password reset |
| Dashboard | View all bots, usage stats, quick actions |
| Node Flow Builder | Drag-and-drop visual chatbot flow editor |
| Company Details | Set name, logo, brand color, bot personality |
| AI Integration | Connect Claude or OpenAI to power bot responses |
| Embeddable Widget | One-line JavaScript embed for any website |
| Team Workspace | Invite team members with role-based access |
| Chat History | View all conversations per bot |

### Node Types

| Node | Purpose |
|---|---|
| `Start` | Opening greeting when user opens chat |
| `Message` | Fixed reply text from the bot |
| `AI` | Dynamic LLM-powered response using company context |
| `Condition` | Branch based on user input (if/else logic) |
| `Collect Input` | Ask user for name, email, phone, etc. |
| `End` | Close the conversation |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Tailwind CSS + React Flow |
| Backend | FastAPI (Python 3.11+) |
| HTML Scraping | BeautifulSoup4 + lxml |
| Database | PostgreSQL + SQLAlchemy ORM |
| Authentication | JWT tokens + bcrypt password hashing |
| LLM | Anthropic Claude API / OpenAI API |
| Embed Widget | Vanilla JavaScript (no dependencies) |
| File Storage | AWS S3 / Cloudflare R2 (for logos) |
| Deployment | Railway / Render / Docker |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                │
│   Business Owner    │    Admin (You)    │    End User        │
└────────┬────────────┴────────┬──────────┴────────┬──────────┘
         │                     │                    │
         ▼                     ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND  (React)                        │
│  Auth Pages  │  Dashboard  │  Bot Builder  │  Settings      │
└──────────────────────────┬──────────────────────────────────┘
                           │  REST API calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND  (FastAPI)                       │
│  Auth Service  │  Bot Config API  │  Chat Engine  │  Embed  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE  (PostgreSQL)                    │
│  users  │  workspaces  │  bots  │  nodes  │  conversations  │
└─────────────────────────────────────────────────────────────┘

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

┌─────────────────────────────────────────────────────────────┐
│               EMBEDDED CHATBOT  (Client Websites)          │
│  JS Widget Snippet  →  Chat Bubble UI  →  Chat Engine API  │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
botforge/
├── frontend/                   # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Login, Register, Reset password
│   │   │   ├── dashboard/      # Bot list, stats cards
│   │   │   ├── builder/        # Node flow editor
│   │   │   │   ├── NodeTypes/  # Start, Message, AI, Condition nodes
│   │   │   │   └── FlowCanvas.jsx
│   │   │   ├── settings/       # Company info, branding
│   │   │   └── team/           # Member invite, roles
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/              # Zustand / Redux state
│   │   ├── api/                # Axios API calls
│   │   └── App.jsx
│   └── package.json
│
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py         # Login, register, JWT
│   │   │   ├── bots.py         # Bot CRUD endpoints
│   │   │   ├── chat.py         # Chat engine, LLM calls
│   │   │   ├── company.py      # Company details
│   │   │   └── team.py         # Team management
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic request/response models
│   │   ├── services/
│   │   │   ├── llm.py          # Claude / OpenAI wrapper
│   │   │   └── flow_engine.py  # Node flow execution logic
│   │   ├── core/
│   │   │   ├── config.py       # Settings from env
│   │   │   └── security.py     # JWT + bcrypt utils
│   │   └── main.py
│   ├── alembic/                # DB migrations
│   └── requirements.txt
│
├── widget/                     # Embeddable JS chatbot widget
│   ├── src/
│   │   └── widget.js           # Vanilla JS chat bubble
│   └── dist/
│       └── widget.min.js       # Production build
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- An [Anthropic API key](https://console.anthropic.com) or OpenAI API key

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/botforge.git
cd botforge
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Run database migrations:

```bash
alembic upgrade head
```

Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. Using Docker (recommended)

```bash
docker-compose up --build
```

---

## Environment Variables

Create a `.env` file in the `backend/` folder based on `.env.example`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/botforge

# Security
SECRET_KEY=your-very-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# LLM
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxx        # optional

# Storage (for company logos)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET_NAME=botforge-uploads

# App
FRONTEND_URL=http://localhost:5173
WIDGET_CDN_URL=https://cdn.yourdomain.com
```

---

## Database Schema

```sql
-- Users and workspaces
users (id, email, password_hash, name, created_at)
workspaces (id, owner_id, name, plan, created_at)
workspace_members (id, workspace_id, user_id, role)   -- role: owner | admin | member

-- Bots and flow
bots (id, workspace_id, name, description, is_active, created_at)
bot_nodes (id, bot_id, node_type, position_x, position_y, config_json)
bot_edges (id, bot_id, source_node_id, target_node_id, condition)

-- Company details
company_profiles (id, workspace_id, company_name, logo_url, brand_color, bot_name, system_prompt)

-- Conversations
conversations (id, bot_id, session_id, started_at, ended_at)
messages (id, conversation_id, role, content, created_at)  -- role: user | assistant
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/forgot-password` | Send reset email |

### Bots

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bots` | List all bots in workspace |
| POST | `/api/bots` | Create new bot |
| GET | `/api/bots/{id}` | Get bot details |
| PUT | `/api/bots/{id}` | Update bot |
| DELETE | `/api/bots/{id}` | Delete bot |
| GET | `/api/bots/{id}/flow` | Get node flow JSON |
| PUT | `/api/bots/{id}/flow` | Save node flow JSON |

### Chat (used by embedded widget)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat/start` | Start a new conversation |
| POST | `/api/chat/message` | Send message, get bot reply |
| GET | `/api/chat/{session_id}/history` | Get conversation history |

### Company

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/company` | Get company profile |
| PUT | `/api/company` | Update company details |
| POST | `/api/company/logo` | Upload logo |

### Team

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/team/members` | List team members |
| POST | `/api/team/invite` | Invite member by email |
| PUT | `/api/team/members/{id}/role` | Change member role |
| DELETE | `/api/team/members/{id}` | Remove member |

### Knowledge Base

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/knowledge` | List all knowledge base entries |
| POST | `/api/knowledge` | Create new FAQ/manual entry |
| PUT | `/api/knowledge/{id}` | Update entry |
| DELETE | `/api/knowledge/{id}` | Delete entry |
| POST | `/api/knowledge/scrape` | Scrape website and generate entries |
| POST | `/api/knowledge/bulk` | Bulk import entries |

---

## Node Flow Builder

The bot builder uses **React Flow** to create a visual drag-and-drop editor. Each node has a `config_json` that defines its behavior.

### Node config examples

**Message node**
```json
{
  "type": "message",
  "text": "Hello! How can I help you today?",
  "delay_ms": 500
}
```

**AI node**
```json
{
  "type": "ai",
  "model": "claude-sonnet-4-20250514",
  "temperature": 0.7,
  "max_tokens": 300,
  "use_company_context": true
}
```

**Condition node**
```json
{
  "type": "condition",
  "condition": "user_input contains 'price'",
  "true_branch": "node_pricing_info",
  "false_branch": "node_general_help"
}
```

**Collect input node**
```json
{
  "type": "collect_input",
  "prompt": "What is your email address?",
  "field_name": "email",
  "validation": "email"
}
```

---

## Embedding Your Chatbot

After building your bot, go to **Settings → Embed** to get your unique snippet:

```html
<!-- Add this before closing </body> tag -->
<script
  src="https://cdn.yourdomain.com/widget.min.js"
  data-bot-id="YOUR_BOT_ID"
  data-primary-color="#6366f1"
  async>
</script>
```

The widget automatically:
- Shows a branded chat bubble in the bottom-right corner
- Loads your bot's name and avatar from your company settings
- Connects to the chat engine API using your bot ID
- Stores session history in the browser for continuity

---

## Roadmap

### v1 — Core Platform
- [x] User authentication
- [x] Bot dashboard
- [x] Node flow builder
- [x] Company customization
- [x] Embeddable widget
- [x] Team workspace

### v2 — Growth Features
- [ ] Usage analytics (messages/day, active sessions)
- [ ] Lead capture & export to CSV
- [ ] WhatsApp and Telegram integration
- [ ] Custom domain for widget
- [ ] Webhook support on node actions
- [ ] Billing and subscription plans (Razorpay / Stripe)

### v3 — Enterprise
- [ ] White-label option (your clients can rebrand)
- [ ] Fine-tuned AI models per business
- [ ] CRM integrations (HubSpot, Salesforce)
- [ ] Multilingual support (Tamil, Hindi, etc.)
- [ ] On-premise deployment option

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with ❤️ by [Your Name] | Powered by [Anthropic Claude](https://anthropic.com)
