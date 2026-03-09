"""
CodingAgent – Writes, reviews, and explains code using LLM reasoning.
Optionally executes code snippets through the Python executor tool.
"""

import logging

from app.agents.base_agent import BaseAgent
from app.tools.python_executor import execute_python

logger = logging.getLogger(__name__)


class CodingAgent(BaseAgent):
    """
    AI agent specialised in software development tasks.
    Can write, review, explain, debug, and optionally run code.
    """

    name = "coder"
    role = (
        "Expert software engineer. "
        "You write clean, efficient, well-commented code and explain your reasoning."
    )

    def write_code(self, description: str, language: str = "python") -> dict:
        """
        Generate code for a given natural-language description.

        Args:
            description: What the code should do.
            language:    Target programming language.

        Returns:
            dict with keys: agent, description, language, code, explanation
        """
        prompt = f"""
Write {language} code for the following requirement:

REQUIREMENT:
{description}

Instructions:
1. Write clean, production-ready {language} code.
2. Add clear comments and docstrings.
3. Handle edge cases and errors where appropriate.
4. After the code block, provide a brief explanation.

Format:
```{language}
<your code here>
```

EXPLANATION:
<short explanation of your implementation choices>
"""

        raw = self.think(prompt, temperature=0.1)
        code, explanation = self._parse_response(raw, language)

        return {
            "agent":       self.name,
            "description": description,
            "language":    language,
            "code":        code,
            "explanation": explanation,
            "raw":         raw,
        }

    def execute_code(self, code: str) -> dict:
        """
        Execute Python code in a sandboxed environment and return output.

        Args:
            code: Python source code string.

        Returns:
            dict with keys: agent, code, stdout, stderr, success
        """
        logger.info("[%s] Executing code snippet | chars=%d", self.name, len(code))
        result = execute_python(code)
        return {"agent": self.name, "code": code, **result}

    def review_code(self, code: str) -> dict:
        """
        Review existing code and provide improvement suggestions.
        """
        prompt = f"""
Review the following code and provide detailed feedback:

```
{code}
```

Your review should cover:
1. Correctness – does it do what it appears to intend?
2. Code quality – readability, naming, structure
3. Performance – any obvious inefficiencies
4. Security – any potential vulnerabilities
5. Suggestions – specific improvements with example fixes

Be specific, constructive, and concise.
"""
        review = self.think(prompt, temperature=0.3)
        return {"agent": self.name, "code": code, "review": review}

    # ── Helpers ───────────────────────────────────────────────────────────────

    @staticmethod
    def _parse_response(raw: str, language: str) -> tuple[str, str]:
        """Extract code block and explanation from raw LLM output."""
        code        = ""
        explanation = ""
        in_code     = False
        code_lines  = []
        exp_lines   = []
        capture_exp = False

        for line in raw.splitlines():
            if line.strip().startswith(f"```{language}") or line.strip() == "```":
                if in_code:
                    in_code = False
                    capture_exp = True
                else:
                    in_code = True
                continue

            if in_code:
                code_lines.append(line)
            elif capture_exp and "EXPLANATION:" not in line:
                exp_lines.append(line)

        code        = "\n".join(code_lines).strip()
        explanation = "\n".join(exp_lines).strip()
        return code, explanation
