const {
  getDriveApiClient,
  getDriveFiles,
  updateChannelLastNotification,
} = require("../utils/drive");

const functions = require("firebase-functions");
const { batchWriteFileDocuments } = require("../firestore/files");
const { getChannelDoc } = require("../firestore/channels");
const { getUserTokens } = require("../firestore/users");

module.exports = functions.https.onRequest(async (req, res) => {
  await onDriveNotification(req, res);
});

async function onDriveNotification(req, res) {
  // Call the functions in the correct order
  if (!validateHeaders(req, res)) return;
  logHeadersAndNotification(req);
  const channelId = req.get("X-Goog-Channel-ID");
  const channelDoc = await getChannelDoc(channelId);
  const channelData = channelDoc.data();
  const uid = channelData.uid;
  const { _, refreshToken } = await getUserTokens(uid);
  const drive = await getDriveApiClient(refreshToken);
  const files = await getDriveFiles(
    drive,
    channelData.fileId,
    channelData.lastNotification
  );
  functions.logger.info(`${files.length} files found`);
  await batchWriteFileDocuments(files, uid);
  if (process.env.ENVIRONMENT === "production") {
    await updateChannelLastNotification(channelId);
  }
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
