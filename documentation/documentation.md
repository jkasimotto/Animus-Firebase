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