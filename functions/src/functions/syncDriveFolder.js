const functions = require("firebase-functions");
const {
  getDriveApiClient,
  getDriveFiles,
  updateChannelLastNotification,
} = require("../utils/drive");
const { batchWriteFileDocuments } = require("../firestore/files");
const { getChannelDocByUserId } = require("../firestore/channels");
const { getUserTokens } = require("../firestore/users");
const { extractTimestampFromFilename } = require("../utils/filename");

module.exports = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;

  if (!uid) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  try {
    // Retrieve the Google Drive channel document
    const channelDoc = await getChannelDocByUserId(uid);
    const channelData = channelDoc.data();

    // Extract user ID and refresh token
    const drive = await getDriveApiClient(uid);

    // Fetch Google Drive files
    const files = await getDriveFiles(
      drive,
      channelData.fileId,
      channelData.lastNotification
    );

    // Log number of files found
    functions.logger.info(`${files.length} files found`);

    // Extract timestamps from filenames and handle erroneous filenames
    const filesWithTimestamps = files.map((file) => {
      const { timestamp, timestampError } = extractTimestampFromFilename(
        file.name
      );
      functions.logger.info(`Timestamp: ${timestamp}`);
      functions.logger.info(`Timestamp error: ${timestampError}`);
      return { ...file, timestamp, timestampError };
    });

    // Write file documents to the database
    await batchWriteFileDocuments(filesWithTimestamps, uid);

    // Update channel's last notification timestamp
    await updateChannelLastNotification(channelDoc.id);

    return { success: true };
  } catch (error) {
    functions.logger.error("Error syncing drive folder:", error);
    throw new functions.https.HttpsError(
      "internal",
      "An error occurred while syncing the drive folder."
    );
  }
});
