import React, { useState } from 'react';
import CircularImage from './CircularImage';

const Sidebar = ({ src, items }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div style={{
      width: isMinimized ? '40px' : '140px',
      height: '100vh',
      background: '#3c91e6',
      position: 'fixed',
      left: isMinimized ? '-160px' : '0px',
      top: '0px',
      transition: 'all 0.5s ease-in-out',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        height: '100px',
        cursor: 'pointer'
      }} onClick={() => {
        // Get a random number between 1 and 10
        const randomNum = Math.floor(Math.random() * 10) + 1;
        // Import "randomnumber.jpeg" from the images folder
        const randomImg = require(`../images/${randomNum}.jpeg`);
        // Set the image source to the random image
        setImgSrc(randomImg);
      }}>
        <CircularImage src={imgSrc} />
      </div>
      {!isMinimized && (
        <div style={{
          display: 'flex',
          flex: 1,
        }}>
          {/* <hr /> */}
          <ul style={{
            listStyle: 'none',
            padding: '0px',
            margin: '0px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;