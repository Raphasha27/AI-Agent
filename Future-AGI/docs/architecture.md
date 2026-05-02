# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                               │
│                    React Dashboard (Port 3000)                       │
│          Dashboard · Agent Chat · Task Manager                       │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ HTTP / REST
┌───────────────────────────▼─────────────────────────────────────────┐
│                      FASTAPI GATEWAY (Port 8000)                     │
│   /agent/run   /agent/chat   /tasks/*   /health/*   /docs           │
│                     CORS · JWT Auth · Request Validation             │
└──────────┬──────────────────────────────────┬───────────────────────┘
           │                                  │
┌──────────▼──────────┐            ┌──────────▼──────────┐
│   AGENT ENGINE       │            │   TASK SERVICE       │
│                      │            │                      │
│  CoordinatorAgent    │            │  CRUD operations     │
│  ├─ PlannerAgent     │            │  Status tracking     │
│  ├─ ResearchAgent    │            │  Result storage      │
│  ├─ CodingAgent      │            └──────────┬──────────┘
│  └─ ReportAgent      │                       │
└──────────┬──────────┘                        │
           │                                   │
┌──────────▼──────────┐            ┌──────────▼──────────┐
│    TOOL SYSTEM       │            │     POSTGRESQL       │
│                      │            │                      │
│  web_search.py       │            │  tasks               │
│  python_executor.py  │            │  users               │
│  email_tool.py       │            │  memory_entries      │
│  database_tool.py    │            └────────────────────-─┘
│  file_tool.py        │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│    MEMORY SYSTEM     │
│                      │
│  embeddings.py       │  ← sentence-transformers
│  vector_store.py     │  ← FAISS IndexFlatL2
│  memory_manager.py   │  ← remember() / recall()
└─────────────────────-┘
```

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 + Vite | Interactive dashboard |
| API Gateway | FastAPI 0.111 | REST API + OpenAPI docs |
| LLM Engine | OpenAI GPT-4o-mini | Agent reasoning |
| Database | PostgreSQL 16 | Task/user/memory persistence |
| ORM | SQLAlchemy 2.0 | Database models |
| Vector Store | FAISS | Similarity search |
| Embeddings | sentence-transformers | Text → vector |
| Auth | JWT (python-jose) | Stateless authentication |
| Container | Docker + Compose | Deployment |

## Request Flow

```
User types task
    ↓
AgentConsole.jsx calls POST /agent/chat
    ↓
routes_agent.py validates request
    ↓
agent_service.execute_agent(task, mode)
    ↓
CoordinatorAgent.execute(task)
    ├─ PlannerAgent.plan(task)        → step-by-step plan
    ├─ ResearchAgent.research(task)   → web summary
    └─ ReportAgent.generate_report()  → Markdown report
    ↓
JSON response returned to frontend
    ↓
AgentConsole renders result as chat bubble
```
