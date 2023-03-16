import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

const AudioRecorderButton = ({
  onStartRecording,
  onStopRecording,
  handleRecordingBlob,
  ...props
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const handleClick = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      onStopRecording && onStopRecording();
    } else {
      onStartRecording && onStartRecording();
    }
  };

  const handleRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);

        recorder.addEventListener("dataavailable", (event) => {
          if (handleRecordingBlob) {
            handleRecordingBlob(event.data);
          }
        });

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);

        if (onStartRecording) {
          onStartRecording();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      mediaRecorder.stop();
      setIsRecording(false);
      if (onStopRecording) {
        onStopRecording();
      }
    }
  };

  return (
    <IconButton color="secondary" onClick={handleClick} {...props}>
      {isRecording ? <MicOffIcon /> : <MicIcon />}
    </IconButton>
  );
};

export default AudioRecorderButton;
