// Core dependencies
import React, { useContext, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { startOfDay, endOfDay } from "date-fns";
import { Link } from "react-router-dom";

// App components and contexts
import { AuthContext } from "../../auth/auth";
import { db } from "../../firebaseConfig";
import withLayout from "../../components/WithLayout/WithLayout";
import { TimePeriodContext } from "../../contexts/TimePeriodContext";
import MediaCardList from "../../components/MediaCardList/MediaCardList";
import SyncDriveButton from "../../components/SyncDriveButton/SyncDriveButton";

// This component represents the button to view reports
const ViewReportsButton = () => (
  <Button variant="contained" component={Link} to="/reports" sx={{ ml: 2 }}>
    View Reports
  </Button>
);

// Main component
const MediaTimelinePage = () => {
  // Contexts
  const { user } = useContext(AuthContext);
  const { startDate, endDate } = useContext(TimePeriodContext);

  // State
  const [media, setMedia] = useState([]);

  // Fetch media data on component mount and on date changes
  useEffect(() => {
    if (!user) {
      return;
    }

    const start = startOfDay(startDate);
    const end = endOfDay(endDate);
    const mediaCollectionRef = collection(db, "media");
    const mediaQuery = query(
      mediaCollectionRef,
      where("userId", "==", user.uid),
      where("timestamp", ">=", start),
      where("timestamp", "<=", end)
    );

    const unsubscribe = onSnapshot(mediaQuery, (snapshot) => {
      const handleDocChange = (change) => {
        const mediaItem = { ...change.doc.data(), id: change.doc.id };

        setMedia((prevMedia) => {
          // Filter out the current item, if it exists, then append the new version
          const updatedMedia = prevMedia.filter((item) => item.id !== mediaItem.id);
          updatedMedia.push(mediaItem);

          // Sort by timestamp
          return updatedMedia.sort((a, b) => b.timestamp - a.timestamp);
        });
      };

      const handleDocRemoval = (change) => {
        setMedia((prevMedia) => {
          // Filter out the removed item
          const updatedMedia = prevMedia.filter((item) => item.id !== change.doc.id);

          // Sort by timestamp
          return updatedMedia.sort((a, b) => b.timestamp - a.timestamp);
        });
      };

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          handleDocChange(change);
        } else if (change.type === "removed") {
          handleDocRemoval(change);
        }
      });
    });


    return () => {
      unsubscribe();
    };
  }, [user, startDate, endDate]);

  // Reset media when the selected day changes
  useEffect(() => {
    setMedia([]);
  }, [startDate, endDate]);

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
        <MediaCardList mediaFiles={media} />
      </Box>
    </Box>
  );
};

export default withLayout(MediaTimelinePage, {
  menuComponents: [SyncDriveButton, ViewReportsButton],
  handleSubmit: (e) => {
    console.log("submit");
  },
});
