const admin = require("firebase-admin");

async function getUserData(uid) {
  const db = admin.firestore();
  const userDoc = await db.collection("users").doc(uid).get();
  return userDoc.data();
}

module.exports = getUserData;
