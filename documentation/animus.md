## Overview
Animus is a React-based application that uses Firebase functions and two Firebase projects: animus-production for production and animus-development for development. It retrieves audio messages from a user's Google Drive and uploads them to Firebase storage for transcription. The transcribed files, along with the original audio, are stored in Firebase storage. Animus creates a Firestore document to represent each audio file and its transcription, and displays the transcriptions to the user.

## Workflow
1. Define the feature.
2. Create a branch.
3. Write code and tests.
4. Test and debug.
5. Merge into development.
6. Review and test again.
7. Release to production.