// storage.js
const admin = require("firebase-admin");

async function uploadAudio(filepath, audioBytes) {
  const bucket = admin.storage().bucket();
  const storageRef = bucket.file(filepath);

  await storageRef.save(audioBytes, {
    metadata: {
      contentType: "audio/mp4",
    },
  });

  return storageRef;
}

module.exports = {
  uploadAudio,
};
