import { Note as NoteIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  Input,
  Toolbar,
  Typography,
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
              onClick={() => setIsDetailedInputExpanded(true)}
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
            />
            <CardActions>
              <Button sx={{ color: "#808080" }}>Close</Button>
            </CardActions>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default App;
