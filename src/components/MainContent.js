import React, {useEffect} from "react";
import { Routes, Route } from "react-router";
import About from "./About";
import ArticlesPage from "./ArticlesPage";
import Article from "./Article";
import Chat from "./Chat";
import styles from "../styles/MainContent.module.css";
import ExamplePage from "./TranscriptPage";
import TranscriptPage from "./TranscriptPage/TranscriptPage";


const MainContent = () => {
  return (
    <main className={styles.mainContent}>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<Article  />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/transcript" element={<TranscriptPage />} />
      </Routes>
    </main>
  );
};

export default MainContent;
