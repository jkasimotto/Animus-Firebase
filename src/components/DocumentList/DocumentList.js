import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

const DocumentList = ({ documents }) => {
  const [audio, setAudio] = useState(null);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const dateString = date.toLocaleString('en-AU');
    return dateString;
  };

  const playAudio = (audioUrl) => {
    if (audio && audio.src === audioUrl[0]) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(audioUrl);
      newAudio.play();
      setAudio(newAudio);
    }
  };

  const sortedDocuments = documents.sort(
    (a, b) => b.timestamp.seconds - a.timestamp.seconds
  );

  return (
    <List>
      {sortedDocuments.map((document, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar>
              <AudiotrackIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={document.text}
            secondary={formatDate(document.timestamp)}
          />
          {document.fileType === "audio" && document.storageUrl && (
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => playAudio(document.storageUrl)}
              >
                {audio && audio.src === document.storageUrl[0] && !audio.paused ? (
                  <PauseIcon />
                ) : (
                  <PlayArrowIcon />
                )}
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default DocumentList;
