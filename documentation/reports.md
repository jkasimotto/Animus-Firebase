Report Document Structure in Firestore:

Field	Description
reportId	Unique ID for the report
userId	ID of the user who owns the report
type	Type of report (e.g., "work mood", "daily summary")
contents	The content of the report, stored as text
updatedAt	Timestamp of the last update
relatedDocs	Array of mediaIds that have been analyzed
pendingDocs	Array of mediaIds that need to be analyzed
needsUpdate	Flag to indicate if the report needs updating
Firebase Storage:

Larger reports will eventually be stored in Firebase Storage at /reports/{userId}/{reportId}

Cloud Functions:

Function	Trigger	Functionality
onNewDocument	On creating a new media document	Checks media type. If audio/video, initiates transcription process and ends.
onTranscriptionComplete	On completion of transcription	Handles transcription results, initiates GPT-4 analysis, adds mediaId to pendingDocs, sets needsUpdate=true
Processing Flow:

New media document is created.
onNewDocument function triggers. If audio/video, starts transcription.
When transcription is complete, onTranscriptionComplete function triggers.
onTranscriptionComplete processes the transcription, initiates GPT-4 analysis, adds mediaId to pendingDocs of related report(s), and sets needsUpdate=true.