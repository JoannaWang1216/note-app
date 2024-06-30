from sqlmodel import SQLModel, create_engine  # pylint: disable=unused-import

from . import models  # pylint: disable=unused-import

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url)
