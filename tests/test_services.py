"""Tests for service layer."""

import pytest

from app.services.agent_service import execute_agent


def test_execute_agent_returns_dict(monkeypatch):
    def mock_execute(task, mode):
        return {
            "status": "success",
            "task": task,
            "mode": mode,
            "outputs": {"planner": "test plan"},
        }

    monkeypatch.setattr(
        "app.services.agent_service._get_coordinator",
        lambda: type("MockCoordinator", (), {"execute": mock_execute})(),
    )

    result = execute_agent("test task", mode="plan")
    assert result["status"] == "success"
    assert result["task"] == "test task"
    assert result["mode"] == "plan"
