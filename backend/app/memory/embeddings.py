"""
Embeddings – generates sentence embeddings using sentence-transformers.
Used to convert text → vectors for vector memory storage and retrieval.
"""

import logging
from typing import List

from app.core.config import settings

logger = logging.getLogger(__name__)

_model = None


def _get_model():
    """Lazy-load the embedding model (avoids slow startup in testing)."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer  # type: ignore
        logger.info("[embeddings] Loading model: %s", settings.EMBEDDING_MODEL)
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return _model


def embed_text(text: str) -> List[float]:
    """
    Generate an embedding vector for a piece of text.

    Args:
        text: The text to embed.

    Returns:
        List[float]: The embedding vector.
    """
    model = _get_model()
    vector = model.encode(text, normalize_embeddings=True).tolist()
    logger.debug("[embeddings] Embedded text | chars=%d dim=%d", len(text), len(vector))
    return vector


def embed_batch(texts: List[str]) -> List[List[float]]:
    """
    Generate embeddings for a batch of texts.

    Args:
        texts: List of text strings to embed.

    Returns:
        List of embedding vectors.
    """
    model = _get_model()
    vectors = model.encode(texts, normalize_embeddings=True).tolist()
    logger.debug("[embeddings] Batch embedded | count=%d", len(texts))
    return vectors
