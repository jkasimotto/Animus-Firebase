// src/components/PageWrapper.js
import React from 'react';
import Box from '@mui/material/Box';

const PageWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        height: '100vh',
        position: 'relative',
      }}
    >
      {children}
    </Box>
  );
};

export default PageWrapper;
