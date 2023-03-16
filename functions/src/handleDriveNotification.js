// functions/src/handleDriveNotification/index.js

const {
  getUserData,
  getChannelData,
  getDriveApiClient,
  getDriveFiles,
} = require("./utils/drive");

async function handleDriveNotification(req, res) {
  // Call the functions in the correct order
  if (!validateHeaders(req, res)) return;
  logHeadersAndNotification(req);
  const channelId = req.get("X-Goog-Channel-ID");
  const channelData = await getChannelData(channelId);
  const userData = await getUserData(channelData.uid);
  const drive = await getDriveApiClient(userData.refreshToken);
  const files = await getDriveFiles(
    drive,
    channelData.fileId,
    channelData.lastNotification
  );

  // Create file documents in Firestore for each file
  for (const file of files) {
    await db.collection("files").doc(file.id).set({
      fileId: file.id,
      name: file.name,
      mimeType: file.mimeType,
      size: file.size,
      uid: channelData.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      source: "drive",
    });
  }

  res.status(200).send("OK");
}

function validateHeaders(req, res) {
  // Check if the request is a POST request
  if (req.method !== "POST") {
    // Return a 405 Method Not Allowed response
    functions.logger.error("Method not allowed");
    res.status(405).send("Method Not Allowed");
    return;
  }

  // Check if the request has a valid X-Goog-Resource-State header
  const resourceState = req.get("X-Goog-Resource-State");
  if (!resourceState) {
    // Return a 400 Bad Request response
    functions.logger.error("Missing X-Goog-Resource-State header");
    res.status(400).send("Missing X-Goog-Resource-State header");
    return;
  }

  // Check if the request has a valid X-Goog-Channel-ID header
  const channelId = req.get("X-Goog-Channel-ID");
  if (!channelId) {
    // Return a 400 Bad Request response
    functions.logger.error("Missing X-Goog-Channel-ID header");
    res.status(400).send("Missing X-Goog-Channel-ID header");
    return;
  }

  // Check if the request has a valid X-Goog-Message-Number header
  const messageNumber = req.get("X-Goog-Message-Number");
  if (!messageNumber) {
    // Return a 400 Bad Request response
    functions.logger.error("Missing X-Goog-Message-Number header");
    res.status(400).send("Missing X-Goog-Message-Number header");
    return;
  }

  // Check if the request has a valid X-Goog-Resource-ID header
  const resourceId = req.get("X-Goog-Resource-ID");
  if (!resourceId) {
    // Return a 400 Bad Request response
    functions.logger.error("Missing X-Goog-Resource-ID header");
    res.status(400).send("Missing X-Goog-Resource-ID header");
    return;
  }

  // Check if the request has a valid X-Goog-Resource-URI header
  const resourceUri = req.get("X-Goog-Resource-URI");
  if (!resourceUri) {
    // Return a 400 Bad Request response
    functions.logger.error("Missing X-Goog-Resource-URI header");
    res.status(400).send("Missing X-Goog-Resource-URI header");
    return;
  }
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

module.exports = handleDriveNotification;
