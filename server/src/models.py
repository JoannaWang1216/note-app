import datetime
import uuid
from uuid import uuid4

from pydantic import field_serializer
from sqlmodel import Field, SQLModel


class Note(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid4, primary_key=True)
    title: str
    content: str
    created_at: datetime.datetime = Field(
        default_factory=lambda: datetime.datetime.now(datetime.UTC)
    )

    # WORKAROUND: for unknown reason, sometimes SQLModel serialize datetime without the suffix 'Z'
    @field_serializer("created_at")
    def serialize_created_at(self, created_at: datetime.datetime, _info):
        if created_at.isoformat().endswith("+00:00"):
            return created_at.isoformat().replace("+00:00", "Z")
        return created_at.isoformat() + "Z"
