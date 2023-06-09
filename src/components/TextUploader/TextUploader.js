import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MicIcon from '@mui/icons-material/Mic';
import { AuthContext } from "../../auth/auth";
import { collection, addDoc } from "@firebase/firestore";
import { db } from "../../firebaseConfig";

const TextUploader = () => {
  const [inputText, setInputText] = useState("");
  const { user } = useContext(AuthContext);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleUpload = async (event) => {
    if (event.key !== "Enter" && event.type !== "click") {
      return;
    }

    try {
      // Create a Firestore document
      const mediaCollectionRef = collection(db, "media");
      await addDoc(mediaCollectionRef, {
        userId: user.uid,
        type: "text",
        text: inputText,
        title: "Untitled",
        createdAt: new Date(),
        updatedAt: new Date(),
        timestamp: new Date(),
      });
      
      // Reset text input immediately after Firestore document creation
      setInputText("");

      console.log("Text uploaded successfully");
    } catch (error) {
      console.error("Error uploading text:", error);
    }
  };

  // TODO: Implement the transcription functionality
  const handleTranscription = (event) => {
    console.log("Transcription button clicked");
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 0 16px 16px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <TextField
          fullWidth
          multiline
          rowsMax={5}
          variant="outlined"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleUpload}
          sx={{ width: "100%" }}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        sx={{ marginLeft: "16px" }}
      >
        Upload
      </Button>
      <IconButton
        color="primary"
        onClick={handleTranscription}
        sx={{ marginLeft: "8px" }}
      >
        <MicIcon />
      </IconButton>
    </Box>
  );
};

export default TextUploader;
