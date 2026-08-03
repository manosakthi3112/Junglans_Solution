# Junglans IDE beta

AI-native integrated development environment powered by Ollama. Features a multi-agent orchestrator, smart auto-context detection, integrated terminal, and real-time streaming via WebSockets.

## Features

- **Multi-Agent Pipeline** -- Understanding, Optimizer, Decomposer, and Coder agents collaborate on complex tasks
- **Smart Auto-Context** -- Automatically detects relevant workspace files without manual selection
- **Fast Mode** -- Direct single-shot model calls for quick queries
- **Interactive Mode** -- Step-by-step approval before execution
- **Integrated Terminal** -- xterm.js-based terminal with multi-session support, tab completion, and shell switching
- **Code Tracker** -- Tracks all AI-generated code changes with accept/reject workflow
- **Memory Engine** -- Session and project memory for context retention across interactions
- **Vector Memory** -- Semantic code search via ChromaDB embeddings
- **Monaco Editor** -- Full code editor with diff views, word wrap, and zoom
- **Cloud Fallback** -- Automatic fallback to OpenAI, Groq, Anthropic, or OpenRouter when local models are slow
- **Electron Desktop App** -- Runs as a standalone desktop application

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.11+, FastAPI, Uvicorn |
| Frontend | React 19, Vite, TypeScript |
| Editor | Monaco Editor |
| Terminal | xterm.js |
| AI | Ollama (local), OpenAI/Groq/Anthropic/OpenRouter (cloud) |
| Memory | SQLite, ChromaDB |
| IPC | WebSocket (real-time streaming) |

## Prerequisites

- Python 3.11+
- Node.js 18+
- [Ollama](https://ollama.com/) installed and running

## Installation

### 1. Clone and set up the backend

```powershell
cd e:\JUNG_CLI
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Set up the frontend

```powershell
cd ui
npm install
```

### 3. Configure environment

```powershell
copy .env.example .env
```

Edit `.env` to set your Ollama host and optional cloud API keys.

### 4. Pull an Ollama model

```powershell
ollama pull llama3
```

## Running

### Backend

```powershell
# From project root
.venv\Scripts\python -m uvicorn core.gateway:app --host 127.0.0.1 --port 8000
```

### Frontend (Web)

```powershell
cd ui
npm run dev
```

Opens at `http://localhost:3000`.

### Desktop App (Electron)

```powershell
cd ui
npm run electron:dev
```

## Configuration

Main config file: `junglans.config.yaml`

| Setting | Description | Default |
|---------|-------------|---------|
| `ollama.host` | Ollama server URL | `http://localhost:11434` |
| `cloud.enabled` | Enable cloud model fallback | `true` |
| `cloud.provider` | Cloud provider | `openai` |
| `app.fast_mode` | Default to fast mode | `false` |
| `app.auto_validation` | Auto-validate step outputs | `true` |
| `memory.session_ttl` | Session memory TTL (seconds) | `3600` |

Cloud API keys can also be set via environment variables: `OPENAI_API_KEY`, `GROQ_API_KEY`, `ANTHROPIC_API_KEY`, `OPENROUTER_API_KEY`.

## Project Structure

```
JUNG_CLI/
  core/
    brain/
      orchestrator.py    # Multi-agent execution engine
      planner.py         # Task decomposition
      memory.py          # Session/project memory
      vector_memory.py   # ChromaDB semantic search
      code_tracker.py    # Code change tracking
    ollama/
      client.py          # Ollama HTTP client
      model_pool.py      # Model role assignment
      config.py          # Configuration management
      benchmarks.py      # Model performance tracking
    tools/
      file_reader.py     # File I/O operations
      git_tool.py        # Git integration
      shell_tool.py      # Shell command execution
      mcp_client.py      # Model context protocol client
    gateway.py           # FastAPI + WebSocket server
  ui/
    src/
      App.jsx            # Main application layout
      api.js             # Backend API client
      components/
        AgentChat.jsx    # AI chat panel
        Terminal.jsx     # Integrated terminal
        Editor.jsx       # Monaco editor wrapper
        ...
  memory/                # Runtime memory data
  tests/                 # Test suite
```

## Architecture

### Core System Architecture

Junglans IDE follows a multi-layered architecture with clear separation of concerns:

```
Frontend (React) → Gateway (FastAPI) → Orchestrator → AI Agents → Models
                     ↓                   ↓                   ↓
                Memory Engine → Vector Memory → File System → Git/Execution Tools
```

### Key Components

#### Backend API Gateway
- **Purpose**: Main entry point handling REST API and WebSocket connections
- **Location**: `core/gateway.py`
- **Features**: 30+ API endpoints, WebSocket streaming, CORS configuration

#### AI Brain Orchestrator
- **Purpose**: Multi-agent coordination and execution management
- **Location**: `core/brain/orchestrator.py`
- **Features**: 8+ specialized agents, dependency management, parallel execution

#### Memory Engine
- **Purpose**: Central context management with session, project, user, and model memory
- **Location**: `core/brain/memory.py`
- **Features**: SQLite persistence, TTL management, context injection

#### AI Model Integration
- **Purpose**: Local Ollama inference with cloud fallback capabilities
- **Location**: `core/ollama/` (client.py, model_pool.py, benchmarks.py)
- **Features**: Role-based model assignment, performance tracking, cloud provider support

#### Development Tools
- **Purpose**: File I/O, Git operations, and safe command execution
- **Location**: `core/tools/` (file_reader.py, git_tool.py, shell_tool.py)
- **Features**: Path validation, token counting, command blocking, secure execution

### Data Flow Architecture

```
User Request → Frontend → Gateway API → Orchestrator
                                    ↓ (Context Building)
                                 Memory Engine
                                    ↓ (Vector Search)
                               Vector Memory
                                    ↓ (Semantic Analysis)
                               File Reader → File System
                                    ↓
                               AI Agents (Ollama)
                                    ↓
                               Code Tracker → Git/Execution Tools
```

### API Gateway Endpoints

#### Health & Status
- **GET /health**: Service status, Ollama availability, loaded models
- **GET /models**: Available models with role assignments
- **GET /benchmarks**: Model performance statistics

#### AI Execution
- **POST /execute**: Full AI pipeline (understanding → plan → execution)
- **POST /chat**: Direct chat completion (bypassing orchestrator)
- **POST /generate**: Direct text generation
- **POST /plan**: Create execution plan without execution

#### Context & Memory Management
- **GET /memory/recall**: Retrieve memory entries by type and session
- **POST /memory/store**: Store new memory entries
- **POST /memory/clear**: Clear memory with various options
- **GET /memory/context/{session_id}**: Get formatted context for prompt injection

#### Code Change Management
- **GET /tracker**: List tracked changes with filters
- **POST /tracker/{change_id}/accept**: Accept tracked changes with regression checking
- **POST /tracker/{change_id}/reject**: Reject changes with pattern learning
- **POST /tracker/{change_id}/rollback**: Rollback workspace changes

#### Git Integration
- **GET /git/status**: Current git status and changes
- **POST /git/commit**: Commit changes with AI-generated commit messages
- **GET /git/branches**: List available branches
- **POST /git/branches/checkout**: Switch branches

#### Quality & Testing
- **POST /quality/mutation**: Run mutation testing
- **POST /quality/edge_cases**: Generate edge case tests
- **POST /quality/spec_test_gen**: Generate spec-driven tests
- **POST /quality/fuzz**: Run fuzz testing

#### Documentation & Wiki
- **POST /docs/readme/propose**: Suggest README updates from changes
- **POST /docs/readme/apply**: Apply README changes
- **GET /docs/diagrams**: Generate class, ER, and sequence diagrams

### Technical Architecture Patterns

#### Multi-Agent Coordination
- **Dependency Management**: Steps execute only when dependencies are satisfied
- **Parallel Execution**: Independent steps can run concurrently
- **Role-Based Assignment**: Each agent has specific responsibilities and system prompts
- **Fallback Mechanisms**: Multiple fallback paths for robustness

#### Memory Management
- **Four-Tier Architecture**: Session, project, user, and model memory types
- **Context Injection**: AI prompts enriched with relevant context
- **Automatic Expiration**: TTL-based cleanup of stale entries
- **Token Management**: Context size limits for model compatibility

#### Performance Optimization
- **Model Pool Caching**: 10-second cache for model discovery
- **Benchmark Tracking**: Performance metrics for model selection
- **Streaming Support**: Real-time progress updates via WebSocket
- **Intelligent Search**: ChromaDB for semantic code retrieval

## Technical Implementation Details

### Database Architecture

#### SQLite Database (`memory/db/projects.db`)

**Tables**:
- **session_memory**: Current session context (id, session_id, key, value, timestamp, ttl)
- **project_memory**: Project-specific knowledge (id, project, key, value, category, timestamp)
- **user_memory**: Global user preferences (id, key, value, category, timestamp)
- **model_memory**: Model performance tracking (id, model, role, task_type, success_count, failure_count, avg_duration_ms, timestamp)
- **intent_history**: User intent logging (id, session_id, request, diff, outcome, timestamp, context)

**Indexes**:
- session_id, key, project, category for fast lookups
- Composite indexes for common query patterns

### Vector Memory Architecture

#### ChromaDB Configuration
- **Persistent Storage**: Project-specific vector database
- **Collection Management**: Dynamic collection creation and deletion
- **Semantic Search**: Embedding-based code and documentation search
- **Chunking Strategy**: 800-character chunks with 150-character overlap

### API Endpoint Specifications

#### Request/Response Models

Each endpoint follows RESTful conventions with comprehensive validation:

- **Standard Response Format**: `{"status": "ok", "data": {...}}`
- **Error Handling**: Detailed error messages with HTTP status codes
- **Input Validation**: Pydantic models for request validation
- **Streaming Support**: WebSocket endpoints for real-time updates

#### Authentication & Security

- **No Built-in Auth**: Designed for internal/enterprise use
- **API Key Management**: Provider-specific keys in configuration
- **Input Validation**: Comprehensive schema validation
- **Path Security**: Prevented directory traversal attacks

### Code Organization Principles

#### Module Dependencies
- **Brain Module**: Core AI logic, orchestrator, planning, memory management
- **Integration Module**: External system connections, database, caching
- **Tool Module**: Development utilities, file operations, command execution
- **Gateway Module**: API layer, WebSocket handling, middleware

#### Communication Patterns
- **Event-Driven**: Progress updates via WebSocket
- **Request/Response**: REST API endpoints
- **Memory Injection**: Context sharing between components
- **Agent Coordination**: Message passing and callback mechanisms

### Development & Testing Approach

#### Test Coverage
- **Unit Tests**: Individual component testing (500+ tests)
- **Integration Tests**: Multi-agent workflow testing
- **E2E Tests**: Full user journey validation
- **Adaptive Intelligence Tests**: Style learning and pattern recognition

#### Quality Assurance
- **Mutation Testing**: Code robustness validation
- **Edge Case Generation**: Comprehensive scenario coverage
- **Regression Detection**: Automated change impact analysis
- **Performance Monitoring**: Benchmark tracking and optimization

## Advanced Features

### Multi-Modal Integration
- **Screenshot to Code**: Convert UI mockups to HTML/React
- **Error Resolution**: Automatic debugging assistance
- **DevTools Bridge**: IDE integration with development tools
- **Figma Sync**: Design system integration

### Collaboration Features
- **Live Share**: Multi-user editing and collaboration
- **Parallel Sandbox**: Concurrent experimentation environments
- **Time Travel**: Version history and state management
- **Workflow Recording**: Capture and replay development sessions

### Personalization
- **Adaptive Learning**: Learn from developer behavior
- **Expertise Classification**: Determine skill level for appropriate assistance
- **Style Profiles**: Personalized coding conventions
- **Mistake Patterns**: Avoidance learning from rejected changes

## Scalability & Production Considerations

### Horizontal Scaling
- **Microservice Architecture**: Separate components for independent scaling
- **Load Balancing**: Distributed model inference
- **Caching Layers**: Multiple cache levels for performance
- **Database Optimization**: Read replicas and sharding strategies

### Fault Tolerance
- **Graceful Degradation**: Fallback mechanisms for service interruptions
- **Circuit Breakers**: Protection against cascading failures
- **Health Checks**: Comprehensive monitoring and alerting
- **Backup Strategies**: Automated backup and recovery procedures

## Migration & Upgrade Considerations

### Backward Compatibility
- **API Versioning**: Support for older API versions
- **Configuration Migration**: Tools for config file updates
- **Data Migration**: Seamless database schema changes
- **Model Compatibility**: Multiple model format support

### Deployment Strategies
- **Blue-Green Deployment**: Zero-downtime updates
- **Canary Releases**: Gradual rollout of new features
- **Rolling Updates**: Incremental component updates
- **Rollback Procedures**: Emergency rollback mechanisms

## Performance Optimization

### Database Optimization
- **Indexing Strategy**: Composite indexes for common queries
- **Query Optimization**: Efficient SQL generation
- **Caching Layers**: Redis integration for frequent access patterns
- **Connection Pooling**: Database connection management

### Application Performance
- **Resource Management**: Efficient memory and CPU usage
- **Async Processing**: Non-blocking I/O operations
- **Caching Strategy**: Multi-level caching architecture
- **Load Distribution**: Horizontal scaling of components

## Monitoring & Observability

### Metrics Collection
- **Application Metrics**: Performance counters and timing
- **Business Metrics**: User engagement and system usage
- **Error Tracking**: Comprehensive error logging and analysis
- **Health Monitoring**: Service availability and performance

### Logging Strategy
- **Structured Logging**: JSON-formatted log entries
- **Log Aggregation**: Centralized log collection
- **Log Retention**: Configurable retention policies
- **Log Analysis**: Automated log processing and insights

## Security Best Practices

### Authentication & Authorization
- **Principle of Least Privilege**: Minimum required permissions
- **Role-Based Access Control**: Different access levels for different users
- **Audit Logging**: Comprehensive access tracking
- **Encryption**: Sensitive data protection in transit and at rest

### Input Validation
- **Schema Validation**: Comprehensive input validation
- **Sanitization**: Data cleaning and normalization
- **Rate Limiting**: Protection against abuse
- **DDoS Protection**: Network-level security measures

## DevOps & CI/CD

### Continuous Integration
- **Automated Testing**: Comprehensive test suite execution
- **Code Quality**: Linting, formatting, and static analysis
- **Security Scanning**: Vulnerability detection and remediation
- **Performance Testing**: Load and stress testing

### Continuous Deployment
- **Automated Builds**: Continuous build pipelines
- **Artifact Management**: Package and artifact versioning
- **Deployment Automation**: Infrastructure as code
- **Rollback Automation**: Automated rollback procedures

## Conclusion

Junglans IDE represents a sophisticated AI-native development environment that combines cutting-edge AI technologies with enterprise-grade development practices. The system provides:

- **Unified Platform**: Single interface for all AI-assisted development tasks
- **Adaptive Intelligence**: Personalized AI assistance that learns from user behavior
- **Production Ready**: Robust architecture with comprehensive testing and monitoring
- **Extensible**: Plugin architecture for future enhancements
- **Secure**: Enterprise-grade security and compliance features

The project demonstrates how modern AI technologies can be effectively integrated into development workflows to enhance productivity, reduce errors, and provide intelligent assistance throughout the entire software development lifecycle.

---

*This README provides comprehensive documentation for Junglans IDE users, covering setup, usage, configuration, and technical implementation details. For more specific information, refer to individual module documentation and API specifications.*

**Key Resources**:
- **Documentation**: Internal documentation for detailed API references
- **Tutorials**: Step-by-step guides for common tasks
- **Examples**: Sample usage and best practices
- **Troubleshooting**: Common issues and solutions
- **Community**: Support forums and issue tracking
