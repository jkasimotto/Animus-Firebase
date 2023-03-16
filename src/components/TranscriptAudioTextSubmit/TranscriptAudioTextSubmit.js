import React, { useState } from "react";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextBox from "../TextBox";
import SubmitButton from "../SubmitButton";
import AudioRecorderButton from "../AudioRecorderButton";
import SendIcon from "@mui/icons-material/Send";

const StyledTextBox = styled(TextBox)(({ theme }) => ({
  flexGrow: 1,
  marginRight: theme.spacing(1),
  width: "100%",
  backgroundColor: theme.palette.background.paper, // Add a background color
}));

const StyledSubmitButton = styled(SubmitButton)(({ theme }) => ({
  minWidth: "100%",
  flexGrow: 1,
  height: "100%",
  fontsize: theme.typography.h4.fontSize,
  marginRight: theme.spacing(1),
}));

const StyledAudioRecorderButton = styled(AudioRecorderButton)(({ theme }) => ({
  fontSize: theme.typography.h4.fontSize,
  flexGrow: 1,
  minWidth: "100%",
  height: "100%", // Set the height to match the TextBox
  backgroundColor: theme.palette.secondary.main, // Add a background color
  color: theme.palette.secondary.contrastText, // Add a contrast color
  borderRadius: theme.shape.borderRadius, // Add a border radius
  "&:hover": {
    backgroundColor: alpha(theme.palette.secondary.dark, 0.75), // Add a hover effect
  },
}));

const TranscriptAudioTextSubmit = () => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    // Handle form submission logic
  };

  const handleStartRecording = () => {
    // Start recording audio
  };

  const handleStopRecording = () => {
    // Stop recording audio and process the audio data
  };

  const handleRecordingBlob = (blob) => {
    // Process the audio data
  };

  return (
    <Box
      sx={{
        display: "flex",
        position: "absolute", // Set to absolute positioning
        bottom: "1rem", // Set the distance from the bottom
        left: 0,
        right: 0,
        justifyContent: "center",
      }}
    >
      <Grid container alignItems="stretch" spacing={0}>
        <Grid item xs={9}>
          <StyledTextBox
            label="Enter text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            maxRows={8}
            minRows={4}
          />
        </Grid>
        <Grid item xs={1}>
          <StyledSubmitButton icon={<SendIcon />} onClick={handleSubmit} />
        </Grid>
        <Grid item xs={2}>
          <StyledAudioRecorderButton
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TranscriptAudioTextSubmit;
