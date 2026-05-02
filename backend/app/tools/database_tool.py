"""
Database Tool – provides agents with safe, parametrised SQL query execution.
"""

import logging
from typing import Any, List

from sqlalchemy import text

from app.db.database import get_db_session

logger = logging.getLogger(__name__)


def run_query(sql: str, params: dict | None = None) -> dict:
    """
    Execute a read-only SQL query and return results.

    Args:
        sql:    Parametrised SQL query string.
        params: Optional dict of query parameters.

    Returns:
        dict with keys:
            rows    (List[dict]) – query results
            count   (int)        – number of rows
            success (bool)
            error   (str|None)
    """
    logger.info("[database_tool] Executing query | sql=%.80s", sql)

    try:
        with get_db_session() as session:
            result = session.execute(text(sql), params or {})
            columns = result.keys()
            rows = [dict(zip(columns, row)) for row in result.fetchall()]

        logger.info("[database_tool] Query complete | rows=%d", len(rows))
        return {"rows": rows, "count": len(rows), "success": True, "error": None}

    except Exception as exc:  # noqa: BLE001
        logger.error("[database_tool] Query failed | error=%s", exc)
        return {"rows": [], "count": 0, "success": False, "error": str(exc)}
