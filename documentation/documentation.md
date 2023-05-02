## Overview
Animus is a React-based application that uses Firebase functions and two Firebase projects: animus-production for production and animus-development for development. It retrieves audio messages from a user's Google Drive and uploads them to Firebase storage for transcription. The transcribed files, along with the original audio, are stored in Firebase storage. Animus creates a Firestore document to represent each audio file and its transcription, and displays the transcriptions to the user.

## ChatGPT Workflow
1. Define the feature, including libraries and modules that will be used.
2. Create a branch to work on the feature.
3. Write code and tests, following coding standards and using the identified libraries and modules.
4. Test and debug the feature thoroughly.
5. Merge into development once satisfied with the feature.
6. Review and test again with the team to ensure compatibility.
7. Release to production when confident the feature works correctly.

## Firestore structure:
users: Store user information.
    userId: unique ID for the user
    email: user's email
    displayName: user's display name
    createdAt: timestamp of user registration
    updatedAt: timestamp of last update
    googleDrive: object containing Google Drive information (optional)
        accessToken: OAuth2 access token
        refreshToken: OAuth2 refresh token
        expiresIn: OAuth2 token expiration time
        syncedFiles: array of objects containing Google Drive file information
            fileId: Google Drive file ID
            lastSynced: timestamp of the last time the file was synced