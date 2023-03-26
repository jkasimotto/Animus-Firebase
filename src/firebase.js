// firebase.js

import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/messaging";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFirebaseConfig } from "./firebase-config";
import { getFunctions } from "firebase/functions";

const firebaseAppConfig = getFirebaseConfig();
const app = initializeApp(firebaseAppConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const functions = getFunctions(app);

connectFirestoreEmulator(db, "localhost", 8080);
connectStorageEmulator(storage, "localhost", 9199);

export { app, storage, db, functions };
export default app;
