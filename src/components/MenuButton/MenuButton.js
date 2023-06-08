import React from 'react';
import { Button, Link } from '@mui/material';

const MenuButton = ({ variant, color, action, loading, hasAction, actionLabel, message, component, to, children }) => {
  return (
    <div>
      <Button
        variant={variant}
        color={color}
        component={component}
        to={to}
        onClick={hasAction ? action : null}
        disabled={loading}
        sx={{ 
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </Button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MenuButton;
