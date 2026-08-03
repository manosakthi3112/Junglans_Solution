# jung

> A version control sidecar for AI-assisted development. Captures the **conversation, plan, tool calls, token cost, and human-vs-agent attribution** behind every code change — permanently linked to the diff that resulted.

[![Tests](https://github.com/jung/jung/actions/workflows/ci.yml/badge.svg)](https://github.com/jung/jung/actions/workflows/ci.yml)
![Python](https://img.shields.io/badge/python-3.11%2B-blue)
![Status](https://img.shields.io/badge/status-active--development-yellow)
![Tests](https://img.shields.io/badge/tests-45%20passing-green)

---

## Table of Contents

- [Why jung?](#why-jung)
- [Quickstart](#quickstart)
- [CLI Reference](#cli-reference)
  - [Initialization](#1-initialization)
   - [Daemon Lifecycle](#2-daemon-lifecycle)
   - [Browsing History](#3-browsing-history)
  - [Attribution & Analysis](#4-attribution--analysis)
  - [Search & Discovery](#5-search--discovery)
  - [Configuration](#6-configuration)
  - [Export & Maintenance](#7-export--maintenance)
  - [Web Dashboard](#8-web-dashboard)
  - [Reports](#9-reports)
  - [Git Integration](#10-git-integration)
  - [Adapters](#11-adapters)
  - [Remote Sync](#12-remote-sync)
  - [Interactive REPL](#13-interactive-repl)
- [Timeline](#14-timeline)
- [Version Control](#15-version-control)
  - [jung commit](#jung-commit)
  - [jung revert](#jung-revert)
  - [jung branch](#jung-branch)
  - [jung merge](#jung-merge)
- [Configuration](#configuration)
- [Web Dashboard](#web-dashboard-1)
- [Reports](#reports-1)
- [Adapters](#adapters-1)
- [Git Integration](#git-integration-1)
- [Daemon](#daemon)
- [Development](#development)
- [Platform Notes](#platform-notes)
- [License](#license)

---

## Why jung?

Git tracks **what** changed. jung tracks **why** and **who** (human or AI agent).

When you work with an AI coding assistant (Cursor, Gemini Antigravity, Claude Code, etc.), you get:
- A conversation log explaining the reasoning
- Tool calls showing what the agent did
- Token usage and cost for each interaction
- Clear attribution: which lines were written by the agent vs. edited by you

jung links all of this to the actual file diffs, creating a rich, queryable history of how your codebase evolved.

### What jung is NOT

- **Not a git replacement** — jung works alongside git. It reads git state (HEAD commit, diffs) but never writes to git automatically.
- **Not a CI/CD tool** — It's a local-first development tool with optional remote sync.
- **Not an IDE plugin** — It reads IDE conversation logs from disk. It never writes into the IDE's data directory.

---

## Quickstart

```bash
# 1. Install
pip install jung

# 2. Initialize in your project
cd my-project
jung init

# 3. (Optional) Generate sample data if no real IDE sessions exist
jung testdata --antigravity

# 4. Start the daemon to ingest conversations and watch for file changes
jung watch

# 5. Check store status and browse what was captured
jung status
jung log
jung cost
jung blame src/main.py

# 6. Snapshot and revert changes
jung commit -m "Checkpoint AI changes"
jung branch experiment --switch
jung revert src/main.py --line 42

# 7. Launch the web dashboard
jung dashboard --open

# 8. Generate reports
jung report --stats
jung report --daily
```

---

## CLI Reference

jung provides a rich command-line interface with 24+ commands organized into core commands and command groups. Every command supports `--help` for detailed usage information.

---

### 1. Initialization

#### `jung init`

Initialize a jung store in the current directory. This is the first command you run in any project where you want to track AI-assisted development context.

Creates `.jung/` with an SQLite database, blob store, and default configuration. If the directory is a Git repository, a post-commit hook is automatically installed to link turns to commits.

```bash
# Basic initialization
jung init
# → Initialized empty jung store in .jung/

# Reinitialize (destructive — removes existing .jung/)
jung init --force

# Initialize with a custom config template
jung init --template /path/to/custom-config.yaml
```

**Options:**

| Option | Description |
|--------|-------------|
| `--force` | Reinitialize even if `.jung/` already exists (deletes existing store) |
| `--template PATH` | Path to a custom YAML configuration template |

**What gets created:**

```
.jung/
├── index.db           # SQLite database (metadata, FTS5 search index)
├── config.yaml        # User configuration (YAML)
├── objects/           # Content-addressed blob store (SHA-256)
│   └── ab/
│       └── cdef...    # Objects sharded by first 2 hex chars
└── daemon.pid         # PID file (created when daemon is running)
```

**Automatic git integration:**
- If the current directory is a Git repository, a post-commit hook is automatically installed
- After each `git commit`, turns associated with that commit are tagged with the commit SHA
- This creates a bidirectional link: `commit → turns` and `turns → commit`

---

### 2. Daemon Lifecycle

The daemon is the main ingestion engine. It runs in the background (or optionally in the foreground), continuously monitoring IDE log files and the filesystem to capture all development activity.

**What the daemon does:**
1. **Discovers IDE sessions** via configured adapters (Antigravity, Cursor, etc.)
2. **Streams conversation events** — messages, tool calls, artifact changes
3. **Watches the filesystem** for file changes in configured directories
4. **Correlates file changes** to conversation turns using timestamp windows
5. **Stores everything** in the SQLite index and content-addressed blob store

---

#### `jung watch`

Start the jung ingestion daemon. Runs in the background by default (detached process) or in the foreground with `--no-daemon`.

```bash
# Start in background (default)
jung watch
# → jung daemon started (PID 12345)
# → Watching: /path/to/project

# Run in foreground (useful for debugging)
jung watch --no-daemon

# Verbose logging (DEBUG level)
jung watch --verbose

# Foreground mode with verbose logging
jung watch --no-daemon --verbose
```

**Options:**

| Option | Description |
|--------|-------------|
| `--no-daemon` | Run in the foreground instead of detaching as a daemon. Useful for debugging, with log output going directly to the terminal. |
| `--verbose`, `-v` | Enable DEBUG-level logging. Shows detailed information about adapter discovery, file watching, and correlation. |

**Tips:**
- The daemon writes its PID to `.jung/daemon.pid` for process management
- On Windows, daemonization uses `DETACHED_PROCESS` via `subprocess.Popen`
- On POSIX systems, the classic double-fork pattern is used
- The daemon automatically creates checkpoints for resumable log streaming

---

#### `jung stop`

Stop the running jung daemon.

```bash
jung stop
# → jung daemon stopped.

# If no daemon is running:
# → No jung daemon is running.
```

**How it works:**
- Reads the PID from `.jung/daemon.pid`
- Sends SIGTERM (POSIX) or uses `taskkill /F /PID` (Windows)
- Removes the PID file after successful termination

---

#### `jung status`

Check whether the daemon is running, view the current branch, last commit,
uncommitted changes, and key store statistics.

```bash
jung status
# ┌─────────────────────────────┐
# │     jung Daemon        │
# │     Running                 │
# └─────────────────────────────┘
# Store: /path/to/project/.jung
# Current branch: main
# Last commit: cmt_2a7b0b6b — Refactor auth middleware
#   2026-07-16T09:18:53  |  +727/-6 lines  |  2 file(s)
#
# Working tree clean — no uncommitted changes.
#
# Store stats:  5 sessions  |  50 turns  |  6 changes  |  1 commits  |  1116.0 KB
```

**Output sections:**
- **Daemon status** — Running or Not running
- **Current branch** — Active jung branch
- **Last commit** — Most recent commit ID, message, timestamp, and change summary
- **Uncommitted changes** — List of uncommitted file changes with paths and line counts (or "working tree clean" if none)
- **Store stats** — Session, turn, change, and commit counts with database size

---

### 3. Browsing History

Commands for exploring captured sessions, turns, and file diffs.

---

#### `jung log`

List sessions and conversation turns. This is the primary command for browsing what jung has captured.

**Without arguments** — lists all sessions with summary information.

```bash
# List all sessions (default: 20 most recent)
jung log

# Show more sessions
jung log --limit 50

# Filter to sessions since a given date (ISO 8601)
jung log --since 2026-07-01

# Show full session details (includes turn examples and file paths)
jung log --verbose

# JSON output for programmatic use
jung log --json
```

**Session output columns:**
| Column | Description |
|--------|-------------|
| `ID` | First 12 characters of the session ID |
| `ExtRef` | External reference (IDE session identifier) |
| `IDE` | IDE type (e.g., antigravity, cursor) |
| `Date` | Session start date |
| `Turns` | Number of conversation turns |
| `Cost` | Total estimated cost in USD |

**With `--session`** — shows the conversation turns within a specific session.

```bash
# List turns in a session
jung log --session abc123

# Compact one-turn-per-line view
jung log --session abc123 --oneline

# Reddit-style threaded conversation view
jung log --session abc123 --thread

# Limit turns shown
jung log --session abc123 --limit 5
```

**Turn output columns:**
| Column | Description |
|--------|-------------|
| `ID` | First 12 characters of the turn ID |
| `Actor` | Who made the turn (user/agent/system) |
| `Model` | AI model used (for agent turns) |
| `Hash` | First 8 characters of the content hash |
| `Timestamp` | When the turn occurred |

**With `--oneline`** — compact format with actor, ID, model, and timestamp.

**With `--thread`** — full conversation content displayed in a threaded format with color-coded actors (blue for user, green for agent, purple for system).

```bash
# Filter turns by git commit SHA
jung log --commit a1b2c3d4e5f6
```

---

#### `jung show <turn-id>`

Display the full context of a single conversation turn, including metadata, content, artifacts, file changes with diffs, and token usage/cost.

```bash
# Show full turn context
jung show turn_002_def
```

**Output sections:**

1. **Turn Header** — Session ID, timestamp, actor (color-coded), model, IDE type
2. **Content Preview** — The conversation content (prompt for user turns, response for agent turns), truncated to 2000 characters
3. **Artifacts** — Any IDE-generated artifacts associated with this turn (task definitions, implementation plans, walkthroughs)
4. **Files Changed** — Table of file changes with path, line counts (+/-), change type (created/modified/deleted), and attribution
5. **File Diffs** — The actual diff output for each changed file (syntax-highlighted)
6. **Cost** — Token usage and cost breakdown by model

```bash
# Skip diff content (useful for quick reviews)
jung show turn_002_def --no-diff

# JSON output — all data in structured format
jung show turn_002_def --json
```

**Options:**

| Option | Description |
|--------|-------------|
| `turn_id` (required) | The turn ID (full or prefix) |
| `--json` | Output all data as structured JSON |
| `--no-diff` | Skip displaying diff content (still shows file change summary) |

**JSON output structure:**
```json
{
  "turn": { "id": "...", "actor": "...", "model": "...", ... },
  "session": { "id": "...", "ide": "...", ... },
  "changes": [{ "file_path": "...", "change_type": "...", ... }],
  "artifacts": [{ "artifact_type": "...", "version": 1, ... }],
  "usage": [{ "model": "...", "tokens_in": 100, "tokens_out": 200, "cost_usd": 0.0012 }]
}
```

---

#### `jung diff [turn-id...]`

Show file diffs associated with turns. Supports single turn, two-turn comparison, or session-level diff.

```bash
# Diff for a single turn (all changed files)
jung diff turn_002_def

# Filter diff to a specific file
jung diff turn_002_def --file src/auth.py

# Compare changes between two turns
jung diff turn_001_abc turn_003_ghi

# Show all diffs across an entire session
jung diff --session abc123
```

**Options:**

| Option | Description |
|--------|-------------|
| `turn` (argument) | One turn ID (show changes), two turn IDs (compare changes) |
| `--file PATH` | Filter to a specific file path |
| `--session ID` | Show diffs for all turns in a session |

**Single turn output:** Displays each changed file's path, change type (created/modified/deleted), line counts, attribution, and full unified diff.

**Two-turn comparison:** Displays a side-by-side comparison table for each file showing:
- Change type in each turn
- Lines added in each turn
- Lines removed in each turn

---

### 4. Attribution & Analysis

Commands for understanding who wrote what and how much it cost.

---

#### `jung blame <file>`

Shows which conversation turn produced each line of a file — like `git blame` but with AI attribution. For every line, you see the change type, author, date, and line content. Deleted lines (from recent changes that removed content) are shown by default in a separate section.

```bash
# Blame an entire file (shows current lines + deleted lines)
jung blame src/auth.py

# Check attribution of a specific line
jung blame src/auth.py --line 42

# Hide deleted lines from output
jung blame src/auth.py --no-deleted

# JSON output
jung blame src/auth.py --json
```

**Output columns:**
| Column | Description |
|--------|-------------|
| `Line` | Line number |
| `Type` | Change type: `C` (created), `A` (added/modified), `D` (deleted) |
| `Author` | Who wrote this line (user/agent), color-coded |
| `Date` | Date of the change |
| `Content` | First 60 characters of the line |

**Options:**

| Option | Description |
|--------|-------------|
| `file` (required, argument) | Path to the file to blame |
| `--line N` | Show attribution for a specific line number only |
| `--no-deleted` | Hide deleted lines from the output (shown by default) |
| `--json` | Output as structured JSON |

**How attribution works:**
1. jung reads the current file content
2. Uses git history and jung's change tracking to determine which turn last modified each line
3. Correlates changes to conversation turns using the correlation engine
4. Results are cached and computed from the stored change records

---

#### `jung cost`

Display token usage and cost summaries. Costs can be broken down by session, day, or AI model.

```bash
# Cost by session (default) — shows each session with token counts and cost
jung cost

# Cost by day — shows daily totals
jung cost --by day

# Cost by AI model — shows usage per model
jung cost --by model

# Filter to a specific month
jung cost --month 2026-07 --by day

# JSON output
jung cost --json
```

**Options:**

| Option | Description |
|--------|-------------|
| `--by {session,day,model}` | Group cost data by session, day, or model (default: session) |
| `--month YYYY-MM` | Filter to a specific calendar month (e.g., `2026-07`) |
| `--json` | Output as structured JSON |

**By session output:**
| Column | Description |
|--------|-------------|
| `ID` | Session ID (first 12 chars) |
| `Date` | Session start date |
| `Turns` | Number of turns in the session |
| `Tokens In` | Total input tokens |
| `Tokens Out` | Total output tokens |
| `Cost` | Estimated cost in USD |

**By day output:**
| Column | Description |
|--------|-------------|
| `Day` | Date |
| `Sessions` | Number of sessions on that day |
| `Turns` | Number of turns |
| `Tokens In` | Input tokens |
| `Tokens Out` | Output tokens |
| `Cost` | Cost in USD |

**By model output:**
| Column | Description |
|--------|-------------|
| `Model` | AI model name |
| `Turns` | Number of turns using this model |
| `Tokens In` | Input tokens |
| `Tokens Out` | Output tokens |
| `Cost` | Cost in USD |

**Cost estimation:**
- Usage data comes from `usage_records` stored with each turn
- Missing records are automatically estimated based on content length and model pricing
- Model pricing is configured in `.jung/config.yaml` under the `cost` section
- Estimates use the `default_model` setting when the exact model is unknown

---

### 5. Search & Discovery

#### `jung search <query>`

Full-text search across all captured conversation turns and artifacts using SQLite FTS5. Searches turn content and artifact summaries simultaneously by default.

```bash
# Search across both turns and artifacts (default)
jung search "login endpoint"

# Search only conversation turns
jung search "JWT" --type turns

# Search only artifacts (plans, walkthroughs, etc.)
jung search "rate limiting" --type artifacts

# Custom result limit
jung search "auth" --limit 50

# JSON output
jung search "refactor" --json
```

**Options:**

| Option | Description |
|--------|-------------|
| `query` (required, argument) | Search terms (multiple words are combined with OR) |
| `--limit N` | Maximum results to return (default: 20) |
| `--type {turns,artifacts,all}` | What to search: turns, artifacts, or both (default: all) |
| `--json` | Output as structured JSON |

**Turn results columns:**
| Column | Description |
|--------|-------------|
| `ID` | Turn ID (first 12 chars) |
| `Actor` | Who made the turn (color-coded) |
| `Model` | AI model used |
| `Summary` | First 80 characters of the matched content |

**Artifact results columns:**
| Column | Description |
|--------|-------------|
| `ID` | Artifact ID (first 12 chars) |
| `Type` | Artifact type (PLAN, WALKTHROUGH, TASK, etc.) |
| `Summary` | First 80 characters of the artifact content |

**Search syntax:**
- Multiple words are combined with OR logic (matches any term)
- Terms are quoted in the FTS5 query for exact matching
- Full SQLite FTS5 query syntax is supported

---

### 6. Configuration

#### `jung config`

View or modify the jung configuration stored in `.jung/config.yaml`. Supports reading, writing, and editing individual configuration values.

```bash
# Show full configuration as YAML
jung config

# Get a specific value using dotted key path
jung config --get daemon.check_interval
# → 1.0

# Set a value (auto-coerces types: bool, int, float, string)
jung config --set daemon.check_interval --value 2.0

# Set via inline KEY=VALUE pairs (multiple allowed)
jung config daemon.check_interval=2.0 cost.default_model=gemini-2.5-pro

# Open configuration in your $EDITOR
jung config --edit

# Output configuration as JSON
jung config --json
```

**Options:**

| Option | Description |
|--------|-------------|
| `key_value` (argument) | Inline KEY=VALUE pairs to set (e.g., `daemon.check_interval=2.0`) |
| `--get KEY` | Read the value of a specific configuration key |
| `--set KEY` | Set a specific configuration key (requires `--value`) |
| `--value VAL` | Value to use with `--set` |
| `--edit` | Open the configuration file in the system editor |
| `--json` | Output configuration as JSON instead of YAML |

**Value type coercion:**
- `"true"` / `"false"` → boolean
- `"null"` / `"none"` → None
- Numeric strings → int or float
- Everything else → string

**Configuration file location:** `.jung/config.yaml`

---

### 7. Export & Maintenance

#### `jung export`

Export all jung data (sessions, turns, changes, artifacts) to a portable format for external analysis, reporting, or backup.

```bash
# Export as JSON (full structured data)
jung export --format json

# Export as CSV (tabular turn data, good for spreadsheets)
jung export --format csv

# Export as human-readable summary text
jung export --format summary

# Specify output file path
jung export --format summary --output report.txt

# Pretty-print JSON output
jung export --format json --pretty

# Shorthand output path
jung export -o my-data.json
```

**Options:**

| Option | Description |
|--------|-------------|
| `--format {json,csv,summary}` | Export format (default: json) |
| `--output, -o PATH` | Output file path (default: `jung-export.<format>`) |
| `--pretty` | Pretty-print JSON output (indentation) |

**JSON export contents:**
- All sessions with metadata
- All turns with content, actor, model, timestamps
- All file changes with diffs
- All artifacts (plans, walkthroughs)
- Token usage and cost records

**CSV export contents:**
- One row per turn
- Columns: turn ID, session ID, actor, model, timestamp, summary, file changes summary

**Summary export contents:**
- Human-readable text with session and turn overview
- Total counts and cost summaries

---

#### `jung gc`

Garbage-collect orphaned blobs from the content-addressed blob store. Over time, blobs that are no longer referenced by any turn, change, or artifact can accumulate. This command scans all blobs and removes unreferenced ones.

```bash
# Dry run — preview what would be removed without deleting
jung gc --dry-run
# → 47 orphan(s) found (128.5 KB)
# → Run without --dry-run to remove them.

# Dry run with verbose output (shows each orphan hash)
jung gc --dry-run --verbose

# Actually remove orphaned blobs
jung gc
# → Removed 47 orphaned blobs (128.5 KB reclaimed)
```

**Options:**

| Option | Description |
|--------|-------------|
| `--dry-run` | Show what would be removed without actually deleting anything |
| `--verbose`, `-v` | Display the hash of each orphaned blob |

**How it works:**
1. Scans all blobs in the `objects/` directory
2. Queries the database for all referenced blob hashes (from turns, changes, artifacts)
3. Computes the difference — blobs in storage but not in the database
4. Reports orphan count and total reclaimable size
5. On actual run, removes orphan blobs from disk

---

### 8. Web Dashboard

#### `jung dashboard`

Launch a local web dashboard for exploring jung data through a browser interface. Built with FastAPI, Jinja2 templates, Tailwind CSS, and htmx for a responsive single-page-like experience.

```bash
# Launch on default host:port (http://127.0.0.1:8081)
jung dashboard

# Custom port
jung dashboard --port 9090

# Custom host and port
jung dashboard --host 0.0.0.0 --port 8080

# Open browser automatically after launch
jung dashboard --open
```

**Options:**

| Option | Default | Description |
|--------|---------|-------------|
| `--host` | `127.0.0.1` | Network interface to bind to. Use `0.0.0.0` to expose to network (no auth!) |
| `--port` | `8081` | Port number to listen on |
| `--open` | — | Automatically open the dashboard URL in the default browser |

**Dashboard pages:**

| Route | Description |
|-------|-------------|
| `GET /` | **Home** — Overview statistics (sessions, turns, changes, total cost) and list of recent turns |
| `GET /sessions` | **Sessions** — List all sessions with metadata and turn counts |
| `GET /sessions/{id}` | **Session Detail** — Full conversation thread for a session with all turns in order |
| `GET /turns/{id}` | **Turn Detail** — Complete turn context: content (rendered as Markdown), file changes with syntax-highlighted diffs, tool calls with inputs/outputs, token usage and cost |
| `GET /cost` | **Cost** — Interactive cost breakdowns by session, model, and day with charts |
| `GET /search?q=...` | **Search** — Full-text search across all turns and artifacts with result previews |
| `GET /blame` | **Blame** — File-level line attribution showing which turn and actor produced each line |
| `GET /blame/{path}` | **Blame** — Line attribution for a specific file path |
| `GET /commits` | **Commits** — Commit history listing all jung commits |
| `GET /commit` | **New Commit** — Create a commit from uncommitted changes with inline diff previews. Shows a warning banner if there are no changes to commit. |
| `GET /commits/{id}` | **Commit Detail** — Commit contents with tabs for original diff and diff vs current file on disk |
| `GET /branches` | **Branches** — Branch management (list, create, switch, delete, merge) |

**Security note:**
The dashboard has no built-in authentication. Binding to `0.0.0.0` exposes it to your entire network. Use with caution, and consider running behind a reverse proxy with authentication for team deployments.

---

### 9. Reports

#### `jung report`

Generate structured summaries of your jung data. Supports four report types: daily activity, weekly activity, cost breakdown, and overall store statistics.

```bash
# Daily activity report (last 14 days by default)
jung report --daily

# Daily report with custom range
jung report --daily --days 30

# Weekly activity report (last 8 weeks by default)
jung report --weekly

# Weekly report with custom range
jung report --weekly --weeks 12

# Cost breakdown by model and day
jung report --cost

# Cost for a specific month
jung report --cost --month 2026-07

# Overall store statistics
jung report --stats
```

**Options:**

| Option | Default | Description |
|--------|---------|-------------|
| `--daily` | — | Daily activity report (day-by-day breakdown) |
| `--weekly` | — | Weekly activity report (week-by-week breakdown) |
| `--cost` | — | Cost breakdown report by model and day |
| `--stats` | — | Overall store statistics |
| `--days` | `14` | Number of days to include in the daily report |
| `--weeks` | `8` | Number of weeks to include in the weekly report |
| `--month` | — | Month filter for cost report (YYYY-MM format) |

**Daily/Weekly report columns:**
| Column | Description |
|--------|-------------|
| `Day` / `Week` | Time period |
| `Sessions` | Number of sessions in that period |
| `Turns` | Total conversation turns |
| `Agent` | Turns made by the AI agent |
| `User` | Turns made by the human |
| `Tokens In` | Total input tokens |
| `Tokens Out` | Total output tokens |
| `Cost` | Total estimated cost in USD |
| `Changes` | Total file changes |

**Stats report output:**
```
jung Store Statistics
  Sessions:        5
  Turns:           23
  Changes:         67
  Tool calls:      15
  Models used:     2
  Actors:          2
  Tokens in:       12500
  Tokens out:      28300
  Total cost:      $0.0242
  First session:   2026-07-10T09:00:00
  Last session:    2026-07-15T16:30:00
```

**Example daily report:**
```
                          Daily Activity
┌────────────┬──────────┬───────┬───────┬──────┬───────────┬────────────┬─────────┬─────────┐
│ Day        │ Sessions │ Turns │ Agent │ User │ Tokens In │ Tokens Out │ Cost    │ Changes │
├────────────┼──────────┼───────┼───────┼──────┼───────────┼────────────┼─────────┼─────────┤
│ 2026-07-15 │ 2        │ 8     │ 5     │ 3    │ 4200      │ 8500       │ $0.0084 │ 12      │
│ 2026-07-14 │ 1        │ 4     │ 3     │ 1    │ 2100      │ 4200       │ $0.0042 │ 5       │
└────────────┴──────────┴───────┴───────┴──────┴───────────┴────────────┴─────────┴─────────┘
Total: 12 turns, 17 changes, $0.0126 cost
```

---

### 10. Git Integration

jung integrates with Git to create bidirectional links between your version control commits and the AI-assisted turns that produced them.

**How it works:**
- Each `Turn` has a `commit_sha` field
- After installing the post-commit hook, turns are automatically tagged with the current commit SHA after each `git commit`
- `jung log --commit <sha>` shows which turns led to a specific commit
- `jung blame` uses git history for accurate line-level attribution

---

#### `jung git install-hooks`

Install a Git post-commit hook that automatically tags jung turns with the commit SHA after every `git commit`.

```bash
jung git install-hooks
# → jung post-commit hook installed.
```

**What gets installed:**
- Script at `.git/hooks/post-commit`
- Runs `jung git post-commit` after each successful commit
- Finds any turns since the last commit and tags them with the new SHA

**Workflow:**
```bash
jung git install-hooks
git commit -m "Add authentication"
# → Tagged 3 turns with commit abc123
jung log --commit abc123
# → Shows the 3 turns that led to this commit
```

---

#### `jung git uninstall-hooks`

Remove the previously installed Git post-commit hook.

```bash
jung git uninstall-hooks
# → jung post-commit hook removed.
```

---

#### `jung git post-commit`

Run the post-commit logic manually. Called automatically by the installed Git hook, but can be run directly for testing or recovery.

```bash
jung git post-commit
```

---

### 11. Adapters

The adapter system connects jung to different AI coding assistants. Each adapter implements the `AdapterPlugin` protocol to discover and stream conversation data from a specific IDE.

#### `jung adapter list`

List all discovered adapter plugins with their capabilities.

```bash
jung adapter list
# ┌──────────────┬──────────────┐
# │ Name         │ Capabilities │
# ├──────────────┼──────────────┤
# │ antigravity  │ discover, stream, parse_event │
# │ cursor       │ discover, stream, parse_event │
# └──────────────┴──────────────┘
```

**Built-in adapters:**

| Adapter | IDE | Data Source | Status |
|---------|-----|-------------|--------|
| Antigravity | Google Gemini Antigravity | `~/.gemini/antigravity/brain/<id>/.system_generated/logs/*.jsonl` | Production |
| Cursor | Cursor IDE | `~/.cursor/` or `%APPDATA%/Cursor/` sessions | Beta |

**Adapter Protocol:**

```python
class AdapterPlugin:
    name: str                          # Unique adapter name
    ide_name: str                      # IDE identifier

    def discover(repo_root) -> list[SessionRef]
    def stream(session_ref, checkpoint) -> Iterator[NormalizedEvent]
    def parse_event(raw) -> NormalizedEvent | None
    def capabilities() -> set[str]
```

To create a custom adapter, implement this protocol and register it in `jung.adapter.loader.BUILTIN_ADAPTERS`.

---

### 12. Remote Sync

The remote sync feature allows sharing jung data across machines or with team members via a remote server.

#### `jung remote init <url>`

Configure a remote sync server URL and optional authentication token.

```bash
# Configure remote server
jung remote init https://jung.example.com

# With authentication token
jung remote init https://jung.example.com --token your-auth-token
```

**Options:**

| Option | Description |
|--------|-------------|
| `url` (required, argument) | Remote server URL (e.g., `https://jung.example.com`) |
| `--token TOKEN` | Authentication token for the remote server |

**Storage:** The remote URL and token are stored in `.jung/config.yaml` under the `remote` key.

---

#### `jung remote push`

Upload local sessions to the configured remote server.

```bash
# Push all local sessions
jung remote push --all

# Push specific sessions
jung remote push session_abc session_def
```

**Options:**

| Option | Description |
|--------|-------------|
| `session_ids` (argument) | Specific session IDs to push |
| `--all` | Push all local sessions to the remote |

**What gets pushed:**
- Session metadata (ID, IDE, timestamps)
- All turns with their content
- File changes with diffs
- Artifacts (plans, walkthroughs)
- Token usage and cost records

---

#### `jung remote pull`

Download sessions from the remote server to the local store.

```bash
# Pull all remote sessions
jung remote pull --all

# Pull specific session with overwrite
jung remote pull session_abc --overwrite
```

**Options:**

| Option | Description |
|--------|-------------|
| `session_ids` (argument) | Specific session IDs to pull |
| `--all` | Pull all sessions from the remote server |
| `--overwrite` | Overwrite existing local sessions (default: skip) |

---

#### `jung remote ls`

List sessions available on the remote server.

```bash
jung remote ls
# ┌────────────────────────────────┬──────────┬────────────┬──────────┐
# │ ID                            │ IDE      │ Date       │ Turns    │
# ├────────────────────────────────┼──────────┼────────────┼──────────┤
# │ session_abc123                │ antigravity │ 2026-07-15 │ 8        │
# │ session_def456                │ antigravity │ 2026-07-14 │ 5        │
# └────────────────────────────────┴──────────┴────────────┴──────────┘
```

---

### 13. Interactive REPL

#### `jung interactive`

Start an interactive REPL (Read-Eval-Print Loop) for browsing jung data without typing the `jung` prefix before every command. Uses `prompt_toolkit` for a rich terminal experience with tab completion, history, and keyboard shortcuts.

```bash
jung interactive
# ┌────────────────────────────────────┐
# │         jung Interactive      │
# │                                    │
# │ Type help for commands, exit to    │
# │ quit. Tab-completion enabled.      │
# └────────────────────────────────────┘
jung> log
jung> show turn_002_def
jung> search "login endpoint"
jung> diff turn_001_abc turn_003_ghi
jung> cost --by model
jung> blame src/auth.py --line 42
jung> help
jung> exit
```

**Available commands within the REPL:**

| Command | Description |
|---------|-------------|
| `log [--session <id>] [--limit N] [--oneline] [--commit <sha>] [--since <date>] [--json] [--verbose] [--thread]` | List sessions or turns |
| `show <turn-id> [--json] [--no-diff]` | Show full turn context |
| `diff <turn-id> or diff <id1> <id2> [--file <path>] [--session <id>]` | Show file diffs |
| `search <query> [--limit N] [--type turns\|artifacts\|all] [--json]` | Full-text search |
| `cost [--by session\|day\|model] [--month YYYY-MM] [--json]` | Cost summaries |
| `blame <file> [--line N] [--json]` | Line-level attribution |
| `export [--format json\|csv\|summary] [--output <path>] [--pretty]` | Export data |
| `help` | Show help text |
| `exit` or `quit` | Exit the REPL |

**Features:**
- **Tab completion** — Auto-completes commands and turn IDs (press Tab)
- **Command history** — Persistent history across sessions (`~/.jung/history`)
- **Ctrl+D** — Exit the REPL
- **Ctrl+L** — Clear the screen
- **Keyboard navigation** — Arrow keys for command history browsing

---

### 14. Timeline

#### `jung timeline`

Show file changes grouped by day with a breakdown of created, modified, and deleted files. Each day shows the number of files affected, their names, and the total change activity.

```bash
# Show timeline for last 30 days (default)
jung timeline

# Custom time range
jung timeline --days 7

# Longer view
jung timeline --days 90

# JSON output
jung timeline --json
```

**Options:**

| Option | Default | Description |
|--------|---------|-------------|
| `--days N` | `30` | Number of days to include in the timeline |
| `--json` | — | Output as structured JSON |

**Output columns:**
| Column | Description |
|--------|-------------|
| `Day` | Calendar date |
| `Changes` | Total file changes on that day |
| `Created` | Files created (shown in green with +) |
| `Modified` | Files modified (shown in yellow with ~) |
| `Deleted` | Files deleted (shown in red with -) |
| `Files` | Unique files affected |
| `Affected Files` | Preview of file paths changed |

---

### 15. Version Control

jung includes a lightweight version control system built on top of its change tracking. Use `jung status` to see the current state, then **commit** (snapshot all tracked changes), **revert** files or individual lines, manage **branches** for parallel work, or **merge** branches together — all within the jung store.

These operations are independent of Git: they use jung's own `commits` and `branches` database tables to record history. This is useful when you want to checkpoint AI-driven work without committing to Git, or when you want a higher-level view of "AI-assisted development commits" that may span multiple Git commits.

---

#### `jung commit`

Create a commit from all uncommitted (tracked) changes. If no `-m` message is provided, an auto-generated message is created based on the files changed and line counts.

```bash
# Create a commit with auto-generated message
jung commit
# → Committed as cmt_2a7b0b6b
#   Branch:    main
#   Message:   src/auth.py: +15/-3; src/db.py: created (+42)
#   Changes:   +57/-3 across 2 files

# Create a commit with custom message
jung commit -m "Refactor auth middleware"
# → Committed as cmt_3b8c1c7c
#   Branch:    main
#   Message:   Refactor auth middleware
#   Changes:   +12/-8 across 1 file

# When there are no uncommitted changes
jung commit
# → Nothing to commit
```

**Options:**

| Option | Description |
|--------|-------------|
| `-m, --message TEXT` | Commit message (auto-generated from diffs if omitted) |

---

#### `jung revert`

Revert a file to a previous state, or revert a specific line to its previous content.

```bash
# Revert file to its previous version
jung revert src/auth.py
# → Reverted src/auth.py

# Revert file to a specific commit's version
jung revert src/auth.py --commit cmt_2a7b0b6b
# → Reverted src/auth.py

# Revert a single line to its previous content
jung revert src/auth.py --line 42
# → Reverted line 42 in src/auth.py
```

**Options:**

| Option | Description |
|--------|-------------|
| `file` (required) | Path to the file to revert |
| `--line N` | Revert a specific line number instead of the whole file |
| `--commit ID` | Revert to the file's state at a specific jung commit |

---

#### `jung branch`

Manage branches: list, create, switch, and delete branches within the jung store.

```bash
# List all branches (current branch marked with *)
jung branch --list
# →   | Name | Commit           | Created
#   * | main | cmt_2a7b0b6b | 2026-07-16T09:18:53

# Create and switch to a new branch
jung branch feature-x --switch

# Switch to an existing branch
jung branch main --switch

# Delete a branch (must not be current)
jung branch feature-x --delete
```

**Options:**

| Option | Description |
|--------|-------------|
| `name` (argument) | Branch name to create, switch to, or delete |
| `--switch, -s` | Switch to the named branch after creating it |
| `--delete, -d` | Delete the named branch |
| `--list, -l` | List all branches |

---

#### `jung merge`

Merge a source branch into the current branch. Creates a merge commit with two parents — the current branch's HEAD and the source branch's HEAD.

```bash
# Merge feature-x into current branch (auto-generated message)
jung merge feature-x
# → Merged feature-x into main

# Merge with custom message
jung merge feature-x -m "Integrate authentication feature"
```

**Options:**

| Option | Description |
|--------|-------------|
| `branch` (required) | Source branch name to merge into the current branch |
| `-m, --message TEXT` | Merge commit message (auto-generated if omitted) |

---

#### `jung status`

Show the current state of the jung store: daemon status, active branch, last commit, any uncommitted changes, and store statistics.

```bash
jung status
# ┌─────────────────────────────┐
# │     jung Daemon        │
# │     Running                 │
# └─────────────────────────────┘
# Store: /path/to/project/.jung
# Current branch: main
# Last commit: cmt_2a7b0b6b — Refactor auth middleware
#   2026-07-16T09:18:53  |  +727/-6 lines  |  2 file(s)
#
# Working tree clean — no uncommitted changes.
#
# Store stats:  5 sessions  |  50 turns  |  6 changes  |  1 commits  |  1116.0 KB
```

See the full [jung status](#jung-status) reference under Daemon Lifecycle for details.

---

## Configuration

jung is configured via `.jung/config.yaml` (YAML). Defaults are baked into the application and merged with any user overrides. You can view and modify the configuration at runtime using `jung config`.

### Default Configuration

```yaml
version: 1

adapters:
  antigravity:
    enabled: true
    brain_path: ~/.gemini/antigravity/brain/
  cursor:
    enabled: false
  claude_code:
    enabled: false

watcher:
  enabled: true
  ignore_patterns:
    - .git/**
    - .jung/**
    - node_modules/**
    - __pycache__/**
    - "*.pyc"
    - .venv/**
    - .env
    - .DS_Store
    - "*.log"
    - dist/**
    - build/**
  coalesce_window_ms: 200

correlation:
  window_ms: 8000        # Time window to match tool calls to file changes
  user_window_ms: 60000  # Time window to attribute unmatched changes to a user turn

cost:
  enabled: true
  default_model: gemini-2.5-flash
  models:
    gemini-2.5-pro:
      input_per_million: 1.25
      output_per_million: 5.00
    gemini-2.5-flash:
      input_per_million: 0.10
      output_per_million: 0.40
    claude-sonnet-4:
      input_per_million: 3.00
      output_per_million: 15.00
    default:
      input_per_million: 2.00
      output_per_million: 8.00

git:
  auto_commit: false
  commit_message_template: "{{summary}} (jung turn {{turn_id}})"

daemon:
  log_level: info
  checkpoint_interval_ms: 5000
```

### Configuration Sections

#### `adapters`

Controls which IDE adapters are enabled and their data source paths. Each adapter can be independently enabled or disabled.

| Key | Default | Description |
|-----|---------|-------------|
| `adapters.antigravity.enabled` | `true` | Enable Gemini Antigravity discovery |
| `adapters.antigravity.brain_path` | `~/.gemini/antigravity/brain/` | Path to Antigravity brain directory |
| `adapters.cursor.enabled` | `false` | Enable Cursor IDE discovery |
| `adapters.claude_code.enabled` | `false` | Enable Claude Code discovery |

#### `watcher`

Controls the filesystem watcher that detects file changes and correlates them to conversation turns.

| Key | Default | Description |
|-----|---------|-------------|
| `watcher.enabled` | `true` | Enable or disable filesystem watching entirely |
| `watcher.ignore_patterns` | `[".git/**", ".jung/**", ...]` | Glob patterns for files and directories to ignore |
| `watcher.coalesce_window_ms` | `200` | Debounce window for rapid successive file writes in milliseconds. Reduces noise from editor auto-save. |

#### `correlation`

Controls how the correlation engine matches file changes to conversation turns.

| Key | Default | Description |
|-----|---------|-------------|
| `correlation.window_ms` | `8000` | Maximum time gap (ms) between a tool call and a file change for agent attribution. If an agent's tool call and a file change occur within this window, the change is attributed to that turn. |
| `correlation.user_window_ms` | `60000` | Maximum time gap (ms) for attributing file changes to the nearest user turn when no agent activity is detected. |

#### `cost`

Controls cost estimation and model pricing.

| Key | Default | Description |
|-----|---------|-------------|
| `cost.enabled` | `true` | Enable or disable cost tracking |
| `cost.default_model` | `gemini-2.5-flash` | Default model name used for cost estimation when the actual model cannot be determined |
| `cost.models` | (see above) | Per-model pricing: `input_per_million` and `output_per_million` (USD per million tokens) |

**Adding a custom model:**
```yaml
cost:
  models:
    my-custom-model:
      input_per_million: 2.00
      output_per_million: 10.00
```

#### `daemon`

Controls the ingestion daemon's behavior.

| Key | Default | Description |
|-----|---------|-------------|
| `daemon.log_level` | `info` | Daemon log level. Can be `debug`, `info`, `warning`, or `error`. |
| `daemon.checkpoint_interval_ms` | `5000` | How often (ms) the daemon saves streaming checkpoints for resumable log processing. |

#### `git`

Controls git integration behavior.

| Key | Default | Description |
|-----|---------|-------------|
| `git.auto_commit` | `false` | Automatically create git commits for turns (experimental) |
| `git.commit_message_template` | `"{{summary}} (jung turn {{turn_id}})"` | Template for auto-generated commit messages. Supports `{{summary}}` and `{{turn_id}}` placeholders. |

### Complete Settings Reference

| Key | Default | Type | Description |
|-----|---------|------|-------------|
| `adapters.antigravity.enabled` | `true` | bool | Enable Antigravity adapter |
| `adapters.antigravity.brain_path` | `~/.gemini/antigravity/brain/` | string | Antigravity data directory |
| `adapters.cursor.enabled` | `false` | bool | Enable Cursor adapter |
| `adapters.claude_code.enabled` | `false` | bool | Enable Claude Code adapter |
| `watcher.enabled` | `true` | bool | Enable filesystem watching |
| `watcher.coalesce_window_ms` | `200` | int | File change debounce (ms) |
| `watcher.ignore_patterns` | (list) | list | Glob patterns to ignore |
| `correlation.window_ms` | `8000` | int | Agent attribution window (ms) |
| `correlation.user_window_ms` | `60000` | int | User attribution window (ms) |
| `cost.enabled` | `true` | bool | Enable cost tracking |
| `cost.default_model` | `gemini-2.5-flash` | string | Fallback model for cost estimation |
| `daemon.log_level` | `info` | string | Daemon logging level |
| `daemon.checkpoint_interval_ms` | `5000` | int | Checkpoint interval (ms) |
| `git.auto_commit` | `false` | bool | Auto-commit mode |
| `git.commit_message_template` | (template) | string | Commit message template |

---

## Web Dashboard

The web dashboard provides a rich browser-based UI for exploring all your jung data without touching the terminal. Built with FastAPI (backend), Jinja2 templates (server-side rendering), Tailwind CSS (styling), and htmx (dynamic updates without full page reloads).

### Starting the Dashboard

```bash
# Default — http://127.0.0.1:8081
jung dashboard

# Custom port
jung dashboard --port 9090

# Open browser automatically
jung dashboard --open

# Bind to all interfaces (⚠️ no authentication)
jung dashboard --host 0.0.0.0
```

### Routes

#### `/` — Home
Overview statistics showing total sessions, turns, file changes, and cost. Includes a list of the most recent turns for quick access.

#### `/sessions` — Sessions List
Table of all captured sessions with their ID, IDE type, start date, turn count, and total cost. Click through to view any session's detail.

#### `/sessions/{id}` — Session Detail
Full conversation thread for a session. Shows all turns in chronological order with actor badges (user/agent), model info, and content previews.

#### `/turns/{id}` — Turn Detail
Complete turn context including:
- **Content** — Full conversation turn content rendered as Markdown
- **Changes** — List of files changed with syntax-highlighted unified diffs
- **Tool Calls** — Tool invocations with input/output details
- **Cost** — Token usage breakdown by model with dollar amounts

#### `/cost` — Cost Analysis
Interactive cost breakdowns with multiple views:
- By session — which sessions cost the most
- By model — which AI models are being used and their costs
- By day — daily cost trends

#### `/timeline` — File Change Timeline
Day-by-day breakdown of file changes showing created, modified, and deleted files with affected file names and totals.

#### `/search?q=...` — Search
Full-text search across all turns and artifacts with result previews and links to turn details.

#### `/blame/{path}` — Blame
File-level line attribution for any tracked file, showing which turn and actor produced each line.

### Technology Stack

| Component | Technology |
|-----------|------------|
| Backend framework | FastAPI |
| Templating | Jinja2 |
| CSS | Tailwind CSS (CDN) |
| Dynamic updates | htmx |
| ASGI server | uvicorn |

### Security

⚠️ The dashboard has no authentication. When binding to `127.0.0.1` (default), only local processes can connect. When binding to `0.0.0.0`, it is accessible to anyone on your network. For team deployments, run behind a reverse proxy (nginx, Caddy) with authentication.

---

## Reports

The reporting system provides structured summaries of your jung data for understanding development activity patterns and costs.

### Report Types

| Type | Command | Description | Options |
|------|---------|-------------|---------|
| Daily | `jung report --daily` | Day-by-day activity for the last N days (default: 14) | `--days N` |
| Weekly | `jung report --weekly` | Week-by-week activity for the last N weeks (default: 8) | `--weeks N` |
| Cost | `jung report --cost` | Cost breakdown by model and day for optional month | `--month YYYY-MM` |
| Stats | `jung report --stats` | Overall store statistics (all-time totals) | None |

### Daily Report

Shows activity broken down by day, including session count, turn count (agent vs user), token usage, cost, and file changes. Useful for tracking daily development velocity.

```bash
jung report --daily
jung report --daily --days 30
```

**Columns:**
| Column | Description |
|--------|-------------|
| Day | Calendar date |
| Sessions | Number of IDE sessions started that day |
| Turns | Total conversation turns |
| Agent | Turns made by the AI agent(s) |
| User | Turns made by the human developer |
| Tokens In | Total input tokens consumed |
| Tokens Out | Total output tokens generated |
| Cost | Estimated cost in USD |
| Changes | Number of file changes made |

### Weekly Report

Same metrics as the daily report but aggregated by week (ISO week numbers). Useful for higher-level trend analysis.

```bash
jung report --weekly
jung report --weekly --weeks 12
```

### Cost Report

Detailed cost breakdown showing:
- **Cost by model** — How much each AI model contributed to total cost, with turn counts and token volumes
- **Cost by day** — Daily cost totals for the selected month

```bash
jung report --cost
jung report --cost --month 2026-07
```

### Stats Report

All-time overview of the jung store. Shows total counts and summary statistics.

```bash
jung report --stats
```

**Output:**
```
jung Store Statistics
  Sessions:        5
  Turns:           23
  Changes:         67
  Tool calls:      15
  Models used:     2
  Actors:          2
  Tokens in:       12500
  Tokens out:      28300
  Total cost:      $0.0242
  First session:   2026-07-10T09:00:00
  Last session:    2026-07-15T16:30:00
```

---

## Adapters

jung supports multiple AI coding assistants through a plugin-based adapter system. Each adapter knows how to discover, read, and parse conversation data from a specific IDE's log files.

### Built-in Adapters

| Adapter | IDE | Data Source | Status |
|---------|-----|-------------|--------|
| Antigravity | Google Gemini Antigravity | `~/.gemini/antigravity/brain/<id>/.system_generated/logs/*.jsonl` | Production |
| Cursor | Cursor IDE | `~/.cursor/` or `%APPDATA%/Cursor/` sessions | Beta |

### How Adapters Work

1. **Discovery** — On startup, each adapter scans the filesystem for IDE session logs
2. **Streaming** — Adapters read log files incrementally, yielding normalized events
3. **Checkpointing** — Byte offsets are saved so streaming can resume from where it left off
4. **Normalization** — Each adapter converts IDE-specific log formats into jung's `NormalizedEvent` schema

### Adapter Protocol

All adapters implement the `AdapterPlugin` protocol:

```python
class AdapterPlugin:
    name: str                          # Unique adapter name (e.g., "antigravity")
    ide_name: str                      # IDE identifier (e.g., "antigravity")

    def discover(repo_root) -> list[SessionRef]
    def stream(session_ref, checkpoint) -> Iterator[NormalizedEvent]
    def parse_event(raw) -> NormalizedEvent | None
    def capabilities() -> set[str]
```

### Creating a Custom Adapter

To add support for a new AI coding assistant:

1. Create a new module in `jung/adapter/`
2. Implement the `AdapterPlugin` protocol
3. Register the adapter class in `jung.adapter.loader.BUILTIN_ADAPTERS`

```python
from jung.adapter.protocol import AdapterPlugin, SessionRef, NormalizedEvent

class MyCustomAdapter(AdapterPlugin):
    name = "my-ide"
    ide_name = "My IDE"

    def discover(self, repo_root: str) -> list[SessionRef]:
        # Find session logs on disk
        ...

    def stream(self, session_ref: SessionRef, checkpoint: dict) -> Iterator[NormalizedEvent]:
        # Read log files and yield events
        ...

    def parse_event(self, raw: dict) -> NormalizedEvent | None:
        # Convert raw log entry to normalized event
        ...

    def capabilities(self) -> set[str]:
        return {"discover", "stream", "parse_event"}
```

---

## Git Integration

jung integrates with Git to create a bidirectional link between your version history and the AI-assisted conversation turns that produced each change.

### What's Linked

| Git Concept | jung Concept | How They're Linked |
|-------------|-------------------|-------------------|
| Commit | Turns | Each Turn has a `commit_sha` field, set by the post-commit hook |
| Diff | Changes | Each file change records the git diff hash and line counts |
| Blame | Attribution | The blame command uses git history to trace lines to turns |

### Post-Commit Hook

When a post-commit hook is installed, the flow after each `git commit` is:

1. Git runs the post-commit hook
2. The hook calls `jung git post-commit`
3. jung gets the new commit SHA
4. It finds any turns since the last commit (by timestamp)
5. It tags those turns with the commit SHA
6. All these turns now appear in `jung log --commit <sha>`

```bash
jung git install-hooks
git commit -m "Add authentication"
# → Tagged 3 turns with commit abc123
jung log --commit abc123
# → Shows the 3 turns that led to this commit
```

### Commands

| Command | Description |
|---------|-------------|
| `jung git install-hooks` | Install `.git/hooks/post-commit` script |
| `jung git uninstall-hooks` | Remove the post-commit hook |
| `jung git post-commit` | Run post-commit logic manually |

### Benefits

- **Reproducibility** — For any commit, see the full conversation that produced it
- **Attribution** — Know which changes in a commit were agent-driven vs human-edited
- **Auditing** — Review the reasoning and planning behind every code change

### Technical Details

- jung never writes to Git's object database or modifies commits
- The hook is a simple shell script that invokes `jung git post-commit`
- Turn-to-commit matching uses timestamp correlation (turns whose timestamps fall between the previous and current commit)
- The `blame` command uses both git history and jung's change records for accurate line attribution

---

## Daemon

The daemon is the core ingestion engine of jung. It runs as a persistent background process that continuously monitors IDE activity and filesystem changes, correlating them into a rich, queryable history.

### Responsibilities

The daemon orchestrates four major subsystems:

1. **Adapter Streaming** — Discovers IDE sessions via configured adapters and streams conversation events (messages, tool calls, artifact changes). Each adapter reads IDE-specific log files and normalizes them into jung's event schema.

2. **File System Watching** — Monitors the repository for file changes using OS-level file system notifications. Detects creates, modifications, and deletes in configured watch directories.

3. **Correlation** — Matches file changes to conversation turns using configurable timestamp windows. Agent-attributed changes are matched within a narrow window (default: 8 seconds), while user-attributed changes use a wider window (default: 60 seconds).

4. **Storage** — Writes everything to two stores:
   - **SQLite Index** (`.jung/index.db`) — Metadata, relationships, full-text search
   - **Blob Store** (`.jung/objects/`) — Content-addressed storage for conversation content, diffs, and artifacts

### Lifecycle Commands

| Command | Action |
|---------|--------|
| `jung watch` | Start daemon in background (detached process) |
| `jung watch --no-daemon` | Start daemon in foreground (for debugging) |
| `jung status` | Check if daemon is running and view stats |
| `jung stop` | Stop the running daemon |

### Data Flow

```
┌──────────────┐    ┌──────────┐    ┌─────────────────────┐
│ IDE Log Files│───→│ Adapter  │───→│ NormalizedEvent Queue│
│              │    │ Plugins  │    │                     │
│ .jsonl / .db │    │          │    │ Messages, Tool Calls │
└──────────────┘    └──────────┘    └──────────┬──────────┘
                                               │
┌──────────────┐    ┌──────────┐    ┌──────────┴──────────┐
│ File System  │───→│ Watcher  │───→│  FileChange Queue   │
│              │    │          │    │                     │
│ src/ changes │    │ Watchdog │    │ Creates, Modifies   │
└──────────────┘    └──────────┘    └──────────┬──────────┘
                                               │
                                    ┌──────────┴──────────┐
                                    │ Correlation Engine   │
                                    │                      │
                                    │ Timestamp windows    │
                                    │ Match tool calls ↔  │
                                    │ file changes         │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────┴──────────┐
                                    │                     │
                              ┌─────┴─────┐       ┌──────┴──────┐
                              │ SQLite    │       │ Blob Store  │
                              │ Index     │       │             │
                              │           │       │ SHA-256     │
                              │ Sessions  │       │ addressed   │
                              │ Turns     │       │ content     │
                              │ Changes   │       │ store       │
                              │ Usage     │       │             │
                              │ FTS5      │       │ diffs,      │
                              │           │       │ artifacts   │
                              └───────────┘       └─────────────┘
```

### Checkpointing

The daemon saves byte-offset checkpoints for each IDE log file it streams. If the daemon is restarted, it resumes from where it left off rather than re-processing already-ingested data. Checkpoint interval is configurable via `daemon.checkpoint_interval_ms` (default: 5 seconds).

### Daemon Process Management

| Feature | POSIX | Windows |
|---------|-------|---------|
| Daemonization | Double-fork with `/dev/null` redirection | `subprocess.Popen` with `DETACHED_PROCESS` |
| Signal handling | `SIGTERM`, `SIGINT` | `SIGTERM`, `SIGINT`, `SIGBREAK` |
| Process termination | `os.kill(pid, signal.SIGTERM)` | `taskkill /F /PID` |
| PID file | `.jung/daemon.pid` | `.jung/daemon.pid` |

---


## Development

### Setup

```bash
# Clone and install with dev dependencies
git clone https://github.com/jung/jung.git
cd jung
pip install -e ".[dev]"
```

### Running Tests

The test suite contains 45+ tests covering all major components.

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_cli.py

# Run tests by keyword
pytest -k "search or blame"

# Run with coverage report
pytest --cov=jung --cov-report=html
```

### Linting

```bash
# Ruff linter
ruff check src/ tests/

# Ruff formatter
ruff format src/ tests/

# Type checking with mypy
mypy src/
```

### Contribution Guidelines

1. **Code style** — Follow the existing code style. Run `ruff check` before committing.
2. **Type hints** — All functions should have type annotations. Run `mypy` to verify.
3. **Tests** — New features should include tests. Aim to maintain or improve coverage.
4. **Adapters** — New IDE adapters should implement the `AdapterPlugin` protocol.
5. **Documentation** — CLI changes should include updated help text and README entries.

---

## Platform Notes

jung is designed to work seamlessly across Windows, Linux, and macOS, with platform-specific implementations for daemonization and process management.

### Windows

| Feature | Implementation |
|---------|---------------|
| Daemonization | `subprocess.Popen` with `DETACHED_PROCESS` flag (no `os.fork()` available) |
| Signal handling | `SIGTERM`, `SIGINT`, and `SIGBREAK` handlers registered |
| Daemon stop | Uses `taskkill /F /PID` for forceful process termination |
| PID check | `os.kill(pid, 0)` wrapped in try/except (raises `OSError` on non-existent process) |
| SQLite WAL mode | Disabled by default — Windows has cross-connection visibility issues with WAL files |
| Watcher | Uses `ReadDirectoryChangesW` via the `watchdog` library |
| Path separator | Uses `os.sep` / `pathlib` for cross-platform path handling |
| Config editor | Defaults to `notepad.exe` if `$EDITOR` is not set |

### POSIX (Linux/macOS)

| Feature | Implementation |
|---------|---------------|
| Daemonization | Classic double-fork pattern with `/dev/null` redirection for stdin/stdout/stderr |
| Signal handling | `SIGTERM` and `SIGINT` handlers registered for graceful shutdown |
| Daemon stop | `os.kill(pid, signal.SIGTERM)` for clean process termination |
| PID check | `os.kill(pid, 0)` — raises `ProcessLookupError` if process doesn't exist |
| SQLite WAL mode | Available but disabled by default for consistency with Windows |
| Watcher | Uses `inotify` (Linux) or `FSEvents` (macOS) via the `watchdog` library |
| Config editor | Uses `$EDITOR` environment variable, falls back to `nano` or `vim` |

### Cross-Platform Consistency

- All data storage formats (SQLite schema, blob store layout, config YAML) are identical across platforms
- The `.jung/` directory structure is platform-independent
- CLI behavior is identical across platforms
- The web dashboard works on all platforms (Python FastAPI + uvicorn)
- Remote sync is platform-agnostic (HTTP-based)

---

## License

MIT
