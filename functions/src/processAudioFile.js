const admin = require("firebase-admin");
const functions = require("firebase-functions");
const config = require("./config");
const { uploadAudioToStorage } = require("./utils/storage/");
const { downloadDriveFile } = require("./utils/drive");
const { moveMoovAtomToStart } = require("./utils/audio");

async function processAudioFile(fileData, drive) {
  try {
    // Download the audio file from Google Drive
    const buffer = await downloadDriveFile(drive, fileData.fileId);

    // Move moov atom to start in buffer
    const audioBytes = await moveMoovAtomToStart(buffer);

    // If audioBytes is null, return an error
    if (!audioBytes) {
      throw new Error("Could not move moov atom to start");
    }

    // Upload the file to storage and get the public URL
    const storageRef = await uploadAudioToStorage(audioBytes);
    const publicUrl = await storageRef.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    });

    // Update the file document in the database
    const db = admin.firestore();
    await db.collection("files").doc(fileData.fileId).set({
      publicUrl: publicUrl[0],
      fileBucket: storageRef.bucket.name,
      filePath: storageRef.name,
      fileType: config.fileTypes.AUDIO,
    });

    return true;
  } catch (error) {
    functions.logger.error("Error processing file: ", error);
    return false;
  }
}

exports.processFile = functions.firestore
  .document("files/{fileId}")
  .onCreate(async (snap, context) => {
    const fileData = snap.data();
    const userData = await getUserData(fileData.uid);
    const drive = await getDriveApiClient(userData.refreshToken);

    // Call the processAudioFile function
    const result = await processAudioFile(fileData, userData, drive);

    if (!result) {
      // Update the file document in the database with an error message
      await snap.ref.update({ error: "Error processing file" });
    }
  });
