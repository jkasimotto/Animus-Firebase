// src/components/DaySwitcher/DaySwitcher.js
import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';

const DaySwitcher = ({ selectedDay, setSelectedDay }) => {
  const changeDay = (offset) => {
    let newDay;
    if (offset === 0) {
      newDay = dayjs();
    } else {
      newDay = dayjs(selectedDay).add(offset, 'day');
    }
    setSelectedDay(newDay);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
      <ButtonGroup variant="contained">
        <Button onClick={() => changeDay(-1)}>Previous Day</Button>
        <Button onClick={() => changeDay(0)}>Today</Button>
        <Button onClick={() => changeDay(1)}>Next Day</Button>
      </ButtonGroup>
    </Box>
  );
};

export default DaySwitcher;
