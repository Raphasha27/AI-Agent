"""
Structured logging configuration using Python's logging module.
JSON-friendly format in production, human-readable in development.
"""

import logging
import sys

from app.core.config import settings


def configure_logging() -> None:
    """
    Configure root logger. Call once at application startup.
    """
    level = logging.DEBUG if settings.DEBUG else logging.INFO

    fmt = (
        "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
        if settings.DEBUG
        else '{"time":"%(asctime)s","level":"%(levelname)s","logger":"%(name)s","msg":"%(message)s"}'
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(fmt))

    root = logging.getLogger()
    root.setLevel(level)
    root.handlers = [handler]

    # Silence noisy third-party loggers
    for noisy in ("httpx", "openai", "uvicorn.access"):
        logging.getLogger(noisy).setLevel(logging.WARNING)

    logging.getLogger(__name__).info(
        "Logging configured | level=%s debug=%s", logging.getLevelName(level), settings.DEBUG
    )
