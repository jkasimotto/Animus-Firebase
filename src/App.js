// src/App.js
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/auth";
import Layout from "./components/Layout/Layout";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App = () => {
  console.log("Environment: " + process.env.REACT_APP_ENVIRONMENT);
  console.log(
    "Firebase project id (from config): " +
      process.env.REACT_APP_FIREBASE_PROJECT_ID
  );
  console.log(
    "Test environment variable: " + process.env.REACT_APP_TEST_ENV_VAR
  );
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Layout />
        </LocalizationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
