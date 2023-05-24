const admin = require("firebase-admin");
const storage = admin.storage();
const bucket = storage.bucket();

// Uploads a media file to Firebase Storage
async function uploadMedia(userId, mediaId, fileData, type) {
  const filePath = `${type}/${userId}/${mediaId}`;
  const fileRef = bucket.file(filePath);
  await fileRef.save(fileData);
  return fileRef;
}

// Uploads a transcription file to Firebase Storage
async function uploadTranscription(userId, fileId, fileData) {
  const filePath = `transcriptions/${userId}/${fileId}`;
  const fileRef = bucket.file(filePath);
  await fileRef.save(fileData);
  return fileRef;
}

// Retrieves a signed URL to download a file from Firebase Storage
async function getDownloadUrl(fileRef) {
  const urlConfig = {
    action: "read",
    expires: Date.now() + 1000 * 60 * 60 * 24, // 1 day
  };
  const [url] = await fileRef.getSignedUrl(urlConfig);
  return url;
}

// Downloads a file from Firebase Storage
async function downloadFileFromStorage(bucketName, filePath) {
  const fileRef = bucket.file(filePath);
  const [fileData] = await fileRef.download();
  return fileData;
}

module.exports = {
  uploadMedia,
  uploadTranscription,
  getDownloadUrl,
  downloadFileFromStorage,
};
