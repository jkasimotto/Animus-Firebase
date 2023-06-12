import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarIcon from '@mui/icons-material/CalendarToday'; // make sure to import the calendar icon
import FaceIcon from '@mui/icons-material/Face';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Box, Drawer, Grid, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TimePeriodContext } from '../../contexts/TimePeriodContext';
import AudioTextField from '../AudioTextField/AudioTextField';


function BottomNav({ menuComponents }) {
    const { startDate, endDate, setDay, setCustomRange } = useContext(TimePeriodContext);

    const location = useLocation();

    const [showTextField, setShowTextField] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false); // new state
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleStartDateChange = (date) => {
        if (dayjs(date).isAfter(endDate)) {
            setCustomRange(dayjs(date), dayjs(date));
        } else {
            setCustomRange(dayjs(date), endDate);
        }
    };

    const handleEndDateChange = (date) => {
        console.log('handleEndDateChange');
        if (dayjs(date).isBefore(startDate)) {
            console.log('before');
            setCustomRange(dayjs(date), dayjs(date));
        } else {
            console.log('after');
            setCustomRange(startDate, dayjs(date));
        }
    };

    const toggleSettingsDrawer = (open) => () => {
        setIsSettingsOpen(open);
    };

    const handleCalendarClick = () => {
        setShowTextField(false);
        setShowDatePicker((prev) => !prev);
    };

    const handleFaceClick = () => {
        setShowDatePicker(false);
        setShowTextField((prev) => !prev);
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
                </Box>
            )}
            {showDatePicker && (
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        padding: '1em',
                        borderTop: '1px solid #ddd',
                        transition: 'transform 0.3s ease-in-out',
                        transform: showDatePicker ? 'translateX(0)' : 'translateX(-100%)',
                    }}
                >
                    <DatePicker
                        value={startDate}
                        onChange={handleStartDateChange}
                        localeAdapter={dayjs}
                        renderInput={({ open }) => (
                            <IconButton onClick={open}>Start Date</IconButton>
                        )}
                    />
                    <DatePicker
                        value={endDate}
                        onChange={handleEndDateChange}
                        localeAdapter={dayjs}
                        renderInput={({ open }) => (
                            <IconButton onClick={open}>End Date</IconButton>
                        )}
                    />
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
                    <Grid item xs={1}></Grid>
                    <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Link to="/">
                            <IconButton style={location.pathname === "/" ? { color: "blue" } : {}}>
                                <BarChartIcon />
                            </IconButton>
                        </Link>
                    </Grid>
                    <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Link to="/logs">
                            <IconButton style={location.pathname === "/logs" ? { color: "blue" } : {}}>
                                <TimelineIcon />
                            </IconButton>
                        </Link>
                    </Grid>
                    <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <IconButton onClick={handleCalendarClick}>
                            <CalendarIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <IconButton onClick={handleFaceClick}>
                            <FaceIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <IconButton onClick={toggleSettingsDrawer(true)}>
                            <SettingsIcon />
                        </IconButton>
                        <Drawer
                            anchor="right"
                            open={isSettingsOpen}
                            onClose={toggleSettingsDrawer(false)}
                        >
                            <Box
                                sx={{ width: 250 }}
                                role="presentation"
                                onClick={toggleSettingsDrawer(false)}
                                onKeyDown={toggleSettingsDrawer(false)}
                            >
                                {menuComponents.map((Component, index) => <Component key={index} />)}
                            </Box>
                        </Drawer>
                    </Grid>
                    <Grid item xs={1}></Grid>
                </Grid>
            </Box>

        </Box>
    );
}

export default BottomNav;
