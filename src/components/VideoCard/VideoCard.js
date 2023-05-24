// VideoCard.js
import React, { useState, useEffect } from "react";
import { Typography, CardContent } from "@mui/material";
import ReactPlayer from "react-player";
import { storage } from "../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";

const VideoCard = ({ user, media }) => {
  const { title, id, storagePath } = media;
  const [transcription, setTranscription] = useState("");

  useEffect(() => {
    fetchTranscription(user.uid, id);
  }, [user, id]);

  const fetchTranscription = async (userId, fileId) => {
    const storageRef = ref(storage, `transcriptions/${userId}/${fileId}`);
    try {
      const transcriptionUrl = await getDownloadURL(storageRef);
      const response = await fetch(transcriptionUrl);
      const transcriptionText = await response.text();
      setTranscription(transcriptionText);
    } catch (error) {
      console.error("Error fetching transcription:", error);
    }
  };

  return (
    <>
      <ReactPlayer url={storagePath} controls width="100%" height="auto" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title || "Untitled"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {transcription}
        </Typography>
      </CardContent>
    </>
  );
};

export default VideoCard;
