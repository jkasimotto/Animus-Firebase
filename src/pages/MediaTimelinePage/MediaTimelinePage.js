import React, { useContext, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { db } from "../../firebaseConfig";
import MediaCardList from "../../components/MediaCardList/MediaCardList";
import SyncDriveButton from "../../components/SyncDriveButton/SyncDriveButton";
import DateNavigation from "../../components/DateNavigation/DateNavigation";
import { AuthContext } from "../../auth/auth";
import { startOfDay, endOfDay } from "date-fns";
import { storage } from "../../firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { retry } from "../../utils/retry";

import { collection, doc, query, where, onSnapshot } from "@firebase/firestore";
import TextUploader from "../../components/TextUploader/TextUploader";

const MediaTimelinePageContent = () => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [media, setMedia] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      return;
    }

    const start = startOfDay(selectedDay);
    const end = endOfDay(selectedDay);
    const mediaCollectionRef = collection(db, "media");
    const mediaQuery = query(
      mediaCollectionRef,
      where("userId", "==", user.uid),
      where("timestamp", ">=", start),
      where("timestamp", "<=", end)
    );

    const unsubscribe = onSnapshot(mediaQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const mediaItem = { ...change.doc.data(), id: change.doc.id };
          setMedia((prevMedia) => {
            const updatedMedia = prevMedia.filter((item) => item.id !== mediaItem.id);
            updatedMedia.push(mediaItem);
            return updatedMedia.sort((a, b) => b.timestamp - a.timestamp);
          });
        }
        if (change.type === "removed") {
          setMedia((prevMedia) => {
            const updatedMedia = prevMedia.filter((item) => item.id !== change.doc.id);
            return updatedMedia.sort((a, b) => b.timestamp - a.timestamp);
          });
        }
      });
    });
    
    

    return () => {
      unsubscribe();
    };
  }, [user, selectedDay]);

  useEffect(() => {
    setMedia([]);
  }, [selectedDay]);

  const updateMediaCard = async (mediaId, mediaType) => {
    // ... Existing code
  };

  const downloadLog = () => {
    const logLines = media.map((item) => {
      const timestamp = item.timestamp.toDate().toLocaleString();
      const content =
        item.type === "text" ? item.textContent : item.transcription;
      return `${timestamp}: ${content}`;
    });

    const logContent = logLines.join("\n");
    const blob = new Blob([logContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `log-${selectedDay.toISOString().split("T")[0]}.txt`;
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        minHeight: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <SyncDriveButton />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Box flexGrow={1}>
            <DateNavigation
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
            />
          </Box>
        </Box>

        <MediaCardList mediaFiles={media} updateMediaCard={updateMediaCard} />
      </Box>
      <TextUploader />
    </Box>
  );
};

const MediaTimelinePage = () => {
  return <MediaTimelinePageContent />;
};

export default MediaTimelinePage;
