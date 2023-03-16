const admin = require("firebase-admin");

async function getChannelData(channelId) {
  const db = admin.firestore();
  const channelDoc = await db.collection("channels").doc(channelId).get();
  return channelDoc.data();
}

module.exports = getChannelData;
