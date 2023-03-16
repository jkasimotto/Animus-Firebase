import React from 'react';
import TextField from '@mui/material/TextField';

const TextBox = ({ label, value, onChange, ...props }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default TextBox;
