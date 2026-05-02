"""
Task Model – SQLAlchemy ORM model for agent tasks.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Enum, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class TaskStatus:
    PENDING    = "pending"
    RUNNING    = "running"
    COMPLETED  = "completed"
    FAILED     = "failed"


class Task(Base):
    __tablename__ = "tasks"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title      = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status     = Column(
        Enum("pending", "running", "completed", "failed", name="task_status"),
        default=TaskStatus.PENDING,
        nullable=False,
    )
    result     = Column(Text, nullable=True)
    agent_used = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self) -> dict:
        return {
            "id":          str(self.id),
            "title":       self.title,
            "description": self.description,
            "status":      self.status,
            "result":      self.result,
            "agent_used":  self.agent_used,
            "created_at":  self.created_at.isoformat() if self.created_at else None,
            "updated_at":  self.updated_at.isoformat() if self.updated_at else None,
        }
