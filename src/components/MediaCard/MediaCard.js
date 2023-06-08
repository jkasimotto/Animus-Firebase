import React, { useState, useEffect, useContext } from "react";
import { Typography, CardContent, TextField, Box } from "@mui/material";
import ReactPlayer from "react-player";
import { storage } from "../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { retry } from "../../utils/retry";
import styles from "./MediaCard.module.css";
import { AuthContext } from "../../auth/auth";
import { Timestamp } from "firebase/firestore";

const MediaCard = ({ media }) => {
  const { title, id, type, text, storagePath } = media;
  const [isEditing, setIsEditing] = useState(false);
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [inputTitle, setInputTitle] = useState(title);
  const [inputText, setInputText] = useState(text);
  const [audioUrl, setAudioUrl] = useState("");
  const { user } = useContext(AuthContext);

  const timestampDate = media.timestamp instanceof Timestamp ? media.timestamp.toDate() : new Date();
  const formattedDate = timestampDate.toLocaleString(); // This will format it according to the user's locale

  useEffect(() => {
    if (type === 'audio') {
      fetchAudioUrl(user.uid, id);
    }
  }, [user, id, type]);

  const fetchAudioUrl = async (userId, fileId) => {
    const storageRef = ref(storage, `audio/${userId}/${fileId}`);
    try {
      const audioDownloadUrl = await retry(() => getDownloadURL(storageRef), 4, 5000);
      setAudioUrl(audioDownloadUrl);
    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  const handleTitleClick = () => {
    setIsEditing(true);
  }

  const handleTextClick = () => {
    setIsTextEditing(true);
  }

  const handleBlur = async () => {
    setIsEditing(false);
    setIsTextEditing(false);
    await saveChanges();
  }

  const saveChanges = async () => {
    const mediaRef = doc(db, 'media', id);
    try {
      await updateDoc(mediaRef, { title: inputTitle, text: inputText });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }

  return (
    <Box className={styles["media-card"]} sx={{ marginTop: "10px", marginBottom: "10px", borderRadius: "5px", boxShadow: 1 }}>
      {(type === 'audio') && <ReactPlayer url={audioUrl} controls width="100%" height="50px" />}
      {(type === 'video') && <ReactPlayer url={storagePath} controls width="100%" height="auto" />}
      <CardContent>
        {isEditing ? (
          <TextField
            fullWidth
            defaultValue={title || "Untitled"}
            onBlur={handleBlur}
            onChange={(e) => setInputTitle(e.target.value)}
          />
        ) : (
          <>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              onClick={handleTitleClick}
              sx={{ cursor: "pointer" }}
            >
              {inputTitle || "Untitled"}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              {formattedDate}
            </Typography>
          </>
        )}
        {isTextEditing ? (
          <TextField
            fullWidth
            multiline
            defaultValue={text}
            onBlur={handleBlur}
            onChange={(e) => setInputText(e.target.value)}
          />
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            onClick={handleTextClick}
            sx={{ cursor: "pointer" }}
          >
            {inputText}
          </Typography>
        )}
      </CardContent>
    </Box>
  );
};

export default MediaCard;
