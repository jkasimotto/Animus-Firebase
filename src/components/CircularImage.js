import React, { useState } from 'react';

const CircularImage = ({ src, onClick, onDoubleClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleDoubleClick = (event) => {
    if (onDoubleClick) {
      onDoubleClick(event);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        borderRadius: '50%',
        width: '100px',
        height: '100px',
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: 'pointer',
        filter: isHovered ? 'brightness(75%)' : 'brightness(100%)'
      }}
    />
  );
};

export default CircularImage;
