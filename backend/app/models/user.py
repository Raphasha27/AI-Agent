"""
User Model – SQLAlchemy ORM model for platform users.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email      = Column(String(255), unique=True, nullable=False, index=True)
    username   = Column(String(100), unique=True, nullable=False, index=True)
    hashed_pw  = Column(String(255), nullable=False)
    is_active  = Column(Boolean, default=True, nullable=False)
    is_admin   = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id":         str(self.id),
            "email":      self.email,
            "username":   self.username,
            "is_active":  self.is_active,
            "is_admin":   self.is_admin,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
