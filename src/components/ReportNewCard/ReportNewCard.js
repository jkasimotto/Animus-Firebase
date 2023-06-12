import { collection, addDoc } from "@firebase/firestore";
import React, { useState } from 'react';
import { db } from "../../firebaseConfig";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ReportNewCard = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleInputChange = (event, setter) => {
    setter(event.target.value);
  };

  const submitReport = async () => {
    try {
      const reportData = {
        title: title,
        type: type,
        systemPrompt: prompt, 
        // add more fields if needed
      };
      await addDoc(collection(db, "reportTemplates"), reportData);
      // Reset fields after successful submission
      setTitle("");
      setType("");
      setPrompt("");
      setIsFormVisible(false);  // hide the form after submission
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title="Create New Report"
        action={
          <Button onClick={() => setIsFormVisible(!isFormVisible)}>
            <ExpandMoreIcon />
          </Button>
        }
      />
      {isFormVisible && (
        <CardContent>
          <TextField
            fullWidth
            label="Report Title"
            value={title}
            onChange={(event) => handleInputChange(event, setTitle)}
          />
          <TextField
            fullWidth
            label="Report Type"
            value={type}
            onChange={(event) => handleInputChange(event, setType)}
          />
          <TextField
            fullWidth
            multiline
            label="Report Prompt"
            value={prompt}
            onChange={(event) => handleInputChange(event, setPrompt)}
          />
          <Button onClick={submitReport}>Submit</Button>
        </CardContent>
      )}
    </Card>
  );
};

export default ReportNewCard;
