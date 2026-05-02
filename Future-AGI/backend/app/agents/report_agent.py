"""
ReportAgent – Synthesises outputs from multiple agents into a formatted report.
"""

import logging
from datetime import datetime, timezone

from app.agents.base_agent import BaseAgent

logger = logging.getLogger(__name__)


class ReportAgent(BaseAgent):
    """
    Aggregates results from other agents and generates
    clean, structured Markdown reports.
    """

    name = "reporter"
    role = (
        "Expert technical writer. "
        "You synthesise complex information into clear, professional reports."
    )

    def generate_report(self, task: str, agent_outputs: dict) -> dict:
        """
        Generate a Markdown report from multiple agent outputs.

        Args:
            task:          The original user task.
            agent_outputs: Dictionary mapping agent names to their outputs.

        Returns:
            dict with keys: agent, task, report (Markdown string), timestamp
        """
        sections = "\n\n".join(
            f"### {agent.title()} Output\n{output}"
            for agent, output in agent_outputs.items()
        )

        prompt = f"""
You are compiling a professional report for the following task:

ORIGINAL TASK:
{task}

AGENT OUTPUTS:
{sections}

Instructions:
1. Write a professional Markdown report with these sections:
   - ## Executive Summary (2–3 sentences)
   - ## Findings (key points from each agent)
   - ## Recommendations (actionable next steps)
   - ## Conclusion
2. Use clear headings, bullet points, and bold text for emphasis.
3. Keep the total length between 300 and 600 words.
4. Do not invent facts not present in the agent outputs.
"""

        report = self.think(prompt, temperature=0.3)
        timestamp = datetime.now(timezone.utc).isoformat()

        logger.info("[%s] Report generated | task=%s ts=%s", self.name, task[:60], timestamp)

        return {
            "agent":     self.name,
            "task":      task,
            "report":    report,
            "timestamp": timestamp,
        }
