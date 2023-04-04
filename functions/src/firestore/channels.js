const admin = require("firebase-admin");
const { getChannelsCollection } = require("./collections");
const db = admin.firestore();

async function createChannelDoc(folderId, uid) {
  const userChannelsCollection = getChannelsCollection(uid);
  const newFolderDoc = await userChannelsCollection.add({
    fileId: folderId,
    expirationDate: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    lastNotification: admin.firestore.FieldValue.serverTimestamp(), // Now
  });
  return newFolderDoc;
}

async function getChannelDoc(channelId) {
  // There should only be one document per folder
  const userChannelsCollection = getChannelsCollection();
  return userChannelsCollection.doc(channelId).get();
}

async function getChannelDocByUserId(uid) {
  const channelSnapshot = await db
    .collection("channels")
    .where("uid", "==", uid)
    .limit(1)
    .get();

  if (channelSnapshot.empty) {
    throw new Error(`No channel found for user ${uid}`);
  }

  return channelSnapshot.docs[0];
}

module.exports = {
  createChannelDoc,
  getChannelDoc,
  getChannelDocByUserId,
};
