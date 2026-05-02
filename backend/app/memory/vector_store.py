"""
Vector Store – FAISS-based in-memory vector database for agent memory.
Supports add, search, and delete operations.

For production scale: swap FAISS for Pinecone, Weaviate, or pgvector.
"""

import logging
from typing import List, Optional

import faiss
import numpy as np

from app.core.config import settings

logger = logging.getLogger(__name__)

# ── Index ─────────────────────────────────────────────────────────────────────
_index:  faiss.IndexFlatL2 = faiss.IndexFlatL2(settings.VECTOR_DIMENSION)
_store:  list[dict]        = []   # parallel list: [{"content": str, "metadata": dict}]


def add_vector(vector: List[float], content: str, metadata: Optional[dict] = None) -> int:
    """
    Add an embedding vector with its associated content to the store.

    Args:
        vector:   Embedding vector (must match VECTOR_DIMENSION).
        content:  Original text the embedding represents.
        metadata: Optional key-value metadata (agent name, task id, etc.)

    Returns:
        int: Index of the inserted entry.
    """
    vec = np.array([vector], dtype="float32")
    _index.add(vec)
    entry = {"content": content, "metadata": metadata or {}}
    _store.append(entry)
    idx = len(_store) - 1
    logger.debug("[vector_store] Added vector | idx=%d content=%.40s", idx, content)
    return idx


def search_vectors(vector: List[float], top_k: int = 3) -> List[dict]:
    """
    Find the top-k most similar vectors to the query vector.

    Args:
        vector: Query embedding.
        top_k:  Number of results to return.

    Returns:
        List of dicts: [{"content": str, "metadata": dict, "distance": float}]
    """
    if _index.ntotal == 0:
        return []

    vec = np.array([vector], dtype="float32")
    k   = min(top_k, _index.ntotal)
    distances, indices = _index.search(vec, k)

    results = []
    for dist, idx in zip(distances[0], indices[0]):
        if idx < 0 or idx >= len(_store):
            continue
        entry = _store[idx].copy()
        entry["distance"] = float(dist)
        results.append(entry)

    logger.debug("[vector_store] Search complete | top_k=%d results=%d", top_k, len(results))
    return results


def vector_store_stats() -> dict:
    """Return statistics about the current vector store."""
    return {
        "total_vectors": _index.ntotal,
        "dimension":     settings.VECTOR_DIMENSION,
        "entries":       len(_store),
    }
