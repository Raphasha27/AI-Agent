"""
Tasks API Routes – CRUD endpoints for task management.
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.task_service import (
    create_task,
    delete_task,
    get_task,
    list_tasks,
    update_task_status,
)

logger = logging.getLogger(__name__)
router = APIRouter()


# ── Schemas ───────────────────────────────────────────────────────────────────

class TaskCreateRequest(BaseModel):
    title:       str           = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class TaskStatusUpdate(BaseModel):
    status:     str
    result:     Optional[str] = None
    agent_used: Optional[str] = None


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/", summary="List all tasks")
def get_tasks(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    tasks = list_tasks(db, limit=limit, offset=offset)
    return [t.to_dict() for t in tasks]


@router.post("/", summary="Create a new task", status_code=201)
def create_new_task(body: TaskCreateRequest, db: Session = Depends(get_db)):
    task = create_task(db, title=body.title, description=body.description)
    return task.to_dict()


@router.get("/{task_id}", summary="Get a task by ID")
def get_task_by_id(task_id: str, db: Session = Depends(get_db)):
    task = get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task.to_dict()


@router.patch("/{task_id}/status", summary="Update task status")
def update_status(task_id: str, body: TaskStatusUpdate, db: Session = Depends(get_db)):
    task = update_task_status(
        db, task_id=task_id, status=body.status,
        result=body.result, agent_used=body.agent_used,
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task.to_dict()


@router.delete("/{task_id}", summary="Delete a task", status_code=204)
def delete_task_by_id(task_id: str, db: Session = Depends(get_db)):
    deleted = delete_task(db, task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")
