import React from 'react';
import Slider from '@mui/material/Slider';
import styles from './TranscriptTimelineSlider.module.css';

function TranscriptTimelineSlider(props) {
  const { selectedDate, beginDate, endDate, onTimelineChange } = props;

  const marks = [
    {
      value: beginDate,
      label: new Date(beginDate).toLocaleDateString(),
    },
    {
      value: endDate,
      label: new Date(endDate).toLocaleDateString(),
    },
  ];

  const handleChange = (event, value) => {
    onTimelineChange(value);
  };

  return (
    <div className={styles['slider-container']}>
      <Slider
        className={styles['MuiSlider-root']}
        classes={{
          rail: styles['MuiSlider-rail'],
          track: styles['MuiSlider-track'],
          thumb: styles['MuiSlider-thumb'],
          valueLabel: styles['MuiSlider-valueLabel'],
        }}
        value={selectedDate}
        min={beginDate}
        max={endDate}
        marks={marks}
        onChange={handleChange}
        valueLabelDisplay="auto"
      />
    </div>
  );
}

export default TranscriptTimelineSlider;
