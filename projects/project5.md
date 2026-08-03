# TalkToDB

Voice/Text-to-SQL knowledge assistant — connect to any SQL database, ask questions in natural language (text or voice), get answers as data tables, charts, and spoken summaries.

Supports **local models** (GGUF via llama.cpp) and **cloud APIs** (OpenAI, Anthropic, Gemini) — switch between them via config or environment variables.

---

## Quick Start

### Docker (recommended)

```bash
docker compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

Place a GGUF model in `models/` before starting (see below).

### Manual

**Backend:**

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

---

## Requirements

### System

| Resource | Local mode | Cloud API mode |
|---|---|---|
| RAM | 8 GB minimum, 16 GB recommended | 4 GB |
| Disk | 10 GB (models) + 1 GB app | 1 GB |
| CPU | 4+ cores | 2 cores |
| GPU | Optional (Whisper speedup) | Not needed |

### LLM Backend — Choose One

#### Option A: Local (default)

TalkToDB uses **two local models**:

| Purpose | Model | Size |
|---|---|---|
| SQL generation (LLM) | Any GGUF model | ~4-8 GB |
| Embeddings (RAG) | `all-MiniLM-L6-v2` (auto-downloaded) | ~80 MB |

Pick a GGUF model and place it in `talktodb/models/`:

- **[SQLCoder-7B-GGUF](https://huggingface.co/TheBloke/sqlcoder-7B-GGUF)** — purpose-built for NL→SQL (recommended)
- **[DeepSeek-Coder-6.7B-instruct-GGUF](https://huggingface.co/TheBloke/deepseek-coder-6.7b-instruct-GGUF)** — strong generalist coder

Update `config.json` to set your model path.

#### Option B: Cloud API

Set environment variables and switch the provider:

```bash
# Use OpenAI
export TALK_LLM_PROVIDER=openai
export OPENAI_API_KEY=sk-...
# or TALK_OPENAI_API_KEY

# Use Anthropic
export TALK_LLM_PROVIDER=anthropic
export TALK_ANTHROPIC_API_KEY=sk-ant-...

# Use Gemini
export TALK_LLM_PROVIDER=gemini
export TALK_GEMINI_API_KEY=...
```

Cloud embeddings also supported:
```bash
export TALK_EMBED_PROVIDER=openai
# uses the same OPENAI_API_KEY
```

### Database

Any SQLAlchemy-compatible database: PostgreSQL, MySQL, SQL Server, SQLite.

**Always use a read-only database user** for safety.

---

## Configuration

TalkToDB uses `backend/config.json` to manage all settings. Environment variables override config values.

```json
{
  "llm": {
    "provider": "local",
    "local": { "model_path": "models/sqlcoder-7b-q4_k_m.gguf", ... },
    "openai": { "model": "gpt-4o", ... },
    "anthropic": { "model": "claude-3-5-sonnet-20240620", ... },
    "gemini": { "model": "gemini-2.0-flash", ... }
  },
  "embeddings": {
    "provider": "local",
    "local": { "model": "all-MiniLM-L6-v2" },
    "openai": { "model": "text-embedding-3-small" }
  }
}
```

| Env variable | Override |
|---|---|
| `TALK_LLM_PROVIDER` | LLM backend: `local`, `openai`, `anthropic`, `gemini` |
| `TALK_EMBED_PROVIDER` | Embedding backend: `local`, `openai` |
| `TALK_OPENAI_API_KEY` | OpenAI API key |
| `TALK_ANTHROPIC_API_KEY` | Anthropic API key |
| `TALK_GEMINI_API_KEY` | Gemini API key |
| `OPENAI_API_KEY` | Fallback for both OpenAI LLM and embeddings |

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/connect` | POST | Connect to a DB (connection string + optional label) |
| `/connections` | GET | List all saved connections |
| `/connections/{db_id}` | DELETE | Remove a saved connection |
| `/query` | POST | Ask a question in text |
| `/voice-query` | POST | Ask a question via audio (multipart) |
| `/health` | GET | Health check |

### `/query` example

```json
POST /query
{"db_id": "abc123", "question": "how many orders were placed last month?"}

→
{"sql": "SELECT COUNT(*) FROM orders WHERE order_date >= date_trunc('month', CURRENT_DATE - interval '1 month') ...",
 "results": [{"count": 482}],
 "columns": ["count"],
 "row_count": 1,
 "nl_summary": "There were 482 orders placed last month."}
```

---

## Architecture

```
Frontend (React + Vite)  ──REST──►  FastAPI Backend
                                       │
                          ┌────────────┼────────────┐
                     Schema        Voice         Query
                  Introspector     Engine        Engine
                  (SQLAlchemy)  (faster-whisper,  (llama.cpp +
                                  pyttsx3)     SQLCoder-7B)
                          │               │            │
                     Knowledge          RAG        SQL Guard
                     Store (FAISS)   Retriever    (sqlglot)
                          │                          │
                     SQLite metadata             Query Executor
                                                (SQLAlchemy, R/O)
```

### Data flow

1. **Connect:** DB connection string → schema introspection → NL descriptions → FAISS vectors + SQLite cache
2. **Query:** Text/voice → (Whisper STT) → embed question → FAISS top-k schemas → LLM generates SQL → sqlglot validates (SELECT-only + LIMIT) → execute on read-only connection → format as table + chart + NL summary → (optional TTS)

### Safety

- `sqlglot` blocks non-SELECT statements
- Auto-injects `LIMIT 1000` if missing
- Self-correction retry loop (up to 3 attempts)
- Query timeout (15s)
- Read-only DB user configuration

---

## Project Structure

```
talktodb/
├── backend/
│   ├── main.py                  # FastAPI entrypoint
│   ├── api/
│   │   ├── routes_connection.py # /connect, /connections, DELETE
│   │   └── routes_query.py      # /query, /voice-query
│   ├── core/
│   │   ├── introspector.py      # Schema extraction
│   │   ├── embedder.py          # FAISS indexing
│   │   ├── retriever.py         # Top-k retrieval
│   │   ├── llm_engine.py        # LLM prompt + SQL generation
│   │   ├── sql_guard.py         # SQL validation
│   │   ├── executor.py          # Query execution
│   │   └── voice.py             # STT + TTS
│   ├── models/
│   │   └── schema_models.py     # Pydantic models
│   ├── storage/
│   │   ├── faiss_index/         # Vector indices
│   │   └── metadata.db          # SQLite cache
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── ConnectDB.jsx     # DB connection manager
│   │       ├── ChatInput.jsx     # Text + voice input
│   │       ├── ResultTable.jsx   # SQL + NL summary + table
│   │       └── ResultChart.jsx   # Auto-detect chart type
│   └── package.json
├── models/                       # GGUF model files (gitignored)
├── Dockerfile
├── docker-compose.yml
└── README.md
```
