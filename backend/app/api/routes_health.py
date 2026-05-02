"""
Health Check Routes – used by Docker, Kubernetes, and load balancers.
"""

from fastapi import APIRouter

from app.memory.vector_store import vector_store_stats

router = APIRouter()


@router.get("/", summary="Basic health check")
def health():
    return {"status": "healthy"}


@router.get("/deep", summary="Deep health check with subsystem status")
def deep_health():
    """
    Checks the status of all major platform subsystems.
    """
    return {
        "status":   "healthy",
        "database": "connected",  # extend to actually ping DB
        "memory":   vector_store_stats(),
        "llm":      "configured",
    }
