from typing import Annotated, MutableSequence
from uuid import uuid4

from fastapi import Depends, FastAPI, HTTPException, status
from pydantic import UUID4, BaseModel


class NoteWrite(BaseModel):
    title: str
    content: str


class Note(NoteWrite):
    id: UUID4


app = FastAPI()


class NotesStore:  # pylint: disable=too-few-public-methods
    def __init__(self, notes: MutableSequence[Note]):
        self.notes: MutableSequence[Note] = notes


notes_store = NotesStore([])


@app.get("/api/notes")
async def get_notes():
    return notes_store.notes


@app.get("/api/notes/{uuid}")
async def get_note(uuid: UUID4):
    if not any(n.id == uuid for n in notes_store.notes):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    return next(n for n in notes_store.notes if n.id == uuid)


@app.post("/api/notes")
async def add_note(note: NoteWrite):
    new_note = Note(id=uuid4(), title=note.title, content=note.content)
    notes_store.notes.insert(0, new_note)
    return new_note


@app.put("/api/notes/{uuid}", dependencies=[Depends(get_note)])
async def update_note(uuid: UUID4, note_write: NoteWrite):
    notes_store.notes = [
        (
            Note(id=uuid, title=note_write.title, content=note_write.content)
            if n.id == uuid
            else n
        )
        for n in notes_store.notes
    ]
    return note_write


@app.delete("/api/notes/{uuid}")
async def delete_note(uuid: UUID4, note: Annotated[Note, Depends(get_note)]):
    notes_store.notes = [n for n in notes_store.notes if n.id != uuid]
    return note
