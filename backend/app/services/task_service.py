"""
Task Service – CRUD operations for task management.
"""

import logging
import uuid
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.task import Task, TaskStatus

logger = logging.getLogger(__name__)


def create_task(db: Session, title: str, description: Optional[str] = None) -> Task:
    task = Task(title=title, description=description, status=TaskStatus.PENDING)
    db.add(task)
    db.commit()
    db.refresh(task)
    logger.info("[task_service] Task created | id=%s title=%s", task.id, title)
    return task


def get_task(db: Session, task_id: str) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()


def list_tasks(db: Session, limit: int = 50, offset: int = 0) -> List[Task]:
    return db.query(Task).order_by(Task.created_at.desc()).offset(offset).limit(limit).all()


def update_task_status(
    db: Session,
    task_id: str,
    status: str,
    result: Optional[str] = None,
    agent_used: Optional[str] = None,
) -> Optional[Task]:
    task = get_task(db, task_id)
    if not task:
        return None
    task.status     = status
    task.result     = result
    task.agent_used = agent_used
    db.commit()
    db.refresh(task)
    logger.info("[task_service] Task updated | id=%s status=%s", task_id, status)
    return task


def delete_task(db: Session, task_id: str) -> bool:
    task = get_task(db, task_id)
    if not task:
        return False
    db.delete(task)
    db.commit()
    logger.info("[task_service] Task deleted | id=%s", task_id)
    return True
