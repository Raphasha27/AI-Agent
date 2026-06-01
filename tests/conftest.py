"""Pytest configuration and fixtures."""

import sys
from pathlib import Path

# Ensure backend is importable
sys.path.insert(0, str(Path(__file__).parent.parent / "backend"))
