import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import styles from "./styles/App.module.css";
import Box from "@mui/material/Box";
import { initFirebaseAuth, AuthProvider } from "./auth/auth";
// import all images from the ./images folder
// and save them to the images object
const images = require.context("./images", true);

initFirebaseAuth();

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className={styles.app}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Header />
            <div className={styles.mainContainer}>
              <MainContent />
            </div>
          </Box>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

// Cee5f2
// accbe1
