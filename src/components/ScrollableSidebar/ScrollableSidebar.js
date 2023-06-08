import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';

export default function ScrollableSidebar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate dummy log dates for the past week
  const logDates = Array.from({length: 7}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' format
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const listStyle = {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'lightgray',
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  };

  return (
    <Box>
      <DatePicker
        label="Date picker"
        value={selectedDate}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} />}
      />
      <List style={listStyle}>
        {logDates.map((logDate, index) => (
          <ListItem button key={index} onClick={() => handleDateChange(new Date(logDate))}>
            <ListItemText primary={logDate} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
