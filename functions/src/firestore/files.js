const admin = require("firebase-admin");
const { getFilesCollection } = require('./collections');

async function updateFileDocument(userId, fileId, updateData) {
  await getFilesCollection(userId).doc(fileId).update(updateData);
}

async function batchWriteFileDocuments(files, uid) {
  const batch = admin.firestore().batch();

  files.forEach((file) => {
    const fileRef = getFilesCollection(uid).doc(file.id);
    batch.set(fileRef, {
      fileId: file.id,
      name: file.name,
      mimeType: file.mimeType,
      size: file.size,
      uid: uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      source: "drive",
    });
  });

  await batch.commit();
}

module.exports = {
  updateFileDocument,
  batchWriteFileDocuments
};
