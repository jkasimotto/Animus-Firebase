const admin = require("firebase-admin");

const db = admin.firestore();

const createUser = async (userId, email, displayName) => {
  const createdAt = admin.firestore.FieldValue.serverTimestamp();
  const userRef = db.collection("users").doc(userId);
  await userRef.set({
    userId,
    email,
    displayName,
    createdAt,
    updatedAt: createdAt,
    googleDrive: {
      tokens: null,
      syncedFiles: [],
      lastSynced: null,
    },
  });
  return userRef;
};

const updateUser = async (userId, data) => {
  const updatedAt = admin.firestore.FieldValue.serverTimestamp();
  const userRef = db.collection("users").doc(userId);
  await userRef.update({ ...data, updatedAt });
  return userRef;
};

const getUser = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const userSnapshot = await userRef.get();
  if (!userSnapshot.exists) {
    throw new Error(`User with ID ${userId} not found.`);
  }
  return userSnapshot.data();
};

const getUserTokens = async (userId) => {
  const user = await getUser(userId);
  return user.googleDrive.tokens;
};

const updateGoogleDriveInfo = async (userId, googleDrive) => {
  const updatedAt = admin.firestore.FieldValue.serverTimestamp();
  const userRef = db.collection("users").doc(userId);
  await userRef.update({ googleDrive, updatedAt });
  return userRef;
};

const updateGoogleDriveLastSync = async (userId) => {
  const updatedAt = admin.firestore.FieldValue.serverTimestamp();
  const lastSyncTime = admin.firestore.FieldValue.serverTimestamp();
  const userRef = db.collection("users").doc(userId);
  await userRef.update({ "googleDrive.lastSynced": lastSyncTime, updatedAt });
  return userRef;
};

const createGoogleDriveTokens = async (userId, tokens) => {
  const updatedAt = admin.firestore.FieldValue.serverTimestamp();
  const userRef = db.collection("users").doc(userId);
  await userRef.update({
    "googleDrive.tokens": tokens,
    updatedAt
  });
  return userRef;
};

const createMedia = async (userId, data) => {
  const createdAt = admin.firestore.FieldValue.serverTimestamp();
  const mediaRef = db.collection("media").doc();
  await mediaRef.set({
    ...data,
    mediaId: mediaRef.id,
    userId,
    createdAt,
    updatedAt: createdAt,
  });
  return mediaRef;
};

const updateMedia = async (mediaId, data) => {
  const updatedAt = admin.firestore.FieldValue.serverTimestamp();
  const mediaRef = db.collection("media").doc(mediaId);
  await mediaRef.update({ ...data, updatedAt });
  return mediaRef;
};


module.exports = {
  createUser,
  updateUser,
  getUser,
  getUserTokens,
  updateGoogleDriveInfo,
  updateGoogleDriveLastSync,
  createGoogleDriveTokens,
  createMedia,
  updateMedia
};
