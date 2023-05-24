// AudioCard.js
import React, { useState, useEffect } from "react";
import { Typography, CardContent } from "@mui/material";
import ReactPlayer from "react-player";
import { storage } from "../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { retry } from "../../utils/retry";

const AudioCard = ({ user, media }) => {
  const { title, id } = media;
  const [transcription, setTranscription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    fetchTranscription(user.uid, id);
    fetchAudioUrl(user.uid, id);
  }, [user, id]);

  const fetchTranscription = async (userId, fileId) => {
    const storageRef = ref(storage, `transcriptions/${userId}/${fileId}`);
    try {
      const transcriptionUrl = await retry(() => getDownloadURL(storageRef), 4, 5000);
      const response = await fetch(transcriptionUrl);
      const transcriptionText = await response.text();
      setTranscription(transcriptionText);
    } catch (error) {
      console.error("Error fetching transcription:", error);
    }
  };

  const fetchAudioUrl = async (userId, fileId) => {
    const storageRef = ref(storage, `audio/${userId}/${fileId}`);
    try {
      const audioDownloadUrl = await retry(() => getDownloadURL(storageRef), 4, 5000);
      setAudioUrl(audioDownloadUrl);
    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  return (
    <>
      <ReactPlayer url={audioUrl} controls width="100%" height="50px" />
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

export default AudioCard;
