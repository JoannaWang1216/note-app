import { Note as NoteIcon } from "@mui/icons-material";
import { Masonry } from "@mui/lab";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Input,
  Toolbar,
  Typography,
  Modal,
} from "@mui/material";
import * as React from "react";

function App() {
  const [isDetailedInputExpanded, setIsDetailedInputExpanded] =
    React.useState<boolean>(false);

  interface Note {
    title: string;
    content: string;
  }
  const [newNote, setNewNote] = React.useState<Note>({
    title: "",
    content: "",
  });

  interface Notes {
    id: string;
    note: Note;
  }
  const [notes, setNotes] = React.useState<Notes[]>([]);

  const [isDetailedInputFirstExpanded, setIsDetailedInputFirstExpanded] =
    React.useState<boolean>(false);
  
  const [isDetailedNoteShowed, setIsDetailedNoteShowed] =
    React.useState<boolean>(false);
  
  const [noteToEdit, setNoteToEdit] = React.useState<Notes>({
    id: "",
    note: { title: "", content: "" }
  });

  function addToNotes() {
    const updatedNotes = [...notes];
    if (newNote.title.length > 0 || newNote.content.length > 0) {
      updatedNotes.unshift({ id: Date.now().toString(), note: { ...newNote } });
      setNotes(updatedNotes);
      setNewNote({ title: "", content: "" });
      setIsDetailedInputExpanded(false);
    } else {
      setIsDetailedInputExpanded(false);
    }
  }

  function showPopUpNote(id: string) {
    setNoteToEdit(notes.filter((note) => note.id === id)[0]);
    setIsDetailedNoteShowed(true);
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="auto"
        p={2}
      >
        {isDetailedInputExpanded === false ? (
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
                setIsDetailedInputExpanded(true);
                setIsDetailedInputFirstExpanded(true);
              }}
            />
          </Card>
        ) : (
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
            <CardActions>
              <Button sx={{ color: "#808080" }} onClick={() => addToNotes()}>
                Close
              </Button>
            </CardActions>
          </Card>
        )}
      </Box>
      <Box>
        <Modal
          open={isDetailedNoteShowed}
          onClose={() => setIsDetailedNoteShowed(false)}
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
              onChange={(e) => {
                setNoteToEdit({
                  ...noteToEdit,
                  note: { ...noteToEdit["note"], title: e.target.value },
                });
              }}
              value={noteToEdit.note.title}
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
                setNoteToEdit({
                  ...noteToEdit,
                  note: { ...noteToEdit["note"], content: e.target.value },
                });
              }}
              value={noteToEdit.note.content}
            />
            <CardActions>
              <Button sx={{ color: "#808080" }}>
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
              <CardContent>
                <Typography style={{ wordWrap: "break-word" }}>
                  {note.note.title}
                </Typography>
                <Typography style={{ wordWrap: "break-word" }}>
                  {note.note.content}
                </Typography>
              </CardContent>
              <CardActions>
                <Button sx={{ color: "#808080" }} onClick={() => showPopUpNote(note.id)}>Edit</Button>
                <Button sx={{ color: "#808080" }}>Delete</Button>
              </CardActions>
            </Card>
          ))}
        </Masonry>
      </Box>
    </Box>
  );
}

export default App;
