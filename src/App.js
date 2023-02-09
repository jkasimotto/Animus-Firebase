import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Creations from './components/Creations';
import Creation from './components/Creation';
import styles from './styles/App.module.css';
// import all images from the ./images folder
// and save them to the images object
const images = require.context('./images', true);

const App = () => {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Header />
        <div className={styles.mainContainer}>
          <MainContent />
        </div>
      </div>
    </BrowserRouter>
  );

};

export default App;

// Cee5f2
// accbe1
