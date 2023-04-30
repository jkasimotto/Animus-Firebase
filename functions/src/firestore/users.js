const admin = require("firebase-admin");


async function getUser(uid) {
  const userData = await admin.firestore().collection("users").doc(uid).get();
  return userData;
}

async function getUserTokens(uid) {
  const userDoc = await admin.firestore().collection("users").doc(uid).get();
  const tokens = userDoc.data().tokens;
  return tokens;
}

async function updateTokens(uid, tokens) {
  const userDoc = admin.firestore().collection("users").doc(uid);
  await userDoc.update({
    tokens: tokens,
  });
  // Log the userDocData
  const userDocData = await userDoc.get();
  console.log("userDocData", userDocData.data());

  // 
}

module.exports = {
  getUser,
  getUserTokens,
  updateTokens,
};
