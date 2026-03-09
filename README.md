<div align="center">

# 🤖 AI Agent Platform

### Autonomous Multi-Agent AI System

**Plan · Research · Code · Report — Fully Automated**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://docker.com)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

*Built by **Koketso Raphasha** · [GitHub](https://github.com/Raphasha27)*

</div>

---

A production-ready AI agent platform that combines **FastAPI**, **React**, **PostgreSQL**, **FAISS vector memory**, and **OpenAI GPT-4o-mini** into a fully autonomous multi-agent system capable of planning tasks, performing web research, writing code, and generating reports — all orchestrated automatically.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **Multi-Agent Architecture** | 5 specialised agents work together as a pipeline |
| 🔎 **Web Research** | DuckDuckGo-powered real-time search and synthesis |
| 💻 **Code Generation** | Write, review, and execute Python code |
| 📊 **Auto Reports** | Markdown reports synthesised from all agent outputs |
| 🧠 **Vector Memory** | FAISS-powered long-term memory with sentence embeddings |
| 🗄 **PostgreSQL** | Persistent task and memory storage |
| ⚡ **React Dashboard** | Dark glassmorphism UI with live agent chat |
| 🐳 **Docker Ready** | One-command deployment with `docker compose up` |
| 🔐 **JWT Auth** | Stateless token-based security |
| 🔄 **Retry Logic** | Automatic LLM call retries with exponential backoff |

---

## 🤖 Agent Fleet

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REQUEST                              │
│                         │                                    │
│              ┌──────────▼──────────┐                        │
│              │  Coordinator Agent  │  ← Routes & Assembles  │
│              └──────────┬──────────┘                        │
│                         │                                    │
│          ┌──────────────┼──────────────┐                    │
│          ▼              ▼              ▼                     │
│   Planner Agent  Research Agent  Coding Agent               │
│   (Break steps)  (Web search)   (Write/run code)            │
│          │              │              │                     │
│          └──────────────┼──────────────┘                    │
│                         ▼                                    │
│                  Report Agent  ← Final Markdown report      │
└─────────────────────────────────────────────────────────────┘
```

| Agent | Role |
|---|---|
| 🧭 **Coordinator** | Orchestrates all agents and manages execution flow |
| 📋 **Planner**     | Breaks complex goals into numbered, actionable steps |
| 🔎 **Researcher**  | Queries the web and produces clean research summaries |
| 💻 **Coder**       | Writes, reviews, and sandboxes Python code |
| 📊 **Reporter**    | Combines outputs into a professional Markdown report |

---

## 📁 Project Structure

```
AI-Agent/
│
├── backend/
│   ├── app/
│   │   ├── agents/           # 5 specialised AI agents
│   │   ├── tools/            # Web search, code executor, email, DB, file tools
│   │   ├── memory/           # FAISS vector store + sentence embeddings
│   │   ├── core/             # Config, LLM engine, logging, security
│   │   ├── api/              # FastAPI route handlers
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── services/         # Business logic layer
│   │   ├── db/               # Database setup & migrations
│   │   └── main.py           # FastAPI application entry point
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/       # AgentConsole, TaskList, Navbar
│   │   ├── pages/            # Dashboard, AgentChat, Tasks
│   │   ├── services/api.js   # Axios API client
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── docker/
│   └── docker-compose.yml    # Full stack orchestration
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── agents.md
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed
- An [OpenAI API Key](https://platform.openai.com/api-keys)

### 1. Clone the Repository

```bash
git clone https://github.com/Raphasha27/AI-Agent.git
cd AI-Agent
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env and add your OpenAI API key:
# OPENAI_API_KEY=sk-your-key-here
```

### 3. Start the Platform

```bash
docker compose -f docker/docker-compose.yml up --build
```

### 4. Access the Dashboard

| Service | URL |
|---|---|
| 🖥 React Dashboard | http://localhost:3000 |
| ⚡ FastAPI Backend | http://localhost:8000 |
| 📖 Swagger API Docs | http://localhost:8000/docs |
| 🗄 PostgreSQL | localhost:5432 |

---

## 💻 Local Development (No Docker)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Reference

### Agent Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/agent/run` | Run full agent pipeline |
| `POST` | `/agent/chat` | Quick single-turn chat |

#### Agent Run Request

```json
{
  "task": "Research the latest trends in autonomous AI agents",
  "mode": "full"
}
```

**Modes:** `full` · `plan` · `research` · `code`

#### Agent Run Response

```json
{
  "status": "success",
  "task": "Research the latest trends...",
  "outputs": {
    "planner":    "1. Identify key developments...\n2. ...",
    "researcher": "Key findings: ...",
    "reporter":   "## Executive Summary\n..."
  },
  "report": "## Executive Summary\n..."
}
```

### Task Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks/` | List all tasks |
| `POST` | `/tasks/` | Create a task |
| `GET` | `/tasks/{id}` | Get task by ID |
| `PATCH` | `/tasks/{id}/status` | Update task status |
| `DELETE` | `/tasks/{id}` | Delete a task |

### Health Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health/` | Basic health check |
| `GET` | `/health/deep` | Full subsystem status |

---

## 🧠 Memory System

The platform uses a two-tier memory architecture:

```
Text → sentence-transformers → 384-dim embedding → FAISS Index
                                                  ↕
                                           PostgreSQL (MemoryEntry)
```

- **Short-term**: In-process FAISS index for fast similarity search
- **Long-term**: PostgreSQL `memory_entries` table for persistence
- **Retrieval**: Top-K cosine similarity search for context injection

---

## 🛠 Tool System

Agents can call these tools:

| Tool | File | Description |
|---|---|---|
| 🔎 Web Search | `tools/web_search.py` | DuckDuckGo instant answers |
| 💻 Python Executor | `tools/python_executor.py` | Sandboxed code execution |
| 📧 Email Tool | `tools/email_tool.py` | SMTP email sending |
| 🗄 Database Tool | `tools/database_tool.py` | Safe SQL query execution |
| 📁 File Tool | `tools/file_tool.py` | Read/write to agent workspace |

---

## 🔒 Security

- JWT-based authentication (stateless)
- Bcrypt password hashing
- SQL injection prevention via SQLAlchemy ORM
- Path traversal protection in file tool
- Code execution sandbox (whitelist-based builtins)

---

## 📊 Roadmap

- [ ] LangGraph multi-agent workflow engine
- [ ] Autonomous AutoGPT-style task loops
- [ ] Pinecone / Weaviate vector store integration
- [ ] PDF report export
- [ ] WebSocket streaming responses
- [ ] Redis + Celery task queue
- [ ] Voice AI interface
- [ ] Browser automation agent
- [ ] Multi-user workspace support

---

## 👨‍💻 Author

**Koketso Raphasha**  
Software Engineer · AI Systems Developer

[![GitHub](https://img.shields.io/badge/GitHub-Raphasha27-333?style=flat-square&logo=github)](https://github.com/Raphasha27)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
⭐ <strong>Star this repo if you found it useful!</strong> ⭐
</div>
