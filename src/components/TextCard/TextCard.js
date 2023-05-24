// TextCard.js
import React, { useState, useEffect } from "react";
import { Typography, CardContent } from "@mui/material";

const TextCard = ({ user, media }) => {
  return (
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {media.title || "Untitled"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {media.text}
      </Typography>
    </CardContent>
  );
};

export default TextCard;
