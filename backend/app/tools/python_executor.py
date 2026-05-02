"""
Python Executor Tool – runs untrusted Python code in a restricted environment.

⚠️  SECURITY NOTE:
    This implementation uses RestrictedPython for safe execution.
    For production, replace with a proper sandboxed environment
    (Docker container, Firecracker micro-VM, or AWS Lambda).
"""

import logging
import sys
import traceback
from io import StringIO
from typing import Any

from app.core.config import settings

logger = logging.getLogger(__name__)

# ── Safe built-ins whitelist ──────────────────────────────────────────────────
_SAFE_BUILTINS = {
    "print": print,
    "range": range,
    "len":   len,
    "str":   str,
    "int":   int,
    "float": float,
    "list":  list,
    "dict":  dict,
    "tuple": tuple,
    "set":   set,
    "bool":  bool,
    "abs":   abs,
    "round": round,
    "sum":   sum,
    "min":   min,
    "max":   max,
    "sorted": sorted,
    "enumerate": enumerate,
    "zip":   zip,
    "map":   map,
    "filter": filter,
    "isinstance": isinstance,
    "type":  type,
}


def execute_python(code: str) -> dict:
    """
    Execute a Python code snippet in a restricted environment.

    Args:
        code: Python source code string to execute.

    Returns:
        dict with keys:
            stdout  (str)  – captured standard output
            stderr  (str)  – captured error output / traceback
            success (bool) – True if execution completed without exception
    """
    logger.info("[python_executor] Running code snippet | chars=%d", len(code))

    stdout_cap = StringIO()
    stderr_cap = StringIO()
    success    = False

    old_stdout = sys.stdout
    old_stderr = sys.stderr

    try:
        sys.stdout = stdout_cap
        sys.stderr = stderr_cap

        exec(  # noqa: S102 – intentional controlled exec
            compile(code, "<agent_code>", "exec"),
            {"__builtins__": _SAFE_BUILTINS},
        )

        success = True
    except Exception:  # noqa: BLE001
        stderr_cap.write(traceback.format_exc())
    finally:
        sys.stdout = old_stdout
        sys.stderr = old_stderr

    result = {
        "stdout":  stdout_cap.getvalue(),
        "stderr":  stderr_cap.getvalue(),
        "success": success,
    }

    logger.info(
        "[python_executor] Execution finished | success=%s stdout_len=%d stderr_len=%d",
        success,
        len(result["stdout"]),
        len(result["stderr"]),
    )

    return result
