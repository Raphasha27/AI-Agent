"""
AI Agent Platform – Main Application Entry Point
FastAPI + Multi-Agent + Vector Memory + Tool Execution
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_agent import router as agent_router
from app.api.routes_tasks import router as task_router
from app.api.routes_health import router as health_router
from app.core.logging import configure_logging
from app.db.database import engine, Base
from app.models import task, user, memory  # Import models to register them with Base

configure_logging()

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Agent Platform",
    description="Autonomous multi-agent AI system for task execution, research, and automation.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(agent_router, prefix="/agent",  tags=["Agent"])
app.include_router(task_router,  prefix="/tasks",  tags=["Tasks"])
app.include_router(health_router, prefix="/health", tags=["Health"])


@app.get("/", tags=["Root"])
def root():
    return {
        "status": "ok",
        "message": "AI Agent Platform is running",
        "version": "1.0.0",
        "docs": "/docs",
    }
