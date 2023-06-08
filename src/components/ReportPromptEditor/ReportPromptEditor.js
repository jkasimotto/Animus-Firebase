import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const ReportPromptEditor = ({ onSubmit, initialPrompt = "" }) => {
  const [prompt, setPrompt] = useState(initialPrompt);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (prompt) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Enter your prompt"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        Save
      </Button>
    </Box>
  );
};

export default ReportPromptEditor;
