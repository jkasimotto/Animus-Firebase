// src/components/PageContent/PageContent.js
import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from '../../auth/auth';
// Import your pages here
import DocumentPage from '../../pages/DocumentsPage/DocumentsPage';
import SignInPage from '../../pages/SignInPage/SignInPage';

const PageContent = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user ? (
        <Routes>
          <Route path="/" element={<DocumentPage />} />
          {/* Add more routes as needed */}
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<SignInPage />} />
        </Routes>
      )}
    </>
  );
};

export default PageContent;
