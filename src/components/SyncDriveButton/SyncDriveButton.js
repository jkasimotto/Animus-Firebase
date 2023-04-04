import React, { useState } from "react";
import { Button } from "@mui/material";
import firebase from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();

const SyncDriveButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const syncDriveFolder = async () => {
    setLoading(true);
    setMessage("Syncing drive folder...");

    try {
      const syncDriveFolderFunction = httpsCallable(functions, "syncDriveFolder");
      console.log("syncDriveFolderFunction", syncDriveFolderFunction);
      await syncDriveFolderFunction();
      setMessage("Drive folder synced successfully!");
    } catch (error) {
      setMessage("Error syncing drive folder: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        color="primary"
        onClick={syncDriveFolder}
        disabled={loading}
      >
        Sync Drive Folder
      </Button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SyncDriveButton;
