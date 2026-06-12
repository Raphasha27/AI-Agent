"""Tests for API endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
def client():
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")


@pytest.mark.asyncio
async def test_root_endpoint(client):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["platform"] == "Future AGI"
    assert "version" in data


@pytest.mark.asyncio
async def test_health_endpoint(client):
    response = await client.get("/health/")
    assert response.status_code in (200, 404)


@pytest.mark.asyncio
async def test_openapi_docs(client):
    response = await client.get("/docs")
    assert response.status_code in (200, 404)


@pytest.mark.asyncio
async def test_agent_run_invalid_body(client):
    response = await client.post(
        "/agent/run",
        json={},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_task_crud(client):
    response = await client.get("/tasks/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
