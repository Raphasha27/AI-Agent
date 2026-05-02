# 🧠 Future AGI | AI Optimization Cheat Sheet

Maximize the intelligence of your agents by following these elite optimization strategies.

## 1. Context > Prompts
Stop writing 500-word prompts. Instead, feed the agent your files. Future AGI is designed to index your local context using **Vector Memory (FAISS)**.
*   **Strategy:** Upload your business rules, voice guidelines, and past examples.
*   **Prompt:** "Read the files in the `/context` directory first. Ask me clarifying questions before executing."

## 2. The 29-Word Rule
Keep instructions concise and goal-oriented. 
*   **Formula:** "I want to [task] so that [goal]. Read the relevant files. Use `AskUserQuestion` if anything is unclear."

## 3. Examples > Prescriptions
Claude and other LLMs learn faster from **examples** than from descriptions.
*   **Strategy:** Provide 3-5 examples of the output you want. 
*   **Prompt:** "Analyze these 3 LinkedIn posts. Write a new one for [topic] using this exact voice and structure."

## 4. Forced Clarification (`AskUserQuestion`)
Don't let the agent guess. Force it to ask for missing data.
*   **Implementation:** The Future AGI core will pause execution and generate a form for you to fill if it detects ambiguity.

## 5. Skills & Slash Commands
Turn repetitive workflows into slash commands to drop your prompt length to 10 words.
*   `/social-post` -> Triggers the Social Media Growth Engine.
*   `/lead-qual` -> Triggers the Voice AI qualification flow.
*   `/audit` -> Triggers the Security Engine.

## 6. Project Hierarchy
Organize your agent's workspace into these 3 folders:
*   `IDENTITY/`: Your rules, bio, and brand voice.
*   `PATTERNS/`: Reusable templates for reports, emails, and code.
*   `DELIVERABLES/`: Where final outputs are stored and versioned.

---
*Optimized for Future AGI v2.0 | Kirov Dynamics Standards*
