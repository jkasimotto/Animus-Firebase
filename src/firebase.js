// firebase.js

import { initializeApp } from "firebase/app";
import "firebase/auth";
import "firebase/messaging";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFirebaseConfig } from "./firebase-config";
import { getFunctions } from 'firebase/functions';

const firebaseAppConfig = getFirebaseConfig();
const app = initializeApp(firebaseAppConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { app, storage, db, functions };
export default app;
