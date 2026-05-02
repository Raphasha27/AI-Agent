"""
Agent API Routes – endpoints for running ai agent workflows.
"""

import logging
from typing import Literal, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.agent_service import execute_agent

logger = logging.getLogger(__name__)
router = APIRouter()


# ── Request / Response Schemas ────────────────────────────────────────────────

class AgentRunRequest(BaseModel):
    task: str = Field(..., min_length=1, max_length=4000, example="Research the latest trends in AI agents")
    mode: Literal["full", "plan", "research", "code"] = Field(default="full")


class AgentChatRequest(BaseModel):
    task: str = Field(..., min_length=1, max_length=4000, example="What is FAISS?")


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/run", summary="Run a full agent workflow")
def run_agent(body: AgentRunRequest):
    """
    Run the multi-agent pipeline for a given task.

    Modes:
    - **full**:     plan → research → report (default)
    - **plan**:     generate execution plan only
    - **research**: plan + web research + summary
    - **code**:     plan + code generation
    """
    try:
        result = execute_agent(task=body.task, mode=body.mode)
        return result
    except Exception as exc:
        logger.error("[routes_agent] Error | %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/chat", summary="Quick single-turn agent chat")
def agent_chat(body: AgentChatRequest):
    """
    Lightweight chat endpoint – runs a quick 'full' workflow.
    Suitable for interactive UI use.
    """
    try:
        result = execute_agent(task=body.task, mode="full")
        return result
    except Exception as exc:
        logger.error("[routes_agent] Chat error | %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail=str(exc))
