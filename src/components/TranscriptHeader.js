import React, { useState, useRef } from "react";
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Paper,
  Slide,
  IconButton,
} from "@mui/material";
import SearchComponent from "./SearchComponent";
import SourcePicker from "./SourcePicker";
import TimelineSlider from "./TimelineSlider";
import WatchedFolderDisplay from "./WatchedFolderDisplay";
import CloseIcon from "@mui/icons-material/Close";

const TranscriptHeader = ({ watchedFolders, onSearch, onSelectFolders }) => {
  const containerRef = useRef(null);
  const records = [
    {
      id: 1,
      text: "This is the first record",
      datetime: "2022-10-01T10:00:00Z",
    },
    {
      id: 2,
      text: "This is the second record",
      datetime: "2022-10-02T10:30:00Z",
    },
    {
      id: 3,
      text: "This is the third record",
      datetime: "2022-10-03T11:15:00Z",
    },
    {
      id: 4,
      text: "This is the fourth record",
      datetime: "2022-10-04T12:00:00Z",
    },
    {
      id: 5,
      text: "This is the fifth record",
      datetime: "2022-10-05T13:45:00Z",
    },
  ];

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handlePickerOpen = () => {
    setIsPickerOpen(true);
  };

  const handlePickerClose = () => {
    setIsPickerOpen(false);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Transcription Records
        </Typography>
        <Box sx={{ display: "flex" }}>
          <SearchComponent onSearch={onSearch} />
          <Button
            variant="contained"
            color="inherit"
            onClick={handlePickerOpen}
          >
            Sources
          </Button>
        </Box>
      </Toolbar>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TimelineSlider records={records} onChange={() => {}} />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }} />
          </Grid>
        </Grid>
      </Paper>
      <Slide
        in={isPickerOpen}
        mountOnEnter
        unmountOnExit
        sx={{
          position: "relative",
          bottom: 0,
          left: 0,
          zIndex: 1,
          width: "100%",
          backgroundColor: "background.paper",
        }}
        container={containerRef.current}
      >
        <Paper sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Watched Folders
            </Typography>
            <IconButton onClick={handlePickerClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <WatchedFolderDisplay watchedFolders={watchedFolders} />
        </Paper>
      </Slide>
    </AppBar>
  );
};

export default TranscriptHeader;
