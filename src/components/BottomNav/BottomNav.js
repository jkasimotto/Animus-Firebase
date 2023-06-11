import React, { useState, useContext } from 'react';
import { Box, TextField, IconButton, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import FaceIcon from '@mui/icons-material/Face';
import SettingsIcon from '@mui/icons-material/Settings';
import dayjs from 'dayjs';
import { TimePeriodContext } from '../../contexts/TimePeriodContext';
import AudioTextField from '../AudioTextField/AudioTextField';

function BottomNav() {
    const { startDate, endDate, setDay, setCustomRange } = useContext(
        TimePeriodContext
    );

    const [showTextField, setShowTextField] = useState(false);

    const handleStartDateChange = (date) => {
        setDay(date);
    };

    const handleEndDateChange = (date) => {
        setCustomRange(startDate, date);
    };

    return (
        <Box
            component="nav"
            sx={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#eee',
            }}
        >
            {showTextField && (
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        padding: '1em',
                        borderTop: '1px solid #ddd',
                        transition: 'transform 0.3s ease-in-out',
                        transform: showTextField ? 'translateX(0)' : 'translateX(-100%)',
                    }}
                >
                    <AudioTextField />
                    {/* <TextField label="Text" fullWidth /> */}
                </Box>
            )}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '95%',
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={1}>
                        <IconButton onClick={() => setShowTextField((prev) => !prev)}>
                            <FaceIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={5}>
                        <DatePicker
                            date={startDate}
                            onChange={handleStartDateChange}
                            localeAdapter={dayjs}
                            renderInput={({ open }) => (
                                <IconButton onClick={open}>Start Date</IconButton>
                            )}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <DatePicker
                            date={endDate}
                            onChange={handleEndDateChange}
                            localeAdapter={dayjs}
                            renderInput={({ open }) => (
                                <IconButton onClick={open}>End Date</IconButton>
                            )}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <IconButton>
                            <SettingsIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default BottomNav;
