const functions = require("firebase-functions");

const { downloadFileFromStorage } = require("../storage/download");
const { getTranscriptPath: getTranscriptionPath } = require("../storage/paths");
const { uploadTranscription } = require("../storage/upload");
const { transcribeAudio } = require("../utils/transcription");
const { updateFileDocument } = require("../firestore/files");

module.exports = functions.firestore
  .document("users/{userId}/files/{fileId}")
  .onUpdate(async (change, context) => {
    await onStorageUrlChange(change, context);
  });

async function onStorageUrlChange(change, context) {
  const newValue = change.after.data();
  const storageUrl = newValue.storageUrl;

  if (!storageUrl) {
    console.log("Storage URL not found, skipping transcription.");
    return null;
  }

  const filePath = newValue.filePath;
  const fileBucket = newValue.fileBucket;

  const audioBytes = await downloadFileFromStorage(fileBucket, filePath);
  const transcription = await transcribeAudio(audioBytes);

  if (!transcription) {
    console.log("Transcription failed.");
    return null;
  }

  const userId = context.params.userId;
  const fileId = context.params.fileId;
  const storagePath = getTranscriptionPath(userId, fileId);
  const storageRef = await uploadTranscription(storagePath, transcription);
  updateFileDocument(userId, fileId, {
    transcriptionUrl: await storageRef.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    }),
  });
}
