from uuid import uuid4

from fastapi.testclient import TestClient
from pytest import fixture
from src.main import app, notes_store

client = TestClient(app)


@fixture
def note():
    response = client.get("/api/notes")
    assert response.status_code == 200
    assert response.json() == []
    response = client.post("/api/notes", json={"title": "title", "content": "content"})
    assert response.status_code == 200
    new_note = response.json()
    assert new_note["title"] == "title"
    assert new_note["content"] == "content"
    assert "id" in new_note
    response = client.get("/api/notes")
    assert response.status_code == 200
    assert response.json() == [new_note]
    return new_note


def test_update_note(note: dict):  # pylint: disable=redefined-outer-name
    response = client.put(
        f"/api/notes/{note['id']}",
        json={"title": "new title", "content": "new content"},
    )
    assert response.status_code == 200
    updated_note = response.json()
    assert updated_note["title"] == "new title"
    assert updated_note["content"] == "new content"
    response = client.get("/api/notes")
    assert response.status_code == 200
    assert response.json() == [updated_note]


def test_update_note_not_found():
    response = client.put(
        f"/api/notes/{uuid4()}",
        json={"title": "new title", "content": "new content"},
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "Item not found"}


def test_delete_note(note: dict):  # pylint: disable=redefined-outer-name
    response = client.delete(f"/api/notes/{note['id']}")
    assert response.status_code == 200
    assert response.json() == note
    response = client.get("/api/notes")
    assert response.status_code == 200
    assert response.json() == []


def test_delete_note_not_found():
    response = client.delete(f"/api/notes/{uuid4()}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Item not found"}


@fixture(autouse=True)
def reset_notes_store():
    yield
    notes_store.notes = []
