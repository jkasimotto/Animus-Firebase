const functions = require("firebase-functions");

const {
  downloadFileFromStorage,
  uploadTranscription,
  getDownloadUrl,
} = require("../storage");
const { transcribeAudio: transcribe } = require("../utils/transcription");
const { updateMedia } = require("../firestore");

module.exports = functions
  .runWith({ secrets: ["OPENAI_API_KEY"] })
  .storage.object()
  .onFinalize(async (object) => {
    await transcribeAudioFileOnUpload(object);
  });

async function transcribeAudioFileOnUpload(object) {
  const filePath = object.name;
  const fileBucket = object.bucket;

  // Only transcribe files in the audio/ folder
  if (!filePath.startsWith("audio/")) {
    console.log(
      "Uploaded file is not in the audio folder, skipping transcription."
    );
    return null;
  }

  // Download the audio file from Firebase Storage
  const audioBytes = await downloadFileFromStorage(fileBucket, filePath);

  // Transcribe the audio file using your transcription API
  const transcription = await transcribe(audioBytes);

  if (!transcription) {
    console.log("Transcription failed.");
    return null;
  }

  // Extract userId and mediaId from the filePath
  const filePathParts = filePath.split("/");
  const userId = filePathParts[1];
  const mediaId = filePathParts[2];

  // Upload the transcription to Firebase Storage
  const storageRef = await uploadTranscription(userId, mediaId, transcription);

  // Retrieve the download URL for the uploaded transcription
  const transcriptionUrl = await getDownloadUrl(storageRef);

  // Update the Firestore document with the transcription URL
  // and update the transcription status to 'completed'
  const data = {
    text: transcription,
    transcriptionStatus: "completed",
    storagePath: transcriptionUrl,
  };
  await updateMedia(mediaId, data);

  console.log("Transcription completed and media document updated.");
}
