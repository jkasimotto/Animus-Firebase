const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const createUser = async (userId, email, displayName) => {
  const createdAt = admin.firestore.Timestamp.now();
  const userRef = db.collection("users").doc(userId);
  await userRef.set({
    userId,
    email,
    displayName,
    createdAt,
    updatedAt: createdAt,
  });
  return userRef;
};

const updateUser = async (userId, data) => {
  const updatedAt = admin.firestore.Timestamp.now();
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

const updateGoogleDriveInfo = async (userId, googleDrive) => {
  const updatedAt = admin.firestore.Timestamp.now();
  const userRef = db.collection("users").doc(userId);
  await userRef.update({ googleDrive, updatedAt });
  return userRef;
};

const getGoogleDriveInfo = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const userSnapshot = await userRef.get();
  if (!userSnapshot.exists) {
    throw new Error(`User with ID ${userId} not found.`);
  }
  const userData = userSnapshot.data();
  if (!userData.googleDrive) {
    throw new Error(
      `Google Drive information not available for user ${userId}.`
    );
  }
  return userData.googleDrive;
};

const createAudio = async (userId, data) => {
  const createdAt = admin.firestore.Timestamp.now();
  const audioRef = db.collection("users").doc(userId).collection("audio").doc();
  await audioRef.set({
    ...data,
    audioId: audioRef.id,
    createdAt,
    updatedAt: createdAt,
  });
  return audioRef;
};

const createAudioBatch = async (userId, audioList) => {
  const batch = db.batch();
  const createdAt = admin.firestore.Timestamp.now();

  audioList.forEach((audio) => {
    const audioRef = db
      .collection("users")
      .doc(userId)
      .collection("audio")
      .doc();
    batch.set(audioRef, {
      ...audio,
      audioId: audioRef.id,
      createdAt,
      updatedAt: createdAt,
    });
  });

  await batch.commit();
  return audioList.map((audio, index) => ({
    ...audio,
    audioId: db.collection("users").doc(userId).collection("audio").doc().id,
  }));
};

const updateAudio = async (userId, audioId, data) => {
  const updatedAt = admin.firestore.Timestamp.now();
  const audioRef = db
    .collection("users")
    .doc(userId)
    .collection("audio")
    .doc(audioId);
  await audioRef.update({ ...data, updatedAt });
  return audioRef;
};

const createText = async (userId, data) => {
  const createdAt = admin.firestore.Timestamp.now();
  const textRef = db.collection("users").doc(userId).collection("text").doc();
  await textRef.set({
    ...data,
    textId: textRef.id,
    createdAt,
    updatedAt: createdAt,
  });
  return textRef;
};

const updateText = async (userId, textId, data) => {
  const updatedAt = admin.firestore.Timestamp.now();
  const textRef = db
    .collection("users")
    .doc(userId)
    .collection("text")
    .doc(textId);
  await textRef.update({ ...data, updatedAt });
  return textRef;
};

const createVideo = async (userId, data) => {
  const createdAt = admin.firestore.Timestamp.now();
  const videoRef = db.collection("users").doc(userId).collection("video").doc();
  await videoRef.set({
    ...data,
    videoId: videoRef.id,
    createdAt,
    updatedAt: createdAt,
  });
  return videoRef;
};

const updateVideo = async (userId, videoId, data) => {
  const updatedAt = admin.firestore.Timestamp.now();
  const videoRef = db
    .collection("users")
    .doc(userId)
    .collection("video")
    .doc(videoId);
  await videoRef.update({ ...data, updatedAt });
  return videoRef;
};

module.exports = {
  createUser,
  updateUser,
  getUser,

  updateGoogleDriveInfo,
  getGoogleDriveInfo,

  createAudio,
  createAudioBatch,
  updateAudio,

  createText,
  updateText,

  createVideo,
  updateVideo,
};
