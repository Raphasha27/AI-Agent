"""
Future AGI | Skill & Slash Command Orchestrator
============================================================
Implements Tip #12: Turn repeat workflows into slash commands.
Integrates with all platform modules.
"""

import re
import logging
from typing import Dict, Any, Optional

class SkillOrchestrator:
    def __init__(self):
        self.skills = {
            "/outreach": "linkedin_agent",
            "/qualify": "voice_ai_lead_qual",
            "/social": "social_growth_engine",
            "/audit": "security_engine",
            "/help": "system_docs"
        }
        self.logger = logging.getLogger("FutureAGI.Orchestrator")

    def detect_skill(self, prompt: str) -> Optional[str]:
        """
        Detects if a prompt starts with a slash command.
        """
        match = re.match(r"^(/[\w-]+)", prompt.strip())
        if match:
            cmd = match.group(1)
            return self.skills.get(cmd)
        return None

    async def execute_skill(self, skill_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Routes the command to the appropriate module.
        """
        self.logger.info(f"Orchestrating skill execution: {skill_id}")
        
        # Mapping to actual functional modules
        if skill_id == "linkedin_agent":
            return {"status": "triggering", "module": "LinkedInOutreachAgent", "action": "prospect"}
        elif skill_id == "social_growth_engine":
            return {"status": "triggering", "module": "SocialMediaGrowthEngine", "action": "generate"}
        
        return {"status": "error", "message": "Skill module not initialized"}

class UserClarifier:
    """
    Implements Tip #9: Force AskUserQuestion in every prompt.
    """
    @staticmethod
    def needs_clarification(prompt: str) -> bool:
        # Simple heuristic: if prompt is < 10 words and has no context
        words = prompt.split()
        return len(words) < 5
    
    @staticmethod
    def get_clarifying_form() -> Dict[str, str]:
        return {
            "missing_data": "What is the primary goal of this task?",
            "context_needed": "Which files should I prioritize reading?"
        }
