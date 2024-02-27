import { Note } from "@mui/icons-material";
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

  return (
    <Box>
      <AppBar position="static" style={{ background: "#808080" }}>
        <Toolbar disableGutters>
          <Note fontSize="large" display="flex" sx={{ mr: 1, ml: 1.5 }} />
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
              inputProps={{ style: { fontWeight: 700 } }}
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
              sx={{ p: 1.5, mb: 1.2 }}
              placeholder="Title"
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
            />
            <CardActions>
              <Button sx={{ color: "#808080" }}>Add</Button>
            </CardActions>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default App;
