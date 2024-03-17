import { ClickAwayListener } from "@mui/base";
import { Delete, Note as NoteIcon } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
  Input,
  Modal,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";

function App() {
  type Note = {
    id: string;
    title: string;
    content: string;
  };
  const [newNote, setNewNote] = React.useState<undefined | Note>(undefined);

  const storedNotes = localStorage.getItem("notes");
  const [notes, setNotes] = React.useState<Note[]>(
    storedNotes ? JSON.parse(storedNotes) : [],
  );
  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const [editingNote, setEditingNote] = React.useState<undefined | Note>(
    undefined,
  );

  function addNote(note?: Note) {
    if (note === undefined) return;
    if (note.title.length === 0 && note.content.length === 0) {
      setNewNote(undefined);
      return;
    }
    setNotes((notes) => [{ ...note, id: crypto.randomUUID() }, ...notes]);
    setNewNote(undefined);
  }

  function updateNote(note?: Note) {
    if (note === undefined) return;
    setNotes((notes) => [
      { ...note },
      ...notes.filter((n) => n.id !== note.id),
    ]);
    setEditingNote(undefined);
  }

  function removeNote(note?: Note) {
    if (note === undefined) return;
    setNotes(notes.filter((n) => n.id !== note.id));
    setEditingNote(undefined);
  }

  return (
    <Box>
      <AppBar position="static" style={{ background: "#808080" }}>
        <Toolbar disableGutters>
          <NoteIcon fontSize="large" display="flex" sx={{ mr: 1, ml: 1.5 }} />
          <Typography variant="h6" display="flex" mr={2} fontWeight={700}>
            Note
          </Typography>
        </Toolbar>
      </AppBar>
      {newNote === undefined ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="auto"
          p={2}
        >
          <Card variant="outlined" sx={{ minWidth: 600, boxShadow: 3 }}>
            <Input
              disableUnderline
              inputProps={{
                style: { fontWeight: 700 },
              }}
              fullWidth
              sx={{ p: 1.5 }}
              placeholder="Take a note..."
              onClick={() => setNewNote({ id: "", title: "", content: "" })}
            />
          </Card>
        </Box>
      ) : (
        <ClickAwayListener onClickAway={() => addNote(newNote)}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="auto"
            p={2}
          >
            <Card variant="outlined" sx={{ minWidth: 600, boxShadow: 3 }}>
              <Input
                autoFocus={true} // eslint-disable-line jsx-a11y/no-autofocus
                disableUnderline
                inputProps={{
                  style: { fontWeight: 700 },
                }}
                fullWidth
                multiline
                sx={{ p: 1.5, mb: 1.5 }}
                placeholder="Title"
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
              />
              <Input
                disableUnderline
                inputProps={{ style: { fontWeight: 700 } }}
                fullWidth
                multiline
                sx={{ p: 1.5, mb: 1 }}
                placeholder="Take a note..."
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
              />
              <CardActions style={{ justifyContent: "flex-end" }}>
                <Button
                  sx={{ color: "#808080" }}
                  onClick={() => addNote(newNote)}
                >
                  Close
                </Button>
              </CardActions>
            </Card>
          </Box>
        </ClickAwayListener>
      )}
      <Box>
        <Modal
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          open={editingNote !== undefined}
          onClose={() => updateNote(editingNote)}
        >
          <Card variant="outlined" sx={{ width: 600, boxShadow: 3 }}>
            <Input
              disableUnderline
              inputProps={{
                style: { fontWeight: 700 },
              }}
              fullWidth
              multiline
              sx={{ p: 1.5, mb: 1.5 }}
              onChange={(e) => {
                if (editingNote === undefined) return;
                setEditingNote({ ...editingNote, title: e.target.value });
              }}
              value={editingNote?.title ?? ""}
            />
            <Input
              disableUnderline
              inputProps={{
                style: { fontWeight: 700 },
              }}
              fullWidth
              multiline
              sx={{ p: 1.5, mb: 1 }}
              onChange={(e) => {
                if (editingNote === undefined) return;
                setEditingNote({ ...editingNote, content: e.target.value });
              }}
              value={editingNote?.content ?? ""}
            />
            <CardActions style={{ justifyContent: "space-between" }}>
              <IconButton onClick={() => removeNote(editingNote)}>
                <Delete> Delete </Delete>
              </IconButton>
              <Button
                sx={{ color: "#808080" }}
                onClick={() => updateNote(editingNote)}
              >
                Close
              </Button>
            </CardActions>
          </Card>
        </Modal>
      </Box>
      <Box pl={1}>
        <Masonry columns={5} spacing={1}>
          {notes.map((note) => (
            <Card
              key={note.id}
              variant="outlined"
              sx={{ width: 250, boxShadow: 3 }}
            >
              <CardActionArea
                onClick={() =>
                  setEditingNote(notes.filter((n) => n.id === note.id)[0])
                }
              >
                <CardContent>
                  <Typography style={{ wordWrap: "break-word" }}>
                    {note.title}
                  </Typography>
                  <Typography style={{ wordWrap: "break-word" }}>
                    {note.content}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Masonry>
      </Box>
    </Box>
  );
}

export default App;
