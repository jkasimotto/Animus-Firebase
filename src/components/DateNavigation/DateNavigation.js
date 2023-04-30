import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";

const DateNavigation = ({ setSelectedDay }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedDay(date.valueOf());
  };

  return (
    <DatePicker
      label="Select Date"
      value={selectedDate}
      onChange={handleDateChange}
      renderInput={(params) => <TextField {...params} />}
      format="YYYY-MM-DD"
    />
  );
};

export default DateNavigation;
