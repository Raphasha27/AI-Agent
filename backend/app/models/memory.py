"""
Memory Model – SQLAlchemy ORM model for persisted agent memory entries.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class MemoryEntry(Base):
    __tablename__ = "memory_entries"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_name = Column(String(100), nullable=False, index=True)
    content    = Column(Text, nullable=False)
    summary    = Column(Text, nullable=True)
    task_id    = Column(UUID(as_uuid=True), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id":         str(self.id),
            "agent_name": self.agent_name,
            "content":    self.content,
            "summary":    self.summary,
            "task_id":    str(self.task_id) if self.task_id else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
