import React from "react";
import { Routes, Route } from "react-router";
import Home from "./Home";
import About from "./About";
import Articles from "./Articles";
import styles from "./MainContent.module.css";

const MainContent = () => {
  return (
    <main className={styles.mainContent}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/articles" element={<Articles />} />
      </Routes>
    </main>
  );
};

export default MainContent;
