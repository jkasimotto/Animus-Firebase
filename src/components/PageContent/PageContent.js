// src/components/PageContent.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Import your pages here
import DocumentPage from '../../pages/DocumentsPage/DocumentsPage';

const PageContent = () => {
  return (
    <Routes>
      <Route path="/" element={<DocumentPage />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default PageContent;
