const admin = require("firebase-admin");

const db = admin.firestore();

const getFilesCollection = (userId) =>
  db.collection("users").doc(userId).collection("files");

const getChannelsCollection = () =>
  db.collection("channels");

module.exports = {
  getFilesCollection,
  getChannelsCollection,
};
