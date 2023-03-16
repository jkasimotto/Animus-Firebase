import React, { useEffect } from "react";
import { Button, List, ListItem, ListItemText } from "@mui/material";
import useDrivePicker from "react-google-drive-picker";
import { functions } from "../firebase";
import { connectFunctionsEmulator, httpsCallable } from "firebase/functions";

const watchDriveFolder = httpsCallable(functions, "watchDriveFolder");
connectFunctionsEmulator(functions, "localhost", 5001);

const WatchedFolderDisplay = ({ watchedFolders }) => {
  const [openPicker, authResponse] = useDrivePicker();
  const handleOpenPicker = () => {
    openPicker({
      clientId:
        "476897576252-q24tmv66p2l73r4qdhugk6t7r0lrls9s.apps.googleusercontent.com",
      developerKey: "AIzaSyB6gRs9P0B-pO12zpupaR81BsewT4kk9LM",
      viewId: "DOCS",
      supportDrives: true,
      multiselect: true,
      setSelectFolderEnabled: true,
      setIncludeFolders: true,
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User cancelled the picker");
        } else {
          console.log("User selected the following files:");
          console.log(data);
          watchDriveFolder({ folderId: data.docs[0].id }).then((result) => {
            console.log(result);
          });
        }
      },
    });
  };

  return (
    <>
      <List>
        {watchedFolders.map((folder) => (
          <ListItem key={folder.id}>
            <ListItemText primary={folder.name} secondary={folder.path} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" onClick={handleOpenPicker}>
        Click me
      </Button>
    </>
  );
};

export default WatchedFolderDisplay;
