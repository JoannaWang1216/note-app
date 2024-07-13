from sqlmodel import SQLModel, create_engine  # pylint: disable=unused-import

from . import models  # pylint: disable=unused-import

SQLITE_FILE_NAME = "database.db"
sqlite_url = f"sqlite:///{SQLITE_FILE_NAME}"

engine = create_engine(sqlite_url)
