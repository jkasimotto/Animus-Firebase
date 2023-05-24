const functions = require("firebase-functions");
const { getDriveApiClient, getDriveFiles } = require("../utils/drive");
const { extractTimestampFromFilename } = require("../utils/filename");
const admin = require("firebase-admin");
const db = admin.firestore();

module.exports = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;
  if (!uid) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }
  try {
    const userDoc = await db.collection("users").doc(uid).get();
    const googleDriveInfo = userDoc.data().googleDrive;
    const drive = await getDriveApiClient(googleDriveInfo.tokens);
    const syncedFile = googleDriveInfo.syncedFiles[0];

    const files = await getDriveFiles(
      drive,
      syncedFile.fileId,
      googleDriveInfo.lastSynced
    );

    const filesWithTimestamps = files.map((file) => {
      const { timestamp, timestampError } = extractTimestampFromFilename(
        file.name
      );
      return { ...file, timestamp, timestampError, googleDriveId: file.id };
    });

    const batch = db.batch();
    filesWithTimestamps.forEach((file) => {
      const docRef = db.collection("media").doc();
      batch.set(docRef, {
        mediaId: docRef.id,
        type: "audio",
        userId: uid,
        storagePath: `/media/${uid}/${docRef.id}`,
        transcriptionStatus: "pending",
        text: "",
        title: file.name,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        timestamp: file.timestamp,
        source: "googleDrive",
        googleDriveId: file.googleDriveId,
      });
    });
    await batch.commit();

    updateLastSyncedTimestamp(uid);

    return { success: true };
  } catch (error) {
    functions.logger.error("Error syncing Google Drive folder:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while syncing the Google Drive folder."
    );
  }
});

async function updateLastSyncedTimestamp(uid) {
  const currentEnvironment = process.env.NODE_ENV;
  let timestamp;

  functions.logger.info("Current environment:", currentEnvironment);
  if (currentEnvironment === "development") {
    // If in development mode, set to this morning's timestamp
    const thisMorning = new Date();
    thisMorning.setHours(0, 0, 0, 0);
    timestamp = admin.firestore.Timestamp.fromDate(thisMorning);
  } else {
    // In production mode, use the server timestamp
    timestamp = admin.firestore.FieldValue.serverTimestamp();
  }

  await db.collection("users").doc(uid).update({
    "googleDrive.lastSynced": timestamp,
  });
}
