const {
  getDriveApiClient,
  getDriveFiles,
  updateChannelLastNotification,
} = require("../utils/drive");

const functions = require("firebase-functions");
const { batchWriteFileDocuments } = require("../firestore/files");
const { getChannelDoc } = require("../firestore/channels");
const { getUserTokens } = require("../firestore/users");
const { extractTimestampFromFilename } = require("../utils/filename");

module.exports = functions.https.onRequest(async (req, res) => {
  await onDriveNotification(req, res);
});

async function onDriveNotification(req, res) {
  // 1. Validate request headers
  if (!validateHeaders(req, res)) return;

  // 2. Log headers and notification data
  logHeadersAndNotification(req);

  // 3. Retrieve the Google Drive channel document
  const channelId = req.get("X-Goog-Channel-ID");
  const channelDoc = await getChannelDoc(channelId);
  const channelData = channelDoc.data();

  // 4. Extract user ID and refresh token
  const uid = channelData.uid;
  const { _, refreshToken } = await getUserTokens(uid);

  // 5. Initialize Google Drive API client
  const drive = await getDriveApiClient(refreshToken);

  // 6. Fetch Google Drive files
  const files = await getDriveFiles(
    drive,
    channelData.fileId,
    channelData.lastNotification
  );

  // 7. Log number of files found
  functions.logger.info(`${files.length} files found`);

  // 8. Extract timestamps from filenames and handle erroneous filenames
  const filesWithTimestamps = files.map((file) => {
    const { timestamp, timestampError } = extractTimestampFromFilename(
      file.name
    );
    functions.logger.info(`Timestamp: ${timestamp}`);
    functions.logger.info(`Timestamp error: ${timestampError}`);
    return { ...file, timestamp, timestampError };
  });

  // 9. Write file documents to the database
  await batchWriteFileDocuments(filesWithTimestamps, uid);

  // 10. Update channel's last notification timestamp (if in production environment)
  if (process.env.ENVIRONMENT === "production") {
    await updateChannelLastNotification(channelId);
  }

  // 11. Send a 200 OK response
  res.status(200).send("OK");
}

function validateHeaders(req, res) {
  // Check if the request is a POST request
  if (req.method !== "POST") {
    // Return a 405 Method Not Allowed response
    functions.logger.error("Method not allowed");
    res.status(405).send("Method Not Allowed");
    return false;
  }

  // Check if the request has a valid X-Goog-Resource-State header
  const resourceState = req.get("X-Goog-Resource-State");
  if (!resourceState) {
    // Return a 400 Bad Request response
    functions.logger.error("Missing X-Goog-Resource-State header");
    res.status(400).send("Missing X-Goog-Resource-State header");
    return false;
  }

  // Check if the request has a valid X-Goog-Channel-ID header
  const channelId = req.get("X-Goog-Channel-ID");
  if (!channelId) {
    // Return a 400 Bad Request response
    functions.logger.error("Missing X-Goog-Channel-ID header");
    res.status(400).send("Missing X-Goog-Channel-ID header");
    return false;
  }

  // Check if the request has a valid X-Goog-Message-Number header
  const messageNumber = req.get("X-Goog-Message-Number");
  if (!messageNumber) {
    // Return a 400 Bad Request response
    functions.logger.error("Missing X-Goog-Message-Number header");
    res.status(400).send("Missing X-Goog-Message-Number header");
    return false;
  }

  // Check if the request has a valid X-Goog-Resource-ID header
  const resourceId = req.get("X-Goog-Resource-ID");
  if (!resourceId) {
    // Return a 400 Bad Request response
    functions.logger.error("Missing X-Goog-Resource-ID header");
    res.status(400).send("Missing X-Goog-Resource-ID header");
    return false;
  }

  // Check if the request has a valid X-Goog-Resource-URI header
  const resourceUri = req.get("X-Goog-Resource-URI");
  if (!resourceUri) {
    // Return a 400 Bad Request response
    functions.logger.error("Missing X-Goog-Resource-URI header");
    res.status(400).send("Missing X-Goog-Resource-URI header");
    return false;
  }
  return true;
}

function logHeadersAndNotification(req) {
  const resourceState = req.get("X-Goog-Resource-State");
  const channelId = req.get("X-Goog-Channel-ID");
  const messageNumber = req.get("X-Goog-Message-Number");
  const resourceId = req.get("X-Goog-Resource-ID");
  const resourceUri = req.get("X-Goog-Resource-URI");

  functions.logger.info("Headers received:");
  functions.logger.info(`Received notification for ${resourceState}`);
  functions.logger.info(`Channel ID: ${channelId}`);
  functions.logger.info(`Message Number: ${messageNumber}`);
  functions.logger.info(`Resource ID: ${resourceId}`);
  functions.logger.info(`Resource URI: ${resourceUri}`);
}
