"""
BaseAgent – Foundation class for all agents in the platform.

Every specialised agent inherits from BaseAgent and gains:
  • LLM access via ask_llm()
  • Structured prompt composition
  • Execution logging
  • Memory integration hooks
"""

import logging
import time
from typing import Optional

from app.core.llm import ask_llm

logger = logging.getLogger(__name__)


class BaseAgent:
    """
    Abstract foundation for all AI agents.

    Attributes:
        name (str):          Human-readable identifier.
        role (str):          Describes the agent's specialization.
        system_prompt (str): System-level instructions injected at every LLM call.
    """

    name: str = "base_agent"
    role: str = "General-purpose AI agent"

    def __init__(self, name: Optional[str] = None):
        if name:
            self.name = name
        self.system_prompt = (
            f"You are {self.name}, a specialised AI agent. "
            f"Your role: {self.role}. "
            "Always think step-by-step and return well-structured, concise responses."
        )
        logger.info("Agent initialised | name=%s role=%s", self.name, self.role)

    # ── Core LLM Wrapper ──────────────────────────────────────────────────────

    def think(self, prompt: str, temperature: float = 0.2) -> str:
        """
        Send a prompt to the LLM and return a response.
        Wraps ask_llm with timing and logging.
        """
        start = time.perf_counter()
        logger.debug("[%s] Thinking | prompt_len=%d", self.name, len(prompt))

        response = ask_llm(
            prompt=prompt,
            system_prompt=self.system_prompt,
            temperature=temperature,
        )

        elapsed = round((time.perf_counter() - start) * 1000, 1)
        logger.info("[%s] Done thinking | elapsed_ms=%s", self.name, elapsed)
        return response

    # ── Public Interface ──────────────────────────────────────────────────────

    def run(self, task: str) -> dict:
        """
        Execute a task and return a structured result dict.
        Subclasses should override this to provide specialised behaviour.
        """
        result = self.think(task)
        return {
            "agent":  self.name,
            "task":   task,
            "result": result,
        }

    def __repr__(self) -> str:
        return f"<{self.__class__.__name__} name={self.name!r} role={self.role!r}>"
