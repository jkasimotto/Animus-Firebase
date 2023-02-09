import React from "react";
import { Routes, Route } from "react-router";
import Home from "./Home";
import About from "./About";
import Creations from "./Creations";
import Creation from "./Creation";
import Chat from "./components/Chat";
import styles from "./MainContent.module.css";

const MainContent = () => {
  return (
    <main className={styles.mainContent}>
      <Routes>
        <Route path="/" element={<Creations />} />
        <Route path="/about" element={<About />} />
        <Route path="/articles" element={<Creations />} />
        <Route path="/articles/:id" element={<Creation  />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </main>
  );
};

export default MainContent;
