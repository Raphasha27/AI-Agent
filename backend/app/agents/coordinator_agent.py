"""
CoordinatorAgent – Orchestrates multiple specialised agents to complete complex tasks.

The coordinator:
  1. Receives a high-level task from the user.
  2. Uses the PlannerAgent to break it into steps.
  3. Delegates each step to the best-fit agent.
  4. Collects results and passes them to the ReportAgent.
  5. Returns a final unified report.
"""

import logging

from app.agents.base_agent import BaseAgent
from app.agents.planner_agent import PlannerAgent
from app.agents.research_agent import ResearchAgent
from app.agents.coding_agent import CodingAgent
from app.agents.report_agent import ReportAgent

logger = logging.getLogger(__name__)


class CoordinatorAgent(BaseAgent):
    """
    Meta-agent that selects and orchestrates specialised sub-agents.
    """

    name = "coordinator"
    role = (
        "Expert AI orchestrator. "
        "You coordinate multiple AI agents to complete complex tasks efficiently."
    )

    def __init__(self):
        super().__init__()
        self.planner    = PlannerAgent()
        self.researcher = ResearchAgent()
        self.coder      = CodingAgent()
        self.reporter   = ReportAgent()

    def execute(self, task: str, mode: str = "full") -> dict:
        """
        Execute a task using the full agent pipeline.

        Modes:
            "full"     – plan → research → report
            "research" – plan → research only
            "code"     – plan → code generation
            "plan"     – plan only

        Args:
            task: The user's high-level task description.
            mode: Execution mode.

        Returns:
            dict with all agent outputs and a final consolidated report.
        """
        logger.info("[%s] Starting execution | task=%s mode=%s", self.name, task[:60], mode)

        outputs: dict = {}

        # ── Always plan first ─────────────────────────────────────────────────
        plan_result = self.planner.plan(task)
        outputs["planner"] = plan_result["plan"]

        if mode == "plan":
            return {"status": "success", "task": task, "outputs": outputs}

        # ── Research ──────────────────────────────────────────────────────────
        if mode in ("full", "research"):
            research_result = self.researcher.research(task)
            outputs["researcher"] = research_result["summary"]

        if mode == "research":
            return {"status": "success", "task": task, "outputs": outputs}

        # ── Code generation (if task looks code-related) ───────────────────────
        if mode == "code":
            code_result = self.coder.write_code(task)
            outputs["coder"] = code_result["raw"]
            return {"status": "success", "task": task, "outputs": outputs}

        # ── Final Report ──────────────────────────────────────────────────────
        report_result = self.reporter.generate_report(task, outputs)
        outputs["reporter"] = report_result["report"]

        logger.info("[%s] Execution complete | agents=%s", self.name, list(outputs.keys()))

        return {
            "status":  "success",
            "task":    task,
            "mode":    mode,
            "outputs": outputs,
            "report":  report_result["report"],
        }
