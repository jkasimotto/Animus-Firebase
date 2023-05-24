import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/messaging";
import { 
  getFirestore,
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    settings: { cacheSizeBytes: Infinity },
  }),
});
const functions = getFunctions(app);

if (process.env.REACT_APP_ENVIRONMENT === "development") {
  // Set the emulator ports as variables
  const firestorePort = process.env.REACT_APP_EMULATOR_FIRESTORE_PORT;
  const storagePort = process.env.REACT_APP_EMULATOR_STORAGE_PORT;
  const functionsPort = process.env.REACT_APP_EMULATOR_FUNCTIONS_PORT;

  console.log("Google client id:", process.env.REACT_APP_GOOGLE_CLIENT_ID);
  console.log("Running in local environment, connecting to emulators.");
  connectFirestoreEmulator(db, "localhost", firestorePort);
  connectStorageEmulator(storage, "localhost", storagePort);
  connectFunctionsEmulator(functions, "localhost", functionsPort);
  console.log("Firestore emulator connected on port " + firestorePort);
  console.log("Storage emulator connected on port " + storagePort);
  console.log("Functions emulator connected on port " + functionsPort);
}

export { app, storage, db, functions };
export default app;
