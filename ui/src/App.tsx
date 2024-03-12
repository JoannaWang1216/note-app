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
  interface Note {
    title: string;
    content: string;
  }
  const [newNote, setNewNote] = React.useState<undefined | Note>(undefined);

  interface Notes {
    id: string;
    note: Note;
  }
  const [notes, setNotes] = React.useState<Notes[]>([]);

  const [isDetailedInputFirstExpanded, setIsDetailedInputFirstExpanded] =
    React.useState<boolean>(false);

  const [noteToEdit, setNoteToEdit] = React.useState<undefined | Notes>(
    undefined,
  );

  function addToNotes() {
    const updatedNotes = [...notes];
    if (newNote === undefined) return;
    if (newNote.title.length > 0 || newNote.content.length > 0) {
      updatedNotes.unshift({ id: Date.now().toString(), note: { ...newNote } });
      setNotes(updatedNotes);
      setNewNote(undefined);
    } else {
      setNewNote(undefined);
    }
  }

  function updateNotes() {
    if (noteToEdit === undefined) return;
    const updatedNotes = notes.filter((note) => note.id !== noteToEdit.id);
    updatedNotes.unshift({ ...noteToEdit });
    setNotes(updatedNotes);
    setNoteToEdit(undefined);
  }

  function removeFromNotes(id: string) {
    setNotes(notes.filter((note) => note.id !== id));
    setNoteToEdit(undefined);
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
              onClick={() => {
                setNewNote({
                  title: "",
                  content: "",
                });
                setIsDetailedInputFirstExpanded(true);
              }}
            />
          </Card>
        </Box>
      ) : (
        <ClickAwayListener onClickAway={() => addToNotes()}>
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
                multiline
                sx={{ p: 1.5, mb: 1.5 }}
                placeholder="Title"
                onChange={(e) => {
                  setNewNote({
                    ...newNote,
                    title: e.target.value,
                  });
                }}
                inputRef={(input) =>
                  isDetailedInputFirstExpanded === true && input?.focus()
                }
              />
              <Input
                disableUnderline
                inputProps={{
                  style: { fontWeight: 700 },
                }}
                fullWidth
                multiline
                sx={{ p: 1.5, mb: 1 }}
                placeholder="Take a note..."
                onChange={(e) => {
                  setNewNote({
                    ...newNote,
                    content: e.target.value,
                  });
                }}
                onFocus={() => setIsDetailedInputFirstExpanded(false)}
              />
              <CardActions style={{ justifyContent: "flex-end" }}>
                <Button sx={{ color: "#808080" }} onClick={() => addToNotes()}>
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
          open={noteToEdit !== undefined}
          onClose={() => updateNotes()}
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
                if (noteToEdit === undefined) return;
                setNoteToEdit({
                  ...noteToEdit,
                  note: { ...noteToEdit["note"], title: e.target.value },
                });
              }}
              value={noteToEdit === undefined ? "" : noteToEdit.note.title}
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
                if (noteToEdit === undefined) return;
                setNoteToEdit({
                  ...noteToEdit,
                  note: { ...noteToEdit["note"], content: e.target.value },
                });
              }}
              value={noteToEdit === undefined ? "" : noteToEdit.note.content}
            />
            <CardActions style={{ justifyContent: "space-between" }}>
              <IconButton
                onClick={() => {
                  if (noteToEdit === undefined) return;
                  removeFromNotes(noteToEdit.id);
                }}
              >
                <Delete> Delete </Delete>
              </IconButton>
              <Button sx={{ color: "#808080" }} onClick={() => updateNotes()}>
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
                  setNoteToEdit(notes.filter((n) => n.id === note.id)[0])
                }
              >
                <CardContent>
                  <Typography style={{ wordWrap: "break-word" }}>
                    {note.note.title}
                  </Typography>
                  <Typography style={{ wordWrap: "break-word" }}>
                    {note.note.content}
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
