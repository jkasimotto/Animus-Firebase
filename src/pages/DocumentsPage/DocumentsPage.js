// src/pages/DocumentPage.js
import React, { useContext } from 'react';
import { DocumentsContext, DocumentsProvider } from '../../context/DocumentProvider';
import DocumentList from '../../components/DocumentList/DocumentList';
import PageWrapper from '../../components/PageWrapper/PageWrapper';
import SyncDriveButton from '../../components/SyncDriveButton/SyncDriveButton';

const DocumentPageContent = () => {
  const documents = useContext(DocumentsContext);

  return (
    <PageWrapper>
      <SyncDriveButton />
      <DocumentList documents={documents} />
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
