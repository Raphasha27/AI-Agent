"""
Web Search Tool – queries DuckDuckGo Instant Answer API.
Returns cleaned, structured results.
"""

import logging
from typing import Optional

import requests
from requests.exceptions import RequestException

from app.core.config import settings

logger = logging.getLogger(__name__)

DDGO_URL = "https://api.duckduckgo.com/"


def search_web(query: str, max_results: int = 5) -> str:
    """
    Search the web using DuckDuckGo's Instant Answer API.

    Args:
        query:       The search query.
        max_results: Maximum number of related topics to include.

    Returns:
        A formatted string containing the search results, or an error message.
    """
    logger.info("[web_search] Searching | query=%s", query[:80])

    try:
        resp = requests.get(
            DDGO_URL,
            params={"q": query, "format": "json", "no_html": 1, "skip_disambig": 1},
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
    except RequestException as exc:
        logger.error("[web_search] Request failed | error=%s", exc)
        return f"Search failed: {exc}"

    lines = []

    # ── Abstract (main answer) ─────────────────────────────────────────────
    if data.get("Abstract"):
        lines.append(f"ABSTRACT:\n{data['Abstract']}\nSource: {data.get('AbstractURL', '')}")

    # ── Related topics ────────────────────────────────────────────────────
    topics = data.get("RelatedTopics", [])[:max_results]
    if topics:
        lines.append("\nRELATED TOPICS:")
        for t in topics:
            if isinstance(t, dict) and t.get("Text"):
                lines.append(f"  - {t['Text']}")

    # ── Answer (short direct answer) ──────────────────────────────────────
    if data.get("Answer"):
        lines.append(f"\nDIRECT ANSWER:\n{data['Answer']}")

    if not lines:
        return f"No results found for query: '{query}'"

    result = "\n".join(lines)
    logger.info("[web_search] Results retrieved | chars=%d", len(result))
    return result
