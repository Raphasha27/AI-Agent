import os
import logging
from typing import Dict

logger = logging.getLogger(__name__)

SKILLS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "skills")

def generate_skill(skill_name: str, description: str, instructions: str) -> str:
    """
    Automatically write a new SKILL.md file to cache a complex workflow.
    This creates a new dynamic skill that the agent can load later.
    """
    # Ensure safe skill name for directory
    safe_name = "".join(c for c in skill_name if c.isalnum() or c in ("-", "_")).lower()
    skill_path = os.path.join(SKILLS_DIR, safe_name)
    
    os.makedirs(skill_path, exist_ok=True)
    
    skill_file = os.path.join(skill_path, "SKILL.md")
    
    content = f"""---
name: {safe_name}
description: {description}
---

# {skill_name}

## Description
{description}

## Instructions
{instructions}
"""

    try:
        with open(skill_file, 'w', encoding='utf-8') as f:
            f.write(content)
        logger.info("[skill_generator] Generated new skill at %s", skill_file)
        return f"Successfully generated skill '{safe_name}' at {skill_file}"
    except Exception as e:
        logger.error("[skill_generator] Failed to write skill: %s", str(e))
        return f"Error writing skill: {str(e)}"
