import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <p>Sidebar content goes here</p>
      </div>
    </aside>
  );
};

export default Sidebar;
