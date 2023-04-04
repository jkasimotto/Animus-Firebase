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


// connectFirestoreEmulator(db, "localhost", 8080);
// connectStorageEmulator(storage, "localhost", 9199);
// connectFunctionsEmulator(functions, "localhost", 5001);

export { app, storage, db, functions };
export default app;
