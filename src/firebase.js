// firebase.js

import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/messaging";
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFirebaseConfig } from "./firebase-config";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseAppConfig = getFirebaseConfig();
const app = initializeApp(firebaseAppConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const functions = getFunctions(app);

// Check if we are running in a local environment
if (window.location.hostname === "localhost") {

  // Check we are in the development environment
  if (process.env.REACT_APP_ENVIRONMENT !== "development") {
    throw new Error("Running in local environment, but not in development environment.");
  } 

  // If so, connect to the local emulator
  console.log("Running in local environment, connecting to emulators.");

  connectFirestoreEmulator(db, "localhost", process.env.REACT_APP_EMULATOR_FIRESTORE_PORT);
  console.log("Firestore emulator connected on port " + process.env.REACT_APP_EMULATOR_FIRESTORE_PORT + "");

  connectStorageEmulator(storage, "localhost", process.env.REACT_APP_EMULATOR_STORAGE_PORT);
  console.log("Storage emulator connected on port " + process.env.REACT_APP_EMULATOR_STORAGE_PORT + "");

  connectFunctionsEmulator(functions, "localhost", process.env.REACT_APP_EMULATOR_FUNCTIONS_PORT);
  console.log("Functions emulator connected on port " + process.env.REACT_APP_EMULATOR_FUNCTIONS_PORT + "");

};

(async () => {
  try {
    await enableIndexedDbPersistence(db);
    console.log("Persistence enabled.");
  } catch (err) {
    if (err.code === "failed-precondition") {
      console.log("Multiple tabs open, persistence can be enabled in only one tab at a time.");
    } else if (err.code === "unimplemented") {
      console.log("The current browser does not support offline persistence.");
    }
  }
})();



export { app, storage, db, functions };
export default app;
