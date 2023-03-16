import React, { useState } from "react";
import { Slider, Typography } from "@mui/material";
import { format } from "date-fns";

const TimelineSlider = ({ records, onChange }) => {
  const [sliderValue, setSliderValue] = useState(
    new Date(records[0].datetime).getTime()
  );

  const handleChange = (event, newValue) => {
    setSliderValue(newValue);
    const filteredRecords = records.filter(
      (record) => new Date(record.datetime).getTime() === newValue
    );
    onChange(filteredRecords);
  };

  const displayValue = format(new Date(sliderValue), "yyyy-MM-dd HH:mm:ss");

  const marks = records.reduce((acc, record) => {
    acc[new Date(record.datetime).getTime()] = {
      value: new Date(record.datetime).getTime(),
      label: format(new Date(record.datetime), "yyyy-MM-dd HH:mm:ss"),
    };
    return acc;
  }, {});

  const marksArray = Object.keys(marks).map((key) => ({
    value: marks[key].value,
    label: marks[key].label,
  }));

//   Console.log the type of marks to see what it is
  console.log(typeof marks)
  console.log(Array.isArray(marks))

  return (
    <>
      <Slider
        value={sliderValue}
        onChange={handleChange}
        min={new Date(records[0].datetime).getTime()}
        max={new Date(records[records.length - 1].datetime).getTime()}
        valueLabelDisplay="off"
        marks={marksArray}
      />
      <Typography>{displayValue}</Typography>
    </>
  );
};

export default TimelineSlider;
