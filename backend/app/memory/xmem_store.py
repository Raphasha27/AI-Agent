"""
Xmem Store – Advanced Memory Layer based on the Hermes paradigm.
Handles dual memory streams: User Preferences and Workflow Lessons.
"""

import logging
from typing import List, Optional, Dict
from app.memory.embeddings import embed_text
from app.memory.vector_store import add_vector, search_vectors

logger = logging.getLogger(__name__)

# Mocked Xmem streams
STREAM_PREFS = "user_preferences"
STREAM_WORKFLOW = "workflow_lessons"

def xmem_save(stream: str, content: str, metadata: Optional[Dict] = None) -> int:
    """Save to a specific Xmem stream."""
    meta = metadata or {}
    meta["xmem_stream"] = stream
    vector = embed_text(content)
    idx = add_vector(vector, content, meta)
    logger.info("[xmem] Saved to %s | content=%.40s", stream, content)
    return idx

def xmem_retrieve(stream: str, query: str, top_k: int = 3) -> List[Dict]:
    """Retrieve from a specific Xmem stream."""
    vector = embed_text(query)
    # We ideally would filter by metadata within vector_store, 
    # but for this iteration we'll do simple post-filtering.
    results = search_vectors(vector, top_k=top_k * 2) 
    
    # Filter by stream
    filtered = [r for r in results if r.get("metadata", {}).get("xmem_stream") == stream]
    return filtered[:top_k]

def merge_context(query: str) -> str:
    """Merges both streams into a single context for the LLM."""
    prefs = xmem_retrieve(STREAM_PREFS, query, top_k=2)
    workflows = xmem_retrieve(STREAM_WORKFLOW, query, top_k=2)
    
    context = []
    if prefs:
        context.append("### User Preferences & Identity ###")
        for p in prefs:
            context.append(f"- {p['content']}")
            
    if workflows:
        context.append("### Workflow & Lessons Learned ###")
        for w in workflows:
            context.append(f"- {w['content']}")
            
    return "\n".join(context) if context else "No historical Xmem context available."
