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
import DateNavigation from "../../components/DateNavigation/DateNavigation";
import { isSameDay } from "../../utils/timeUtils";
import dayjs from "dayjs";

const DocumentPageContent = () => {
  const { documents, selectedDay, setSelectedDay } =
    useContext(DocumentsContext);

  const filteredDocuments = documents.filter((document) => {
    const date = dayjs(document.timestamp.toDate());
    return isSameDay(date, dayjs(selectedDay));
  });

  return (
    <PageWrapper>
      <SyncDriveButton />
      <DaySwitcher selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
      <DateNavigation
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
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
