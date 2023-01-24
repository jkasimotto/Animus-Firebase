import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ sidebarSrc, sidebarItems, children }) => {
  const [isSidebarMaximized, setIsSidebarMaximized] = useState(false);

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
    }}>
      <Sidebar 
        src={sidebarSrc}
        items={sidebarItems}
        onClick={() => setIsSidebarMaximized(!isSidebarMaximized)}
      />
      <div style={{
        flex: 1,
        marginLeft: isSidebarMaximized ? '40px' : '140px',
        transition: 'all 0.5s ease-in-out',
      }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
