"""
Memory Manager – high-level API for storing and retrieving agent memory.
Ties together the embeddings module and the vector store.
"""

import logging
from typing import List, Optional

from app.memory.embeddings import embed_text
from app.memory.vector_store import add_vector, search_vectors, vector_store_stats
from app.memory.xmem_store import xmem_save, merge_context, STREAM_PREFS, STREAM_WORKFLOW

logger = logging.getLogger(__name__)


def remember(content: str, metadata: Optional[dict] = None) -> int:
    """
    Store a piece of information in long-term vector memory.

    Args:
        content:  The text to remember.
        metadata: Optional context (e.g., agent name, task id, timestamp).

    Returns:
        int: Vector store index of the saved memory.
    """
    # Defaulting to workflow lessons for standard remember calls
    idx = xmem_save(STREAM_WORKFLOW, content, metadata)
    logger.info("[memory] Xmem Stored workflow | idx=%d content=%.50s", idx, content)
    return idx

def remember_preference(content: str) -> int:
    """Explicitly save a user preference or agent identity trait."""
    idx = xmem_save(STREAM_PREFS, content)
    logger.info("[memory] Xmem Stored preference | idx=%d content=%.50s", idx, content)
    return idx


def recall(query: str, top_k: int = 3) -> List[dict]:
    """
    Retrieve the most relevant memories for a given query.

    Args:
        query:  The text to search for.
        top_k:  Number of top matches to return.

    Returns:
        List of memory dicts: [{"content": str, "metadata": dict, "distance": float}]
    """
    vector  = embed_text(query)
    results = search_vectors(vector, top_k=top_k)
    logger.info("[memory] Recalled memories | query=%.40s count=%d", query, len(results))
    return results


def recall_as_context(query: str, top_k: int = 3) -> str:
    """
    Retrieve memories and format them as a string for LLM context injection.

    Returns:
        str: Formatted context block.
    """
    # Inject Xmem merged context
    return merge_context(query)


def memory_stats() -> dict:
    """Return current memory store statistics."""
    return vector_store_stats()
