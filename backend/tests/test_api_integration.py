import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "battledex-api"


def test_get_pokemon_not_found():
    response = client.get("/api/v1/pokemon/thisdoesnotexist999")
    assert response.status_code == 404


def test_search_requires_query():
    response = client.get("/api/v1/pokemon")
    assert response.status_code == 422
