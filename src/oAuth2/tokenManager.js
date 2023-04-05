const admin = require("firebase-admin");
const db = admin.firestore();

const saveToken = async (userId, tokens) => {
  const userRef = db.collection("users").doc(userId);
  await userRef.set({ tokens }, { merge: true });
};

const getToken = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const userSnapshot = await userRef.get();
  return userSnapshot.data().tokens;
};

module.exports = {
  saveToken,
  getToken,
};
