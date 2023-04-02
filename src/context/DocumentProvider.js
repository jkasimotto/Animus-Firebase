import React, { createContext, useContext, useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { AuthContext } from "../auth/auth";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  getDownloadURL,
} from "firebase/storage";

export const DocumentsContext = createContext();

export const DocumentsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (!user) {
      console.log("User not logged in");
      return;
    }
    console.log("User logged in. Fetching transcripts...");

    const documentsRef = collection(db, "users", user.uid, "files");
    const documentsQuery = query(documentsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(documentsQuery, async (snapshot) => {
      const changes = snapshot.docChanges();
      for (const change of changes) {
        if (change.type === 'added') {
          const doc = change.doc;
          const docData = doc.data();
          try {
            const textFile = await downloadTranscription(user.uid, doc.data().fileId);
            const newDoc = {
              id: doc.id,
              ...doc.data(),
              transcription: textFile,
              timestamp: docData.fileCreationTimestamp
            };
            setDocuments((prevState) => [newDoc, ...prevState]);
          } catch (error) {
            console.error("Error downloading transcription:", error);
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <DocumentsContext.Provider value={documents}>
      {children}
    </DocumentsContext.Provider>
  );
};

async function downloadTranscription(userId, fileId) {
  const fileRef = ref(
    storage,
    `user-transcripts/${userId}/${fileId}/transcript`
  );

  console.log("Downloading transcription from:", fileRef.fullPath);

  try {
    const url = await getDownloadURL(fileRef);
    const response = await fetch(url);
    const transcription = await response.text();
    return transcription;
  } catch (error) {
    console.error("Error downloading transcription:", error);
    throw error;
  }
}