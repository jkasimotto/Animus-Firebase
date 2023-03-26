import { ref, getDownloadURL } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { Container, Box, Grid, Typography } from "@mui/material";
import TranscriptHeader from "../TranscriptHeader/TranscriptHeader";
import TranscriptList from "../TranscriptList/TranscriptList";
import { db, storage } from "../../firebase";
import { AuthContext } from "../../auth/auth";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import TranscriptAudioTextSubmit from "../TranscriptAudioTextSubmit/TranscriptAudioTextSubmit";

const TranscriptPage = () => {
  const { user } = React.useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  useEffect(() => {
    console.log("User: ", user);

    // Check user is logged in
    if (!user) {
      console.log("User not logged in");
      return;
    }
    console.log("User logged in. Fetching transcripts...");

    // Create the query for audio documents where uid matches user.uid
    const documentsRef = collection(db, "users", user.uid, "files");
    const documentsQuery = query(documentsRef, orderBy("createdAt", "desc"));

    // Set up a listener for real-time updates in Firestore
    const unsubscribe = onSnapshot(documentsQuery, async (snapshot) => {
      const changes = snapshot.docChanges();
      for (const change of changes) {
        if (change.type === 'added') {
          const doc = change.doc;
          const storageUrl = doc.data().storageUrl;
          const textFile = await downloadTranscription(user.uid, doc.data().fileId);
          const newDoc = {
            id: doc.id,
            ...doc.data(),
            transcription: textFile,
          };
          setDocuments((prevState) => [newDoc, ...prevState]);
          setSelectedDocuments((prevState) => [newDoc, ...prevState]);
        }
      }
    });

    // Clean up the listener when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, [user]);

  const handleTranscriptClick = (transcript) => {
    const index = selectedDocuments.findIndex((t) => t === transcript);
    if (index === -1) {
      setSelectedDocuments([...selectedDocuments, transcript]);
    } else {
      setSelectedDocuments([
        ...selectedDocuments.slice(0, index),
        ...selectedDocuments.slice(index + 1),
      ]);
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    const filteredDocuments = documents.filter((transcript) =>
      transcript.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSelectedDocuments(filteredDocuments);
  };

  const handleTimelineChange = (event, value) => {
    setSelectedDate(new Date(value));
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexGrow: 1,
      }}
      maxWidth="lg"
    >
      <Box
        py={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1, // Allow the Box to grow to fill the parent container
          // minHeight: '100vh', // Set to the full height of the viewport
          position: "relative", // Set the position property for correct positioning of children
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TranscriptHeader
              selectedDate={selectedDate}
              minDate={minDate}
              maxDate={maxDate}
              searchTerm={searchTerm}
              onSearchTermChange={handleSearchTermChange}
              onTimelineChange={handleTimelineChange}
            />
          </Grid>
          <Grid item xs={12}>
            <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              overflow:"scroll"
            }}
          >
            <TranscriptList
              transcripts={selectedDocuments}
              onTranscriptClick={handleTranscriptClick}
            />
            </div>
          </Grid>
        </Grid>
        <TranscriptAudioTextSubmit />
      </Box>
    </Container>
  );
};

export default TranscriptPage;

async function downloadTranscription(userId, fileId) {
  const fileRef = ref(
    storage,
    `user-transcripts/${userId}/${fileId}/transcript`
  );

  try {
    const url = await getDownloadURL(fileRef);
    const response = await fetch(url);
    const transcription = await response.text();
    return transcription;
  } catch (error) {
    console.error("Error downloading transcription:", error);
    throw error;
  }
}
