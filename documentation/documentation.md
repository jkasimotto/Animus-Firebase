## Overview
Animus is a React-based application that utilizes MUI, Firebase functions, and two Firebase projects: animus-production for production and animus-development for development. The application fetches audio, video, and text files from a user's Google Drive and uploads them to Firebase Storage. Each media file is then transcribed into text (if applicable), and the original files, along with their transcriptions, are represented as documents in Firestore.

The Media Timeline feature allows users to visualize the timeline of their media objects, including audio, video, and text files, in an organized manner using cards. Each card displays relevant information about the media, such as the title and creation timestamp. Users can navigate through the timeline using date navigation components and synchronize their Google Drive to fetch new media files. The Media Timeline provides a comprehensive view of the user's media content, making it easy to access and manage their files within the Animus application.

## Firestore structure:
`users`: Store user information.
- `userId`: unique ID for the user
- `email`: user's email
- `displayName`: user's display name
- `createdAt`: timestamp of user registration
- `updatedAt`: timestamp of last update
- `googleDrive`: object containing Google Drive information (optional)
    - `tokens`: OAuth2 tokens object
        - `accessToken`: OAuth2 access token
        - `refreshToken`: OAuth2 refresh token
        - `expiresIn`: OAuth2 token expiration time
    - `syncedFiles`: array of objects containing Google Drive folder information
        - `fileId`: Google Drive folder ID
    - `lastSynced`: timestamp of the last time the drive was synced

`media`: Store user inputs from different sources (audio, video, and text) as text.
- `mediaId`: auto-generated ID
- `type`: 'audio', 'video', or 'text'
- `userId`: ID of the user who owns the media
- `storagePath`: path to the original file in Firebase Storage
- `transcriptionStatus`: 'pending', 'processing', or 'completed' (if the original file is audio or video)
- `text`: transcribed text (or original text if the input was a text file)
- `title`: title of the card (editable by the user)
- `createdAt`: timestamp of file creation
- `updatedAt`: timestamp of last update
- `timestamp`: timestamp of recording
- `source`: type of source (googleDrive, upload)
- `googleDriveId`: original file's ID from Google Drive.

## Firebase storage structure:
- `/media/{userId}/{mediaId}`: Store media files (audio, video, and text), organized by user ID and media ID.

## Directory structure:
- `README.md`: Contains general information about the project.
- `firebase.json`: Firebase project configuration file.
- `firestore-debug.log`: Log file for Firestore debugging information.
- `firestore.indexes.json`: Configuration file for Firestore indexing rules.
- `firestore.rules.development`: Firestore security rules for the development environment.
- `firestore.rules.production`: Firestore security rules for the production environment.
- `functions/config/config.js`: General configuration for Firebase functions.
- `functions/config/development/firebase-config-dev.js`: Firebase project configuration for the development environment.
- `functions/config/production/firebase-config-prod.js`: Firebase project configuration for the production environment.
- `functions/firestore-debug.log`: Log file for Firestore debugging information specific to functions.
- `functions/src/config.js`: Configuration file for Firebase functions' source code.
- `functions/src/firestore/*`: Contains Firebase functions for interacting with Firestore.
- `functions/src/functions/*`: Contains core Firebase cloud functions.
- `functions/src/storage/*`: Contains functions for interacting with Firebase Storage.
- `functions/src/utils/*`: Contains utility functions used across Firebase functions.
- `src/App.js`: The main React component for the application.
- `src/auth/auth.js`: Contains functions related to authentication.
- `src/components/*`: Contains reusable React components.
- `src/firebaseConfig.js`: Firebase project configuration file used in the front-end.
- `src/pages/*`: Contains the main page components of the application.
- `src/services/firestore.js`: Contains functions for interacting with Firestore from the front-end.
- `src/utils/*`: Contains utility functions used across the front-end.
- `storage.rules`: Firebase Storage security rules file.

`functions/src/functions/*`:

- `authenticateDrive.js`: This function likely authenticates the user with Google Drive using OAuth.
- `createDriveWatchChannel.js`: This function possibly creates a watch channel with Google Drive to receive notifications of changes.
- `googleOAuth.js`: This function likely handles the OAuth process with Google.
- `onDriveNotification.js`: This function is probably triggered by notifications from the Google Drive watch channel and processes those notifications.
- `onNewFileInFirestore.js`: This function likely gets triggered when a new file document is created in Firestore.
- `onNewUser.js`: This function is probably triggered when a new user is created in Firestore.
- `onStorageUrlChange.js`: This function likely gets triggered when the URL of a file in Firebase Storage is changed.
- `processNewAudioFile.js`: This function likely processes newly uploaded audio files.
- `syncDriveFolder.js`: This function probably syncs files from a user's Google Drive folder.
- `transcribeAudioFileOnUpload.js`: This function likely transcribes audio files when they are uploaded.

`src/components/*`:

- `AudioCard.js`: This component likely renders a card for an audio file.
- `DateNavigation.js`: This component probably allows the user to navigate through dates.
- `DaySwitcher.js`: This component likely allows the user to switch between different days.
- `DocumentList.js`: This component likely renders a list of document files.
- `Layout.js`: This component likely controls the general layout of the application.
- `MediaCard.js`: This component probably renders a card for a media file (audio, video, or text).
- `MediaCardList.js`: This component likely renders a list of media cards.
- `PageContent.js`: This component likely controls the content of a page.
- `PageWrapper.js`: This component likely wraps the entire page content.
- `SignIn.js`: This component likely renders the sign-in form.
- `SyncDrive.js`: This component probably handles the synchronization with Google Drive.
- `SyncDriveButton.js`: This component likely renders a button that triggers synchronization with Google Drive.
- `TextCard.js`: This component likely renders a card for a text file.
- `TextUploader.js`: This component probably handles the upload of text files.
- `VideoCard.js`: This component likely renders a card for a video file.
