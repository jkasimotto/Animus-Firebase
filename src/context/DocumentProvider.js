import React, { createContext, useContext, useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { AuthContext } from "../auth/auth";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { retry } from "../utils";

export const DocumentsContext = createContext();

export const DocumentsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  console.log("ENVIROMENT", process.env.REACT_APP_ENVIRONMENT);
  console.log("ROJECT ID", process.env.REACT_APP_PROJECT_ID);

  useEffect(() => {
    if (!user) {
      console.log("User not logged in");
      return;
    }
    console.log("User logged in. Fetching transcripts...");

    const documentsQuery = buildDocumentsQuery(user.uid);

    const unsubscribe = onSnapshot(documentsQuery, async (snapshot) => {
      const changes = snapshot.docChanges();
      await handleDocumentChanges(user.uid, changes, setDocuments);
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

function buildDocumentsQuery(userId) {
  const documentsRef = collection(db, "users", userId, "files");
  return query(documentsRef, orderBy("fileCreationTimestamp", "desc"), limit(20));
}

async function handleDocumentChanges(userId, changes, setDocuments) {
  for (const change of changes) {
    if (change.type === "added" || change.type === "modified") {
      const doc = change.doc;
      const newDoc = await buildDocumentObject(userId, doc);
      updateDocumentsState(newDoc, change.type, setDocuments);
    }
  }
}

async function buildDocumentObject(userId, doc) {
  const docData = doc.data();
  let newDoc;
  try {
    const textFile = await downloadTranscription(userId, docData.fileId);
    newDoc = {
      id: doc.id,
      ...docData,
      text: textFile,
      timestamp: docData.fileCreationTimestamp,
    };
  } catch (error) {
    console.error("Error downloading transcription:", error);
    newDoc = {
      id: doc.id,
      ...docData,
      text: null,
      timestamp: docData.fileCreationTimestamp,
    };
  }
  return newDoc;
}

function updateDocumentsState(newDoc, changeType, setDocuments) {
  if (changeType === "added") {
    setDocuments((prevState) => [newDoc, ...prevState]);
  } else if (changeType === "modified") {
    console.log("Modified document:", newDoc);
    setDocuments((prevState) =>
      prevState.map((d) => (d.id === newDoc.id ? newDoc : d))
    );
  }
}

async function downloadTranscription(userId, fileId) {
  const localStorageKey = `transcription-${userId}-${fileId}`;

  const cachedTranscription = localStorage.getItem(localStorageKey);
  if (cachedTranscription) {
    console.log("Returning transcription from localStorage:", fileId);
    return cachedTranscription;
  }

  const fileRef = ref(
    storage,
    `user-transcripts/${userId}/${fileId}/transcript`
  );

  console.log("Downloading transcription from:", fileRef.fullPath);

  try {
    const url = await getDownloadURL(fileRef);
    const response = await retry(() => fetch(url));
    const transcription = await response.text();
    localStorage.setItem(localStorageKey, transcription);
    return transcription;
  } catch (error) {
    console.error("Error downloading transcription:", error);
    throw error;
  }
}
