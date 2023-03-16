import React from 'react';
import Button from '@mui/material/Button';

const SubmitButton = ({ text, icon, onClick, ...props }) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick} {...props}>
      {icon ? icon : text}
    </Button>
  );
};

export default SubmitButton;
