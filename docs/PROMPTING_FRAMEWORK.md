# Prompting Framework — Production AI Interaction Guide

A structured taxonomy for reliable, repeatable AI outputs across models and tools.

## Foundation

| Technique | Description |
|-----------|-------------|
| Role Stacking | Assign multiple expert roles to the model (e.g., "You are a senior data engineer and a technical writer") |
| Context Loading | Provide full context before the instruction — background, audience, constraints, desired outcome |
| Few-Shot Prompting | Give 2-5 examples of ideal input/output pairs before the actual task |
| Output Formatting | Specify exact format: JSON, markdown, bullet points, table, code block |
| Thinking Depth Control | Set reasoning depth: "Think step by step" vs "Be concise" vs "Provide deep analysis" |

## Optimization

| Technique | Description |
|-----------|-------------|
| Multi-Pass Prompting | Run the same prompt multiple times and aggregate/compare results |
| Critic Loop | Ask the model to critique and improve its own output |
| Solution Branching | Generate multiple approaches, then select the best one |
| Meta-Prompting | Ask the model to write a prompt for the task, then execute it |
| Workflow Prompting | Break a complex task into sequential sub-prompts with handoffs |

## Control

| Technique | Description |
|-----------|-------------|
| Constraint Engineering | Define hard boundaries: length, format, sources, exclusions |
| Persona Prompting | Adopt a specific persona: "You are a PhD economist reviewing this analysis" |
| Retrieval-First Prompting | Provide retrieved context before asking the model to reason |
| Multimodal Prompting | Combine text, images, charts, and files in a single prompt |
| Comparison Prompting | Ask the model to compare/contrast multiple options side by side |

## Reliability

| Technique | Description |
|-----------|-------------|
| Hallucination Reduction | Add "Only answer based on the provided context. Say 'I don't know' if uncertain" |
| Confidence Scoring | Request confidence levels: "Rate your confidence 0-10 for each claim" |
| Fact Separation | "Separate factual statements from inferences and opinions" |
| Uncertainty Marking | "Mark any claim you are less than 90% confident about with [UNCERTAIN]" |
| Verification Loops | "Verify your answer by checking each step against the source material" |

## Prompt Architecture

The standard prompt structure used across AI-Agent:

```
ROLE:     Define who the model should act as
GOAL:     State the desired outcome
CONTEXT:  Provide background, data, and constraints
INPUT:    The specific input to process
CONSTRAINTS: Hard rules and boundaries
PROCESS:  Step-by-step reasoning approach
OUTPUT:   Exact format specification
QUALITY:  Verification criteria
```

## Modes

| Mode | When to Use |
|------|-------------|
| Fast Mode | Simple, well-defined tasks. Minimal context, direct answer. |
| Deep Mode | Complex analysis. Full context, step-by-step reasoning, verification. |
| Expert Mode | Domain-specific tasks. Assign expert role, use domain terminology. |
| Creative Mode | Brainstorming, content creation. Relaxed constraints, encourage exploration. |
| Analysis Mode | Data interpretation, decision support. Structured reasoning, comparison. |

## 2026 Rule: Stop Search-Style Prompts

```
❌ "Tell me about X"                    → vague, unreliable output
✅ "You are a [role]. Here is [context]. 
   Based on [source], analyze [specific aspect]. 
   Format as [structure]. Verify against [criteria]."
```

Think like a teammate, not a search engine. Add instructions. Provide examples. Define expected outcomes.

---

*Part of the AI-Agent framework — production-grade prompting for reliable AI outputs.*