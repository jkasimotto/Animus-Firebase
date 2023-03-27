const admin = require("firebase-admin");
const { getFilesCollection } = require("./collections");

async function updateFileDocument(userId, fileId, updateData) {
  await getFilesCollection(userId).doc(fileId).update(updateData);
}

async function batchWriteFileDocuments(files, uid) {
  const batch = admin.firestore().batch();

  files.forEach((file) => {
    const fileRef = getFilesCollection(uid).doc(file.id);
    const fileDocument = createFileDocument(file, uid);
    batch.set(fileRef, fileDocument);
  });

  await batch.commit();
}

function createFileDocument(file, uid) {
  return {
    fileId: file.id,
    name: file.name,
    mimeType: file.mimeType,
    size: file.size,
    uid: uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    source: "drive",
    fileCreationTimestamp: admin.firestore.Timestamp.fromDate(file.timestamp),
    fileCreationTimestampError: file.timestampError,
  };
}

module.exports = {
  updateFileDocument,
  batchWriteFileDocuments,
};
