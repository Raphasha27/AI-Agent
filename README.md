<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:00ffcc,100:004a99&height=200&section=header&text=AI-Agent%20Core&fontSize=50&fontColor=ffffff&fontAlignY=40&desc=Multi-Agent%20Orchestration%20Framework&descAlignY=65" width="100%"/>

  [![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&style=for-the-badge)](https://python.org)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-009688?logo=fastapi&style=for-the-badge)](https://fastapi.tiangolo.com)
  [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&style=for-the-badge)](https://react.dev)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&style=for-the-badge)](https://nextjs.org)
  [![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&style=for-the-badge)](https://docker.com)
  [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?style=for-the-badge)](LICENSE)

  <p><strong>An autonomous multi-agent orchestration framework with FastAPI intelligence core, React dashboard, and Next.js landing portal.</strong></p>
</div>

---

## Overview

AI-Agent is a production-grade multi-agent orchestration platform that coordinates specialized AI agents to plan, research, code, and report on complex tasks. Built with a polyglot architecture — Python (FastAPI) for intelligence, React for the dashboard, and Next.js for the landing portal — it provides self-improving agent loops with vector memory, tool execution, and 18-layer security.

### Key Capabilities

- **Multi-Agent Orchestration** — Coordinator, Planner, Researcher, Coding, Judge, LinkedIn, and Report agents working in concert
- **Vector Memory** — FAISS-powered semantic search with configurable embedding models
- **Tool Ecosystem** — Web search, file I/O, database queries, Python execution, email, and dynamic skill generation
- **Voice AI** — Call flow management with Ultravox integration and CRM connector
- **WhatsApp Integration** — E-commerce and communication via WhatsApp Business API
- **Enterprise AI** — Work IQ connector for M365 Copilot delegation via A2A
- **18-Layer Security** — Encrypted transport, JWT auth, RBAC, audit logging, rate limiting, and anomaly detection

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│  ┌─────────────────┐  ┌──────────────────┐                 │
│  │ Next.js Landing │  │ React Dashboard  │                 │
│  │ (apps/landing/) │  │ (frontend/)      │                 │
│  └────────┬────────┘  └────────┬─────────┘                 │
│           │                    │                            │
├───────────┴────────────────────┴────────────────────────────┤
│                    API GATEWAY                               │
│              Nginx + Node.js (WebSocket)                     │
├───────────┬─────────────────────────────────────────────────┤
│           │                    │                             │
│  ┌────────▼────────┐  ┌────────▼────────┐                  │
│  │  FastAPI Core   │  │  Real-time AI   │                   │
│  │  (backend/)     │  │  Socket.io      │                   │
│  │                 │  │                 │                    │
│  │  Agents:        │  │  WhatsApp       │                    │
│  │  • Coordinator  │  │  Voice AI       │                    │
│  │  • Planner      │  │  Streams        │                    │
│  │  • Research     │  └─────────────────┘                   │
│  │  • Coding       │                                         │
│  │  • Judge        │                                         │
│  │  • LinkedIn     │                                         │
│  │  • Report       │                                         │
│  └────────┬────────┘                                         │
│           │                                                  │
├───────────┴──────────────────────────────────────────────────┤
│                    PERSISTENCE LAYER                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐           │
│  │PostgreSQL│  │  Redis   │  │FAISS Vector Store │           │
│  │(SQLite   │  │  Cache   │  │(embeddings +      │           │
│  │ dev)     │  │          │  │ similarity search)│           │
│  └──────────┘  └──────────┘  └──────────────────┘           │
└──────────────────────────────────────────────────────────────┘
```

### Agent Pipeline

1. **Intake** — API Gateway receives a task via HTTP or WebSocket
2. **Planning** — `PlannerAgent` decomposes the task into execution steps
3. **Research** — `ResearchAgent` gathers context via web search and vector memory
4. **Execution** — `CodingAgent` or specialized agents execute based on intent
5. **Judgment** — `JudgeAgent` evaluates quality and provides feedback
6. **Report** — `ReportAgent` consolidates outputs into a structured response

---

## Project Structure

```
AI-Agent/
├── backend/                    # Python FastAPI intelligence core
│   ├── app/
│   │   ├── agents/             # Agent implementations (7 agents)
│   │   │   ├── coordinator_agent.py
│   │   │   ├── planner_agent.py
│   │   │   ├── research_agent.py
│   │   │   ├── coding_agent.py
│   │   │   ├── judge_agent.py
│   │   │   ├── linkedin_agent.py
│   │   │   └── report_agent.py
│   │   ├── api/                # REST API endpoints
│   │   │   ├── routes_agent.py
│   │   │   ├── routes_tasks.py
│   │   │   ├── routes_health.py
│   │   │   └── routes_future.py
│   │   ├── core/               # Config, LLM, logging, security
│   │   ├── db/                 # Database models & session
│   │   ├── memory/             # Vector store & embeddings
│   │   ├── models/             # SQLAlchemy models
│   │   ├── services/           # Business logic layer
│   │   ├── tools/              # Web search, file, DB, email, executor
│   │   ├── integrations/       # Work IQ (M365) connector
│   │   ├── voice_ai/           # Call flow, Ultravox, CRM
│   │   └── communication/      # WhatsApp manager
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                   # React + Vite dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── Dockerfile
│   └── package.json
├── apps/
│   └── landing/                # Next.js landing portal
│       ├── components/
│       ├── pages/
│       └── package.json
├── automations/                # n8n blueprints & case studies
├── docker/                     # Docker Compose for orchestration
├── scripts/                    # Audit, monitoring, and automation scripts
├── deploy/                     # Production deployment configs
├── docs/                       # Architecture docs & guides
├── docker-compose.yml          # Root Docker Compose
├── requirements.txt            # Root Python dependencies
└── .github/                    # CI/CD workflows & issue templates
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Python 3.11+, FastAPI, Uvicorn | Agent orchestration, REST API |
| **AI/ML** | OpenAI, LangChain, CrewAI, FAISS | Agent intelligence, embeddings, RAG |
| **Database** | SQLAlchemy, SQLite/PostgreSQL | Task and user persistence |
| **Memory** | sentence-transformers, FAISS | Vector similarity search |
| **Frontend** | React 18, Vite, React Router | Dashboard UI |
| **Landing** | Next.js 14, Tailwind CSS | Marketing portal |
| **Voice** | Ultravox, Retell | AI voice call flows |
| **Messaging** | WhatsApp Business API | Conversational commerce |
| **Infrastructure** | Docker, Nginx | Container orchestration |

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20 LTS
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/Raphasha27/AI-Agent.git
cd AI-Agent

# Set up Python environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start the backend
uvicorn app.main:app --reload --port 8000
```

### Start with Docker

```bash
docker compose up --build
```

The API will be available at `http://localhost:8000` with interactive docs at `/docs`.

### Start the Dashboard

```bash
cd frontend
npm install
npm run dev
```

### Start the Landing Page

```bash
cd apps/landing
npm install
npm run dev
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/agent/run` | Execute a full agent workflow |
| `POST` | `/agent/chat` | Quick single-turn agent interaction |
| `GET` | `/tasks/` | List all tasks |
| `POST` | `/tasks/` | Create a new task |
| `GET` | `/tasks/{id}` | Get task details |
| `PATCH` | `/tasks/{id}/status` | Update task status |
| `DELETE` | `/tasks/{id}` | Delete a task |
| `GET` | `/health/` | Health check |
| `GET` | `/future/` | Future AGI portal status |

### Agent Modes

- **full** — Plan → Research → Report (default)
- **plan** — Generate execution plan only
- **research** — Plan + web research + summary
- **code** — Plan + code generation

Example:
```bash
curl -X POST http://localhost:8000/agent/run \
  -H "Content-Type: application/json" \
  -d '{"task": "Research the latest trends in AI agents", "mode": "full"}'
```

---

## Security

The platform implements an 18-layer security architecture:

| Layer | Control | Implementation |
|-------|---------|---------------|
| 1 | Input Sanitization | Pydantic schema validation |
| 2 | Authentication | JWT bearer tokens |
| 3 | Authorization | RBAC with least privilege |
| 4 | Agent Gating | Human-in-the-loop approvals |
| 5 | Audit Logging | Structured TraceID logging |
| 6 | Rate Limiting | Leaky bucket algorithm |
| 7 | Anomaly Detection | Statistical thresholding |
| 8 | Encryption | AES-256-GCM at rest, TLS 1.3 in transit |
| 9 | LLM Guardrails | Prompt injection scanning |
| 10 | Secure CI/CD | GitHub Actions with environment secrets |

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

- Branch naming: `feat/feature-name`, `fix/bug-description`
- Commit style: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)

---

## License

Licensed under the **Apache License 2.0**. See [LICENSE](LICENSE) for details.

---

## Ecosystem

Part of the **Kirov Dynamics Technology** ecosystem:

[![Portfolio](https://img.shields.io/badge/Portfolio-⭐29-00ffcc?style=flat-square)](https://github.com/Raphasha27/Portfolio)
[![AI-Agent](https://img.shields.io/badge/AI--Agent-⭐3-004a99?style=flat-square)](https://github.com/Raphasha27/AI-Agent)
[![Github-Harden](https://img.shields.io/badge/Github--Harden-Security-00ffcc?style=flat-square)](https://github.com/Raphasha27/Github-Harden)
[![Nexus-Quant](https://img.shields.io/badge/Nexus--Quant-Quant-00ffcc?style=flat-square)](https://github.com/Raphasha27/Nexus-Quant)
[![CyberShield SOC](https://img.shields.io/badge/CyberShield--SOC-Security-004a99?style=flat-square)](https://github.com/Raphasha27/cybershield_soc)
[![Dev Factory](https://img.shields.io/badge/Dev--Factory-v7-005571?style=flat-square)](https://github.com/Raphasha27/autonomous-dev-factory-v7)

*Building the infrastructure of autonomous systems.*

<br/>

---

<h3 align="center">🐍 Part of the <a href="https://github.com/Raphasha27">Raphasha27</a> Ecosystem</h3>

<p align="center">
  <a href="https://github.com/Raphasha27/Raphasha27">
    <img src="https://img.shields.io/badge/Back_to_Profile-0D1117?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  &nbsp;
  <a href="https://raphasha27.github.io/Raphasha27/ai-snake-game/">
    <img src="https://img.shields.io/badge/▶_Play_AI_Snake-0EA5E9?style=for-the-badge&logo=javascript&logoColor=white" />
  </a>
</p>

---

© 2026 **Kirov Dynamics Technology** | Built by **Koketso Raphasha (Raphasha27)**
