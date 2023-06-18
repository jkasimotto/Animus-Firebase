// src/App.js
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/auth";
import Layout from "./components/Layout/Layout";
import TimePeriodProvider from "./contexts/TimePeriodContext";

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
        <TimePeriodProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Layout />
          </LocalizationProvider>
        </TimePeriodProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
