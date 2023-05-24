import React from "react";
import { Grid } from "@mui/material";
import MediaCard from "../MediaCard/MediaCard";
import styles from "./MediaCardList.module.css";

const MediaCardList = ({ mediaFiles }) => {
  console.log("MEdiaCardList received mediaFiles", mediaFiles);
  return (
    <div>
      <Grid container spacing={4}>
        {mediaFiles &&
          mediaFiles.map((media, index) => (
            <Grid
              item
              key={index}
              xs={12}
              className={styles["media-card-container"]}
            >
              <MediaCard media={media} />
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default MediaCardList;
