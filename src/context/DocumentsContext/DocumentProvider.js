import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/auth";
import {
  onSnapshot,
} from "firebase/firestore";
import { buildDocumentsQuery } from "./documentsQuery";
import { handleDocumentChanges } from "./handleDocumentChanges";


export const DocumentsContext = createContext();

export const DocumentsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [selectedDay, setSelectedDay] = useState(new Date().getTime());

  useEffect(() => {
    if (!user) {
      console.log("User not logged in");
      return;
    }
    console.log("User logged in. Fetching transcripts...");

    const documentsQuery = buildDocumentsQuery(user.uid, selectedDay);

    const unsubscribe = onSnapshot(documentsQuery, async (snapshot) => {
      const changes = snapshot.docChanges();
      await handleDocumentChanges(user.uid, changes, setDocuments, selectedDay);
    });

    return () => {
      unsubscribe();
    };
  }, [user, selectedDay]);

  return (
    <DocumentsContext.Provider
      value={{ documents, selectedDay, setSelectedDay }}
    >
      {children}
    </DocumentsContext.Provider>
  );
};

