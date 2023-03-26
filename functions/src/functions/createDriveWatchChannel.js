const functions = require("firebase-functions");
const { google } = require("googleapis");
const { createChannelDoc, getChannelDoc } = require("../firestore/channels");
const { getUserTokens } = require("../firestore/users");

module.exports = functions.https.onCall(
  async (data, context) => {
    return await createDriveWatchChannel(data, context);
  }
);

async function createDriveWatchChannel(data, user) {
  const { folderId } = data;

  const uid = user.uid;
  const folderDocSnapshot = await getChannelDoc(folderId, uid);
  let channelId;

  if (!folderDocSnapshot.empty) {
    const folderDoc = folderDocSnapshot.docs[0];

    if (folderDoc.data().expiration < Date.now()) {
      await folderDoc.ref.delete();
    } else {
      channelId = folderDoc.data().channelId;
      return channelId;
    }
  }

  const newFolderDoc = await createChannelDoc(folderId, uid);

  const { accessToken, refreshToken } = await getUserTokens(uid);

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const channelData = await createGoogleDriveWatch(
    folderId,
    newFolderDoc.id,
    oAuth2Client
  );

  channelId = channelData.id;
  const resourceId = channelData.resourceId;
  const resourceUri = channelData.resourceUri;
  const expiration = channelData.expiration;

  await newFolderDoc.update({
    channelId,
    resourceId,
    resourceUri,
    expiration,
  });

  return channelId;
}

async function createGoogleDriveWatch(folderId, newFolderDocId, oAuth2Client) {
  const drive = google.drive({ version: "v3", auth: oAuth2Client });
  const request = await drive.files.watch({
    fileId: folderId,
    resource: {
      id: newFolderDocId,
      type: "web_hook",
      address: process.env.WEBHOOK_URL,
    },
  });
  return request.data;
}
