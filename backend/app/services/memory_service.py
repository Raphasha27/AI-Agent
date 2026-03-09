"""
Memory Service – stores and retrieves agent memories.
Bridges the HTTP layer, PostgreSQL persistence, and in-memory vector store.
"""

import logging
from typing import List, Optional

from sqlalchemy.orm import Session

from app.memory.memory_manager import recall, remember
from app.models.memory import MemoryEntry

logger = logging.getLogger(__name__)


def save_memory(
    db: Session,
    agent_name: str,
    content: str,
    task_id: Optional[str] = None,
    summary: Optional[str] = None,
) -> MemoryEntry:
    """Persist a memory entry to both vector store and PostgreSQL."""
    # Save to vector store
    remember(content, metadata={"agent": agent_name, "task_id": task_id})

    # Persist to DB
    entry = MemoryEntry(
        agent_name=agent_name,
        content=content,
        summary=summary,
        task_id=task_id,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    logger.info("[memory_service] Memory saved | agent=%s id=%s", agent_name, entry.id)
    return entry


def retrieve_memories(query: str, top_k: int = 3) -> List[dict]:
    """Retrieve the most relevant memories from the vector store."""
    results = recall(query, top_k=top_k)
    logger.info("[memory_service] Retrieved memories | count=%d", len(results))
    return results


def list_memories(db: Session, agent_name: Optional[str] = None, limit: int = 50) -> List[MemoryEntry]:
    """List all persisted memory entries (optionally filtered by agent)."""
    q = db.query(MemoryEntry).order_by(MemoryEntry.created_at.desc())
    if agent_name:
        q = q.filter(MemoryEntry.agent_name == agent_name)
    return q.limit(limit).all()
