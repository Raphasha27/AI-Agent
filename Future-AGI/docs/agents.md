# Agent Reference

## Base Agent

All agents extend `BaseAgent` which provides:
- `think(prompt, temperature)` – LLM call with system prompt injection
- `run(task)` – default task execution interface
- Automatic logging and timing

## Planner Agent

**Class:** `PlannerAgent`  
**Method:** `plan(task: str) → dict`

Breaks a task into numbered, actionable steps. Returns:
```json
{
  "agent": "planner",
  "task": "...",
  "plan": "STEPS:\n1. ...\n\nSUMMARY: ...",
  "steps": ["1. Step one", "2. Step two"]
}
```

## Research Agent

**Class:** `ResearchAgent`  
**Method:** `research(topic: str) → dict`

Searches the web via DuckDuckGo and synthesises results. Returns:
```json
{
  "agent": "researcher",
  "topic": "...",
  "raw_results": "ABSTRACT: ... RELATED TOPICS: ...",
  "summary": "Key findings: ..."
}
```

## Coding Agent

**Class:** `CodingAgent`  
**Methods:**
- `write_code(description, language) → dict`
- `execute_code(code) → dict`
- `review_code(code) → dict`

Returns structured output with extracted code block and explanation.

## Report Agent

**Class:** `ReportAgent`  
**Method:** `generate_report(task, agent_outputs) → dict`

Accepts outputs from all agents and produces a Markdown report with:
- Executive Summary
- Findings
- Recommendations
- Conclusion

## Coordinator Agent

**Class:** `CoordinatorAgent`  
**Method:** `execute(task, mode) → dict`

Orchestrates the full pipeline. Modes:

| Mode | Pipeline |
|---|---|
| `full` | plan → research → report |
| `plan` | plan only |
| `research` | plan → research |
| `code` | plan → code generation |

## Adding a New Agent

1. Create `backend/app/agents/my_agent.py`
2. Inherit from `BaseAgent`
3. Override `run()` or add custom methods
4. Register in `CoordinatorAgent` if it should be part of the pipeline
5. Expose via a new API route if needed

```python
from app.agents.base_agent import BaseAgent

class MyAgent(BaseAgent):
    name = "my_agent"
    role = "Specialised expert in X"

    def my_method(self, input: str) -> dict:
        result = self.think(f"Do X with: {input}")
        return {"agent": self.name, "result": result}
```
