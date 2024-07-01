from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import UUID4, BaseModel
from sqlmodel import Session, select

from . import models
from .db import SQLModel, engine

origins = [
    "http://localhost:3000",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


class NoteWrite(BaseModel):
    title: str
    content: str


@app.get("/api/notes")
async def get_notes(session: Annotated[Session, Depends(get_session)]):
    notes = session.exec(
        select(models.Note).order_by(
            models.Note.created_at.desc()  # pylint: disable=no-member # type: ignore
        )
    ).all()
    return notes


@app.get("/api/notes/{uuid}")
async def get_note(uuid: UUID4, session: Annotated[Session, Depends(get_session)]):
    note = session.exec(select(models.Note).where(models.Note.id == uuid)).first()
    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    return note


@app.post("/api/notes")
async def add_note(note: NoteWrite, session: Annotated[Session, Depends(get_session)]):
    new_note = models.Note(title=note.title, content=note.content)
    session.add(new_note)
    copied_note = new_note.model_copy()
    session.commit()
    return copied_note


@app.put("/api/notes/{uuid}", dependencies=[Depends(get_note)])
async def update_note(
    uuid: UUID4,
    note_write: NoteWrite,
    session: Annotated[Session, Depends(get_session)],
):
    note = session.exec(select(models.Note).where(models.Note.id == uuid)).one()
    note.title = note_write.title
    note.content = note_write.content
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


@app.delete("/api/notes/{uuid}")
async def delete_note(
    uuid: UUID4,
    session: Annotated[Session, Depends(get_session)],
    note: Annotated[models.Note, Depends(get_note)],
):
    note_to_delete = session.exec(
        select(models.Note).where(models.Note.id == uuid)
    ).one()
    session.delete(note_to_delete)
    session.commit()
    return note
