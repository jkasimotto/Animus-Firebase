// src/components/PageContent/PageContent.js
import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from '../../auth/auth';
// Import your pages here
import SignInPage from '../../pages/SignInPage/SignInPage';
import MediaTimelinePage from '../../pages/MediaTimelinePage/MediaTimelinePage';

const PageContent = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user ? (
        <Routes>
          <Route path="/" element={<MediaTimelinePage />} />
          {/* <Route path="/test" element={<MediaTimelinePage />} /> */}
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
