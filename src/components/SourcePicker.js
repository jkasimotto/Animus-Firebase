import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const SourcePicker = ({ watchedFolders, onSelectFolders }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState(watchedFolders);

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <Button 
    color="inherit"
    onClick={handleOpen}>Drive</Button>
  );
};

export default SourcePicker;
