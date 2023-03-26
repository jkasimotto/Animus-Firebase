// storage.js
const admin = require("firebase-admin");

async function uploadAudio(path, buffer) {
  const bucket = admin.storage().bucket();
  const storageRef = bucket.file(path);
  await storageRef.save(buffer, {
    metadata: {
      contentType: "audio/mp4",
    },
  });
  return storageRef;
}

async function uploadTranscription(path, transcription) {
  const bucket = admin.storage().bucket();
  const storageRef = bucket.file(path);
  await storageRef.save(transcription, {
    metadata: {
      contentType: "text/plain",
    },
  });
  return storageRef;
}

module.exports = {
  uploadAudio,
  uploadTranscription
};
