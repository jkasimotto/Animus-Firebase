import React, { useState } from "react";
import { Box, Button, List, ListItem, Menu, MenuItem } from "@mui/material";
import { ListItemText, Typography } from "@mui/material";
import TimelineSlider from "./TimelineSlider";
import TranscriptHeader from "./TranscriptHeader";
import AudioPlayer from "./FirebaseAudioPlayer";

const WatchedFolders = ({ folders, openPicker }) => {
  return (
    <Box>
      <Button variant="contained" color="primary" onClick={openPicker}>
        Open Picker
      </Button>
      <List>
        {folders.map((folder) => (
          <ListItem key={folder.id}>{folder.name}</ListItem>
        ))}
      </List>
    </Box>
  );
};

const TranscriptFilter = ({ onChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onChange(date);
  };

  return <Box></Box>;
};

const TranscriptLog = ({ transcripts }) => {
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const handleTranscriptClick = (transcript) => {
    setSelectedTranscript((prevSelectedTranscript) =>
      prevSelectedTranscript === transcript ? null : transcript
    );
  };

  return (
    <div style={{ display: "flex" }}>
      <List style={{ flex: 1 }}>
        {transcripts.map((transcript) => (
          <ListItem key={transcript.id}>
            <ListItemText
              primary={transcript.text}
              secondary={transcript.timeStamp}
              onClick={() => handleTranscriptClick(transcript)}
              style={{
                backgroundColor:
                  selectedTranscript === transcript ? "#eee" : "transparent",
              }}
            />
            {selectedTranscript === transcript && (
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1">Options:</Typography>
                <List>
                  <MenuItem>Option 1</MenuItem>
                  <MenuItem>Option 2</MenuItem>
                  <MenuItem>Option 3</MenuItem>
                </List>
                {/* Place your options for the selected transcript here */}
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

const ExamplePage = () => {
  const [folders, setFolders] = useState([]);
  const [transcripts, setTranscripts] = useState([]);
  const [filteredTranscripts, setFilteredTranscripts] = useState([
    {
      id: 1,
      text: "Hello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello worldHello world",
      datetime: new Date(),
    },
    { id: 2, text: "Hello world 2", datetime: new Date() },
    { id: 3, text: "Fart", datetime: new Date() },
    { id: 4, text: "Penis", datetime: new Date() },
    { id: 5, text: "Vagina", datetime: new Date() },
  ]);
  const [filterDate, setFilterDate] = useState(new Date());
  const watchedFolders = [
    "My Transcriptions/Folder1",
    "My Transcriptions/Folder2",
    "Shared with me/Transcriptions",
    "My Drive/Transcriptions",
  ];

  const openPicker = () => {
    // Implement your logic to show the Google Drive folder picker
  };

  const onTranscriptAction = (transcript, action) => {
    // Implement your logic to perform the selected action on the transcript
  };

  return (
    <Box>
      <AudioPlayer />
      <TranscriptHeader 
      watchedFolders={watchedFolders}
      onSearch={() => {}}
      onSelectFolders={() => {}}
      />
      <TranscriptFilter onChange={setFilterDate} />
      <TranscriptLog
        transcripts={filteredTranscripts}
        onTranscriptAction={onTranscriptAction}
      />
    </Box>
  );
};

export default ExamplePage;
