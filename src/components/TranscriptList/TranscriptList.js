import React from "react";
import List from "@mui/material/List";
import Transcript from "../Transcript/Transcript";

const TranscriptList = ({ transcripts, onTranscriptClick, onDelete, onShare, onClose, isOpen, anchor, transformOrigin, anchorOrigin, PaperProps }) => {
  console.log("TranscriptList: ", transcripts)
  return (
    <List
    sx={{
      width: "100%",
      overflow: "auto",
    }} 
    >
      {transcripts.map((transcript) => (
        <Transcript
          key={transcript.id}
          transcript={transcript}
          onTranscriptClick={() => onTranscriptClick(transcript)}
          onDelete={() => onDelete(transcript)}
          onShare={() => onShare(transcript)}
          onClose={onClose}
          isOpen={isOpen}
          anchor={anchor}
          transformOrigin={transformOrigin}
          anchorOrigin={anchorOrigin}
          PaperProps={PaperProps}
        />
      ))}
    </List>
  );
};

export default TranscriptList;
