"""
File Tool – provides agents with safe file read/write operations.
Restricts access to a designated working directory.
"""

import logging
import os
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

# ── Sandbox directory ─────────────────────────────────────────────────────────
WORK_DIR = Path(os.getenv("AGENT_WORK_DIR", "/tmp/agent_workspace"))
WORK_DIR.mkdir(parents=True, exist_ok=True)


def _safe_path(filename: str) -> Path:
    """Resolve a filename inside WORK_DIR and prevent path traversal."""
    resolved = (WORK_DIR / filename).resolve()
    if not str(resolved).startswith(str(WORK_DIR.resolve())):
        raise PermissionError(f"Access denied: {filename!r} is outside the workspace.")
    return resolved


def read_file(filename: str) -> dict:
    """
    Read a file from the agent workspace.

    Returns:
        dict with keys: filename, content (str), success (bool), error (str|None)
    """
    try:
        path    = _safe_path(filename)
        content = path.read_text(encoding="utf-8")
        logger.info("[file_tool] Read file | path=%s chars=%d", path, len(content))
        return {"filename": filename, "content": content, "success": True, "error": None}
    except Exception as exc:  # noqa: BLE001
        logger.error("[file_tool] Read failed | error=%s", exc)
        return {"filename": filename, "content": "", "success": False, "error": str(exc)}


def write_file(filename: str, content: str) -> dict:
    """
    Write content to a file within the agent workspace.

    Returns:
        dict with keys: filename, bytes_written (int), success (bool), error (str|None)
    """
    try:
        path = _safe_path(filename)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        logger.info("[file_tool] Wrote file | path=%s bytes=%d", path, len(content))
        return {"filename": filename, "bytes_written": len(content), "success": True, "error": None}
    except Exception as exc:  # noqa: BLE001
        logger.error("[file_tool] Write failed | error=%s", exc)
        return {"filename": filename, "bytes_written": 0, "success": False, "error": str(exc)}


def list_files() -> dict:
    """List all files in the agent workspace."""
    try:
        files = [str(p.relative_to(WORK_DIR)) for p in WORK_DIR.rglob("*") if p.is_file()]
        return {"files": files, "count": len(files), "success": True}
    except Exception as exc:  # noqa: BLE001
        return {"files": [], "count": 0, "success": False, "error": str(exc)}
