const admin = require("firebase-admin");

async function updateChannelLastNotification(channelId) {
  const channelRef = admin.firestore().collection("channels").doc(channelId);
  await channelRef.update({
    lastNotification: admin.firestore.FieldValue.serverTimestamp(),
  });
}

module.exports = updateChannelLastNotification;
