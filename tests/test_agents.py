"""Tests for base agent and coordinator agent."""

import pytest

from app.agents.base_agent import BaseAgent
from app.agents.coordinator_agent import CoordinatorAgent
from app.agents.planner_agent import PlannerAgent


class TestBaseAgent:
    def test_initialization(self):
        agent = BaseAgent()
        assert agent.name == "base_agent"
        assert "General-purpose" in agent.role

    def test_custom_name(self):
        agent = BaseAgent(name="test-agent")
        assert agent.name == "test-agent"

    def test_run_returns_dict(self):
        agent = BaseAgent()
        result = agent.run("say hello")
        assert isinstance(result, dict)
        assert "agent" in result
        assert "task" in result
        assert "result" in result

    def test_repr(self):
        agent = BaseAgent()
        rep = repr(agent)
        assert "BaseAgent" in rep
        assert "base_agent" in rep


class TestPlannerAgent:
    def test_initialization(self):
        agent = PlannerAgent()
        assert agent.name == "planner"

    def test_plan_returns_dict(self, monkeypatch):
        agent = PlannerAgent()

        def mock_ask(prompt, **kwargs):
            return "1. Research step\n2. Execute step\n3. Review"

        monkeypatch.setattr("app.agents.base_agent.BaseAgent.think", mock_ask)
        result = agent.plan("test task")
        assert isinstance(result, dict)
        assert "plan" in result


class TestCoordinatorAgent:
    def test_initialization(self):
        coordinator = CoordinatorAgent()
        assert coordinator.name == "coordinator"
        assert hasattr(coordinator, "planner")
        assert hasattr(coordinator, "researcher")
        assert hasattr(coordinator, "coder")
        assert hasattr(coordinator, "reporter")

    def test_execute_plan_only(self, monkeypatch):
        coordinator = CoordinatorAgent()

        def mock_plan(task):
            return {"plan": "Step 1: Do X\nStep 2: Do Y"}

        monkeypatch.setattr(coordinator.planner, "plan", mock_plan)
        result = coordinator.execute("test task", mode="plan")
        assert result["status"] == "success"
        assert "outputs" in result
        assert "planner" in result["outputs"]

    def test_execute_full(self, monkeypatch):
        coordinator = CoordinatorAgent()

        def mock_plan(task):
            return {"plan": "Step 1: Research\nStep 2: Report"}

        def mock_research(task):
            return {"summary": "Research findings"}

        def mock_report(task, outputs):
            return {"report": "Final report"}

        monkeypatch.setattr(coordinator.planner, "plan", mock_plan)
        monkeypatch.setattr(coordinator.researcher, "research", mock_research)
        monkeypatch.setattr(coordinator.reporter, "generate_report", mock_report)

        result = coordinator.execute("test task", mode="full")
        assert result["status"] == "success"
        assert "planner" in result["outputs"]
        assert "researcher" in result["outputs"]
        assert "report" in result
