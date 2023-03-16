import React, { useState } from "react";
import {
    Drawer,
    DrawerHeader,
    IconButton,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
  } from "@mui/material";
  import {
    Delete as DeleteIcon,
    Share as ShareIcon,
    PlayArrow as PlayArrowIcon,
  } from "@mui/icons-material";
  import { ref, getDownloadURL } from "firebase/storage";
    import { storage } from "../../firebase";
import { useEffect } from "react";
  
  function TranscriptOptionsPane({
    transcript,
    onClose,
    onDelete,
    onShare,
    isOpen,
    anchor,
    transformOrigin,
    anchorOrigin,
    PaperProps,
  }) {
    const { createdAt, filePath } = transcript;
    const [url, setUrl] = useState('')

    useEffect(() => {

        async function getUrl() {
            const gsReference = ref(storage, filePath);
            const url = await getDownloadURL(gsReference)
            setUrl(url)
            console.log("url", url);
        }

        getUrl();

    }, [filePath])

    const handleDelete = () => {
      onDelete(transcript);
      onClose();
    };
  
    const handleShare = () => {
      onShare(transcript);
      onClose();
    };

    // Convert seconds/nanos to a date string
    const date = new Date(createdAt.seconds * 1000);
    const dateString = date.toLocaleDateString();

    return (
      <Drawer
        anchor={anchor}
        transformOrigin={transformOrigin}
        anchorOrigin={anchorOrigin}
        open={isOpen}
        onClose={onClose}
        PaperProps={PaperProps}
      >
        {/* Display date as a Box */}
        <Box sx={{ p: 2, textAlign: "center" }}>{dateString}</Box>
        <audio src={url} controls />
        <List>
          <ListItem button onClick={handleDelete}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </ListItem>
          <ListItem button onClick={handleShare}>
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText primary="Share" />
          </ListItem>
        </List>
      </Drawer>
    );
  }
  
  export default TranscriptOptionsPane;
  