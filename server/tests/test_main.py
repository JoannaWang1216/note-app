from uuid import uuid4

import src.models  # pylint: disable=unused-import
from fastapi.testclient import TestClient
from pytest import fixture
from sqlmodel import Session, SQLModel, create_engine, delete
from sqlmodel.pool import StaticPool
from src.main import app, get_session


@fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@fixture
def note(client: TestClient):
    response = client.get("/api/notes")
    assert response.status_code == 200
    assert response.json() == []
    response = client.post("/api/notes", json={"title": "title", "content": "content"})
    assert response.status_code == 200
    new_note = response.json()
    assert new_note["title"] == "title"
    assert new_note["content"] == "content"
    assert "id" in new_note
    assert "created_at" in new_note
    response = client.get("/api/notes")
    assert response.status_code == 200
    assert response.json() == [new_note]
    return new_note


def test_update_note(
    client: TestClient, note: dict
):  # pylint: disable=redefined-outer-name
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


def test_update_note_not_found(client: TestClient):
    response = client.put(
        f"/api/notes/{uuid4()}",
        json={"title": "new title", "content": "new content"},
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "Item not found"}


def test_delete_note(
    client: TestClient, note: dict
):  # pylint: disable=redefined-outer-name
    response = client.delete(f"/api/notes/{note['id']}")
    assert response.status_code == 200
    assert response.json() == note
    response = client.get("/api/notes")
    assert response.status_code == 200
    assert response.json() == []


def test_delete_note_not_found(client: TestClient):
    response = client.delete(f"/api/notes/{uuid4()}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Item not found"}


@fixture(autouse=True)
def reset_notes_database(session: Session):
    yield
    session.exec(delete(src.models.Note))  # type: ignore[call-overload]
    session.commit()
