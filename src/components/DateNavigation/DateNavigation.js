import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { DatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import dayjs from "dayjs";

const DateNavigation = ({ selectedDay, setSelectedDay }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs(selectedDay));
  const [prevDate, setPrevDate] = useState(
    dayjs(selectedDay).subtract(1, "day")
  );
  const [nextDate, setNextDate] = useState(
    dayjs(selectedDay).add(1, "day")
  );

  useEffect(() => {
    setSelectedDate(dayjs(selectedDay));
    setPrevDate(dayjs(selectedDay).subtract(1, "day"));
    setNextDate(dayjs(selectedDay).add(1, "day"));
  }, [selectedDay]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedDay(date.valueOf());
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Button
        variant="outlined"
        onClick={() => handleDateChange(prevDate)}
      >
        {"<"}
      </Button>
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} fullWidth />}
        format="YYYY-MM-DD"
        sx={{flexGrow: 1}}
      />
      <Button
        variant="outlined"
        onClick={() => handleDateChange(nextDate)}
      >
        {">"}
      </Button>
    </Box>
  );
};

export default DateNavigation;
