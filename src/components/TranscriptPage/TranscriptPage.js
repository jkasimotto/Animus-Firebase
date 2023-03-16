import React, { useState, useEffect } from "react";
import { Container, Box, Grid, Typography } from "@mui/material";
import TranscriptHeader from "../TranscriptHeader/TranscriptHeader";
import TranscriptList from "../TranscriptList/TranscriptList";
import { db } from "../../firebase";
import { AuthContext } from "../../auth/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import TranscriptAudioTextSubmit from "../TranscriptAudioTextSubmit/TranscriptAudioTextSubmit";

const TranscriptPage = () => {
  const { user } = React.useContext(AuthContext);
  const [transcripts, setTranscripts] = useState([]);
  const [selectedTranscripts, setSelectedTranscripts] = useState([]);
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
    const audioQuery = query(
      collection(db, "audio"),
      where("uid", "==", user.uid)
    );

    // Fetch transcripts from Firestore or API
    const fetchTranscripts = async () => {
      const transcriptsData = [];
      const transcriptsSnapshot = await getDocs(audioQuery);
      transcriptsSnapshot.forEach((doc) => {
        const transcript = doc.data();
        transcriptsData.push(transcript);
      });
      setTranscripts(transcriptsData);
      setSelectedTranscripts(transcriptsData);
      const latestDate = transcriptsData.reduce(
        (latest, transcript) =>
          transcript.createdAt > latest ? transcript.createdAt : latest,
        new Date("1900-01-01T00:00:00")
      );
      setSelectedDate(latestDate);
      const earliestDate = transcriptsData.reduce(
        (earliest, transcript) =>
          transcript.createdAt < earliest ? transcript.createdAt : earliest,
        new Date("2100-01-01T00:00:00")
      );
      setMinDate(earliestDate);
      setMaxDate(latestDate);
    };

    fetchTranscripts();
  }, [user]);

  const handleTranscriptClick = (transcript) => {
    const index = selectedTranscripts.findIndex((t) => t === transcript);
    if (index === -1) {
      setSelectedTranscripts([...selectedTranscripts, transcript]);
    } else {
      setSelectedTranscripts([
        ...selectedTranscripts.slice(0, index),
        ...selectedTranscripts.slice(index + 1),
      ]);
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
    const filteredTranscripts = transcripts.filter((transcript) =>
      transcript.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSelectedTranscripts(filteredTranscripts);
  };

  const handleTimelineChange = (event, value) => {
    setSelectedDate(new Date(value));
  };

  return (
    <Container 
    sx={{
      display: 'flex',
      flexGrow: 1,
    }}
    maxWidth="lg">
      <Box 
      py={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1, // Allow the Box to grow to fill the parent container
        // minHeight: '100vh', // Set to the full height of the viewport
        position: 'relative', // Set the position property for correct positioning of children
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
            <TranscriptList
              transcripts={selectedTranscripts}
              onTranscriptClick={handleTranscriptClick}
            />
          </Grid>
        </Grid>
        <TranscriptAudioTextSubmit />
      </Box>
    </Container>
  );
};

export default TranscriptPage;
