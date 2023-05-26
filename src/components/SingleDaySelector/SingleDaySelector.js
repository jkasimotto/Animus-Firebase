import React, { useContext, useEffect, useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { TimePeriodContext } from "../../contexts/TimePeriodContext";

/**
 * SingleDaySelector is a component for selecting a single date.
 * The selected date is stored and managed in the TimePeriodContext.
 * 
 * It provides a user interface with a DatePicker and buttons to navigate
 * to the previous and next days.
 */
const SingleDaySelector = () => {
  // Getting the current date and setDay function from the TimePeriodContext
  const { setDay } = useContext(TimePeriodContext);

  // Local state for the selected date, initialized with today's date
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf('day'));

  // States for the previous and next dates, initialized relative to the selected date
  const [prevDate, setPrevDate] = useState(
    dayjs().startOf('day').subtract(1, "day")
  );
  const [nextDate, setNextDate] = useState(
    dayjs().startOf('day').add(1, "day")
  );

  useEffect(() => {
    // When the selected date changes, update the prev and next dates
    setPrevDate(dayjs(selectedDate).subtract(1, "day"));
    setNextDate(dayjs(selectedDate).add(1, "day"));
  }, [selectedDate]);

  const handleDateChange = (date) => {
    // When a new date is selected, update the selected date in both local state and context
    setSelectedDate(date);
    setDay(date.valueOf());
  };

  // On component mount, set the selected date to today's date
  useEffect(() => {
    handleDateChange(dayjs().startOf('day'));
  }, []);

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

export default SingleDaySelector;
