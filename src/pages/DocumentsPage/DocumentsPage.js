// src/pages/DocumentPage.js
import React, { useContext } from "react";
import {
  DocumentsContext,
  DocumentsProvider,
} from "../../context/DocumentsContext/DocumentProvider";
import DocumentList from "../../components/DocumentList/DocumentList";
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import SyncDriveButton from "../../components/SyncDriveButton/SyncDriveButton";
import DaySwitcher from "../../components/DaySwitcher/DaySwitcher";
import { isSameDay, firestoreTimestampToDate } from "../../utils/timeUtils";

const DocumentPageContent = () => {
  const { documents, selectedDay, setSelectedDay } =
    useContext(DocumentsContext);

  const filteredDocuments = documents.filter((document) => {
    const date = firestoreTimestampToDate(document.timestamp);
    return isSameDay(date, selectedDay);
  });

  return (
    <PageWrapper>
      <SyncDriveButton />
      <DaySwitcher setSelectedDay={setSelectedDay} />
      <DocumentList documents={filteredDocuments} />
    </PageWrapper>
  );
};

const DocumentPage = () => {
  return (
    <DocumentsProvider>
      <DocumentPageContent />
    </DocumentsProvider>
  );
};

export default DocumentPage;
