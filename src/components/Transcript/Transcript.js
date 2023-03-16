import { useState } from "react";
import {
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TranscriptOptionsPane from "../TranscriptOptionsPane/TranscriptOptionsPane";

function Transcript({ transcript, onClick }) {
  const { transcription } = transcript;
  const [isOptionsPaneOpen, setIsOptionsPaneOpen] = useState(false);

  const handleOptionsClick = (event) => {
    event.stopPropagation();
    setIsOptionsPaneOpen(true);
  };

  const handleOptionsClose = () => {
    setIsOptionsPaneOpen(false);
  };

  const handleDelete = () => {
    // call the onDelete prop with the transcript object as an argument
  };

  const handleShare = () => {
    // call the onShare prop with the transcript object as an argument
  };

  return (
    <>
      <ListItem button onClick={onClick}>
        {transcription}
        <ListItemSecondaryAction>
          <IconButton onClick={handleOptionsClick}>
            <MoreVertIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
      <TranscriptOptionsPane
        transcript={transcript}
        onClose={handleOptionsClose}
        onDelete={handleDelete}
        onShare={handleShare}
        isOpen={isOptionsPaneOpen}
        anchor="right"
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ style: { width: "30vw" } }}
      />
    </>
  );
}

export default Transcript;
