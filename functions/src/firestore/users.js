const admin = require("firebase-admin");

async function getUserDoc(uid) {
  const userData = await admin
    .firestore()
    .collection("users")
    .doc(uid)
    .get();
  return userData;
}

async function getUserTokens(uid) {
  const userDoc = await admin.firestore().collection("users").doc(uid).get();
  const accessToken = userDoc.data().accessToken;
  const refreshToken = userDoc.data().refreshToken;
  return { accessToken, refreshToken };
}

module.exports = {
  getUserDoc,
  getUserTokens,
};
