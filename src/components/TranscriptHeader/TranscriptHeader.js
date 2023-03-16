import React from 'react';
import Grid from '@mui/material/Grid';
import TranscriptSearchBar from '../TranscriptSearchBar/TranscriptSearchBar';
import TranscriptTimelineSlider from '../TranscriptTimelineSlider/TranscriptTimelineSlider';
import styles from './TranscriptHeader.module.css';

function TranscriptHeader(props) {
  return (
    <div className={styles.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TranscriptSearchBar
            searchTerm={props.searchTerm}
            onSearch={props.onSearch}
          />
        </Grid>
        <Grid item xs={12}>
          <TranscriptTimelineSlider
            selectedDate={props.selectedDate}
            beginDate={props.beginDate}
            endDate={props.endDate}
            onTimelineChange={props.onTimelineChange}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default TranscriptHeader;
