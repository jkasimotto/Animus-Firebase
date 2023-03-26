const functions = require("firebase-functions");
const { getChannelsCollection } = require("./collections");

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

module.exports = {
  createChannelDoc,
  getChannelDoc,
};
