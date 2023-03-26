const functions = require("firebase-functions");
const admin = require("firebase-admin");

const { downloadFile, getDriveApiClient } = require("../utils/drive");
const { getAudioPath } = require("../storage/paths");
const { uploadAudio } = require("../storage/upload");
const { updateFileDocument } = require("../firestore/files");
const { getUserDataById } = require("../firestore/users");
const { moveMoovAtomToStart } = require("../utils/audio");
const config = require("../config");

module.exports = functions.firestore
  .document("users/{userId}/files/{fileId}")
  .onCreate(async (snapshot, context) => {
    await onNewFileInFirestore(snapshot, context);
  });

async function onNewFileInFirestore(snapshot, context) {
  const { userId, fileId } = context.params;
  const userDoc = await admin.firestore().collection("users").doc(userId).get();
  const drive = await getDriveApiClient(userDoc.data().refreshToken);
  const audioBytes = await downloadFile(drive, fileId);
  const audioBytesClean = await moveMoovAtomToStart(audioBytes);
  const storageRef = await uploadAudio(
    getAudioPath(userId, fileId),
    audioBytesClean
  );
  updateFileDocument(userId, fileId, {
    fileBucket: storageRef.bucket.name,
    filePath: storageRef.name,
    fileType: config.fileTypes.AUDIO,
    storageUrl: await storageRef.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    }),
  });
}
