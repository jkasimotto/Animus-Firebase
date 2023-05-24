// src/firestore.js

import {
  doc,
  collection,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// Check if a user's Google Drive tokens exist
const checkGoogleDriveTokensExist = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();
    return !!(userData.googleDrive && userData.googleDrive.tokens);
  } catch (error) {
    console.error("Error checking Google Drive tokens:", error);
    return false;
  }
};

// Retrieve audio, text, and video metadata documents between dates
const getMetadataBetweenDates = async (
  userId,
  startDate,
  endDate,
  fileType
) => {
  try {
    const metadataRef = collection(db, "users", userId, fileType);
    const metadataQuery = query(
      metadataRef,
      where("createdAt", ">=", startDate),
      where("createdAt", "<=", endDate)
    );
    const metadataSnapshot = await getDocs(metadataQuery);
    return metadataSnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error retrieving metadata between dates:", error);
    return [];
  }
};

export { checkGoogleDriveTokensExist, getMetadataBetweenDates };
