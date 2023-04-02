import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, ListItemSecondaryAction, IconButton } from '@mui/material';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const DocumentList = ({ documents }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <List>
      {documents.map((document, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar>
              <AudiotrackIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={document.text} secondary={formatDate(document.timestamp)} />
          {document.audioUrl && (
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => playAudio(document.audioUrl)}>
                <PlayArrowIcon />
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default DocumentList;
