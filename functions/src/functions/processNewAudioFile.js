const functions = require("firebase-functions");
const { uploadMedia, getDownloadUrl } = require("../storage");
const { updateMedia, getUserTokens } = require("../firestore");
const { getDriveApiClient, downloadFile } = require("../utils/drive");
const { moveMoovAtomToStart } = require("../utils/audio");

// Main cloud function trigger
module.exports = functions.firestore
  .document("media/{mediaId}")
  .onCreate(async (snapshot, context) => {
    const { type } = snapshot.data();
    if (type === 'audio') {
      await processAudioFile(snapshot, context);
    }
    // You can add more media processing conditions here
  });

// Audio file processing
async function processAudioFile(snapshot, context) {
  const { mediaId } = context.params;
  const { googleDriveId, userId } = snapshot.data();

  functions.logger.debug("Processing new audio file", {
    userId,
    mediaId,
    googleDriveId,
  });

  const tokens = await getUserTokens(userId);
  const drive = await getDriveApiClient(tokens);
  const audioBytes = await downloadFile(drive, googleDriveId);

  const optimizedAudioBytes = await moveMoovAtomToStart(audioBytes);
  const storageRef = await uploadMedia(userId, mediaId, optimizedAudioBytes, 'audio');

  const storageUrl = await getDownloadUrl(storageRef);
  const [signedUrl] = await storageRef.getSignedUrl({
    action: "read",
    expires: "03-09-2491",
  });

  await updateMedia(mediaId, {
    fileBucket: storageRef.bucket.name,
    filePath: storageRef.name,
    storageUrl,
    signedUrl
  });
}
