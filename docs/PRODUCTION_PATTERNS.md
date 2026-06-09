# Production Patterns for AI Agents

## 6 Techniques for Production-Ready Agents

### 1. Reflection Loops
Agents critique their own output, revise mistakes, and repeat until results meet the standard. Implemented as critic loops in the agent pipeline.

### 2. Plan & Execute
Complex goals are decomposed into steps first, then executed sequentially. The PlannerAgent handles decomposition; the JudgeAgent validates outcomes.

### 3. Layered Memory
Three-tier memory architecture:
- **Live facts** — current session context and tool outputs
- **Stored transcripts** — persisted conversation history
- **Past interactions** — vector search across historical sessions

### 4. Tool Design
Every tool has:
- One clear purpose
- Strict input/output contracts
- Predictable failure modes
- Fallback behavior

### 5. Human in the Loop
High-risk actions require human approval before execution. Implemented via agent gating and approval workflows.

### 6. Eval Suite
Regular testing against curated edge cases. Without evaluation, teams are only guessing whether the system is improving.

## The Reality

- A prompt is not a production system
- A model is not an architecture
- An agent without evaluation is just automation with confidence

## Better Questions

| Instead of | Ask |
|------------|-----|
| "Can we build an AI agent?" | "Can we build one that behaves reliably when the task gets messy?" |
| "Which model should we use?" | "What control patterns surround the model?" |
| "How many prompts do we need?" | "How do we test, measure, and improve?" |

---

*Part of the AI-Agent framework. See also: [Design Philosophy](../README.md#design-philosophy), [Prompting Framework](PROMPTING_FRAMEWORK.md)*