import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import styles from './App.module.css';
// import all images from the ./images folder
// and save them to the images object
const images = require.context('./images', true);

const App = () => {
  console.log(images)
  return (
    <Router>
      <div className={styles.app}>
        <Header />
        <div className={styles.mainContainer}>
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </Router>
  );
};

export default App;

// Cee5f2
// accbe1
