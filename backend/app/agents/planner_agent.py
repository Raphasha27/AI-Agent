"""
PlannerAgent – Breaks complex tasks into structured, executable steps.
"""

import logging
from typing import List

from app.agents.base_agent import BaseAgent

logger = logging.getLogger(__name__)


class PlannerAgent(BaseAgent):
    """
    Decomposes an input task into an ordered list of sub-steps
    suitable for execution by other agents or tools.
    """

    name = "planner"
    role = (
        "Expert task decomposition specialist. "
        "You break complex goals into clear, numbered execution steps."
    )

    def plan(self, task: str) -> dict:
        """
        Generate a step-by-step execution plan for the given task.

        Returns:
            dict with keys: agent, task, plan (str), steps (List[str])
        """
        prompt = f"""
You are given the following task to plan:

TASK:
{task}

Instructions:
1. Analyse the task thoroughly.
2. Break it into ordered, atomic execution steps.
3. Number each step.
4. Keep each step concise and actionable.
5. At the end, add a one-line summary of the overall plan.

Format your response exactly like this:
STEPS:
1. <step>
2. <step>
...

SUMMARY:
<one-line summary>
"""

        raw = self.think(prompt)
        steps = self._parse_steps(raw)

        logger.info("[%s] Plan generated | steps=%d task=%s", self.name, len(steps), task[:60])

        return {
            "agent":   self.name,
            "task":    task,
            "plan":    raw,
            "steps":   steps,
        }

    # ── Helpers ───────────────────────────────────────────────────────────────

    @staticmethod
    def _parse_steps(raw: str) -> List[str]:
        """Extract numbered steps from raw LLM output."""
        steps = []
        for line in raw.splitlines():
            stripped = line.strip()
            if stripped and stripped[0].isdigit() and "." in stripped[:4]:
                steps.append(stripped)
        return steps
