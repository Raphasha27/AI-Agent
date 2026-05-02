"""
Agent Service – business logic layer for agent execution.
Called by API routes to run agent workflows.
"""

import logging
from typing import Optional

from app.agents.coordinator_agent import CoordinatorAgent

logger = logging.getLogger(__name__)

# Singleton coordinator (initialised once per process)
_coordinator: Optional[CoordinatorAgent] = None


def _get_coordinator() -> CoordinatorAgent:
    global _coordinator
    if _coordinator is None:
        _coordinator = CoordinatorAgent()
    return _coordinator


def execute_agent(task: str, mode: str = "full") -> dict:
    """
    Execute an agent workflow for the given task.

    Args:
        task: The user's task description.
        mode: One of 'full', 'plan', 'research', 'code'.

    Returns:
        dict: Agent execution results including plan, research, and report.
    """
    logger.info("[agent_service] Request received | task=%.60s mode=%s", task, mode)

    coordinator = _get_coordinator()
    result      = coordinator.execute(task=task, mode=mode)

    logger.info("[agent_service] Request complete | status=%s", result.get("status"))
    return result
