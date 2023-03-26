const admin = require("firebase-admin");

async function downloadFileFromStorage(bucketName, filePath) {
  const bucket = admin.storage().bucket(bucketName);
  const file = bucket.file(filePath);
  const [data] = await file.download();
  return data;
}

module.exports = {
    downloadFileFromStorage,
};