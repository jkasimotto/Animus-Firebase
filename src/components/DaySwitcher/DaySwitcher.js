// src/components/DaySwitcher/DaySwitcher.js
import React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

const DaySwitcher = ({ setSelectedDay }) => {
  const changeDay = (offset) => {
    const currentDay = new Date();
    currentDay.setDate(currentDay.getDate() + offset);
    setSelectedDay(currentDay.getTime());
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
