const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { google } = require("googleapis");
const serviceAccount = require("./serviceAccountKey.json");
const crypto = require("crypto");
const os = require("os");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const handleDriveNotification = require("./handleDriveNotification");
const processFile = require("./processFile");

exports.handleDriveNotification = functions.https.onRequest(
  handleDriveNotification
);
exports.processFile = functions.firestore
  .document("files/{fileId}")
  .onCreate(async (snapshot, context) => {
    const fileData = snapshot.data();
    const uid = fileData.uid;
    const fileId = fileData.fileId;

    await processFile(uid, fileId);
  });

// require("dotenv").config({ path: ".env" });

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "website-f126b.appspot.com",
});

const clientId =
  "476897576252-q24tmv66p2l73r4qdhugk6t7r0lrls9s.apps.googleusercontent.com";
const clientSecret = "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";
// const redirectUri = "http://localhost:3000";
const redirectUri =
  "http://127.0.0.1:5001/website-f126b/us-central1/handleAuthenticationCode";

exports.createUserDocument = functions.auth.user().onCreate((user) => {
  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the user.
  functions.logger.info(user);
  const createdAt = admin.firestore.FieldValue.serverTimestamp();

  const db = admin.firestore();
  return db.collection("users").doc(user.uid).set({
    email,
    name: displayName,
    createdAt,
  });
});

// Define a HTTP function that handles Google Drive push notifications
exports.handleDriveNotification = functions.https.onRequest(
  async (req, res) => {
    // Get all drive files in the Google Drive folder
    // These are paginated, so we need to loop through all pages
    let nextPageToken = null;
    let files = [];
    do {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and createdTime > '${lastNotification}' and trashed = false`,
        fields: "nextPageToken, files(id, name, mimeType, size)",
        pageToken: nextPageToken,
      });
      files = files.concat(response.data.files);
      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    functions.logger.info(`Found ${files.length} files`);

    // Update the last notification timestamp
    await channelDoc.ref.update({
      lastNotification: admin.firestore.Timestamp.now(),
    });

    // We create a document for each file in the database
    files.forEach(async (file) => {
      // Create a document in the files collection
      const fileDoc = await db.collection("files").doc(file.id).set({
        fileId: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        uid: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      functions.logger.info(`Created file document for ${file.name}`);

      // Log the file type
      functions.logger.info(`File Type: ${file.mimeType}`);

      // Download the audio file from google drive
      const buffer = await downloadAudioFile(drive, file.id);

      // Log info about the file
      functions.logger.info(`Downloaded file ${file.name}`);
      functions.logger.info(`Buffer size: ${buffer.length}`);

      // Move moov atom to start in buffer
      const audioBytes = await moveMoovAtomToStart(buffer);
      // If audioBytes is null continue to next file
      if (!audioBytes) {
        functions.logger.error("Could not move moov atom to start");
        return;
      }
      functions.logger.info(`Moved moov atom to start of ${file.name}`);
      functions.logger.info(`AudioBytes size: ${audioBytes.length}`);

      // Upload the file to storage
      // TODO: Remove hardcoded path
      const filepath = `user/${uid}/audio/${file.id}`;
      const bucket = storage.bucket();
      const storageRef = bucket.file(filepath);
      await storageRef.save(audioBytes, {
        metadata: {
          contentType: "audio/m4a",
        },
      });
      functions.logger.info(`Uploaded file ${file.name} to ${filepath}`);

      // Get the public url of the file
      const publicUrl = await storageRef.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });

      // Create an audio document in the database
      const audioDoc = await db.collection("audio").doc(file.id).set({
        fileId: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size,
        uid: uid,
        publicUrl: publicUrl[0],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        fileBucket: bucket.name,
        filePath: filepath,
      });
      functions.logger.info(`Created audio document for ${file.name}`);
    });

    // The resourceId is the id of a folder in Google Drive.

    // Return a 200 OK response
    res.status(200).send("OK");
  }
);

exports.listDriveFiles = functions.https.onRequest(async (req, res) => {
  const clientId =
    "476897576252-q24tmv66p2l73r4qdhugk6t7r0lrls9s.apps.googleusercontent.com";
  const clientSecret = "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";

  // Get uid from body
  const uid = req.body.uid;

  functions.logger.info(uid);

  // Get user document by uid
  const userDoc = await admin.firestore().collection("users").doc(uid).get();

  // Get access token from user document
  const accessToken = userDoc.data().accessToken;

  // Get refresh token from user document
  const refreshToken = userDoc.data().refreshToken;

  const folderId = "1J8r0GceHAu8CLhCm-bNfOtk2X0k7iM6k";

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  drive = google.drive({ version: "v3", auth: oAuth2Client });
  file = await drive.files.get({
    fileId: folderId,
  });
  filesRes = await drive.files.list({
    q: `'${folderId}' in parents`,
    pageSize: 10,
  });
  files = filesRes.data.files;
  res.status(200).send(files);
});

exports.watchDriveFolder = functions.https.onCall(async (data, context) => {
  const { folderId } = data;

  // Get firestore channels collection
  const channelsCollection = admin.firestore().collection("channels");

  // In channels collection get the folder id document
  const folderDoc = await channelsCollection
    .where("fileId", "==", folderId)
    .get();

  // If the folder id document exists
  if (folderDoc.exists) {
    functions.logger.info("Channel Exists");
    // Check if it's expiration date is greater than the current date
    if (folderDoc.data().expiration < Date.now()) {
      // If expired, we will delete the document and create a new one
      functions.logger.info("Channel Expired");
      await folderDoc.ref.delete();
    } else {
      // If not expired, we will return the channel id
      functions.logger.info("Channel Not Expired");
      return folderDoc.data().channelId;
    }
  }

  // Get uid from context
  const uid = context.auth.uid;

  // Create a new document in channels collection
  const newFolderDoc = await channelsCollection.add({
    fileId: folderId,
    uid: uid,
    expirationDate: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    lastNotification: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Get user document by uid
  const userDoc = await admin.firestore().collection("users").doc(uid).get();

  // Get access token from user document
  const accessToken = userDoc.data().accessToken;

  // Get refresh token from user document
  const refreshToken = userDoc.data().refreshToken;

  // Get client id and secret
  // TODO: Remove hard coded values
  const clientId =
    "476897576252-q24tmv66p2l73r4qdhugk6t7r0lrls9s.apps.googleusercontent.com";
  const clientSecret = "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";

  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oAuth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  drive = google.drive({ version: "v3", auth: oAuth2Client });

  const request = await drive.files.watch({
    fileId: folderId,
    resource: {
      id: newFolderDoc.id,
      type: "web_hook",
      address:
        // TODO: Remove hard coded URL
        "https://us-central1-website-f126b.cloudfunctions.net/handleDriveNotification",
    },
  });

  // Get the channel id
  const channelId = request.data.id;

  // Get the resource id
  const resourceId = request.data.resourceId;

  // Get the resource uri
  const resourceUri = request.data.resourceUri;

  // Get the expiration
  const expiration = request.data.expiration;

  // Update the document with the channel id
  await newFolderDoc.update({
    channelId,
    resourceId,
    resourceUri,
    expiration,
  });

  return newFolderDoc.data;
});

exports.authenticate = functions.https.onRequest(async (req, res) => {
  // Get the uid from the query string
  const uid = req.query.uid;

  functions.logger.info("Query string: ", req.query);

  // OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  // Generate a unique state for the user to prevent CSRF
  const state = crypto.randomBytes(20).toString("hex");

  functions.logger.info("UID before redirect: ", uid);

  // Store nonce in Firestore
  await admin.firestore().collection("sessions").doc(state).set({ uid });

  functions.logger.info("State before redirect: ", state);

  const scopes = ["https://www.googleapis.com/auth/drive.readonly"];

  // Get the url that will be used for the consent dialog.
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
    state,
  });

  // res.writeHead(301, { Location: authorizeUrl });
  res.redirect(authorizeUrl);
});

exports.handleAuthenticationCode = functions.https.onRequest(
  async (req, res) => {
    // Get the code from the query string
    const code = req.query.code;

    // Get the state from the query string
    const state = req.query.state;
    functions.logger.info("State after redirect: ", state);

    // Get the session document
    const sessionDoc = await admin
      .firestore()
      .collection("sessions")
      .doc(state)
      .get();

    // Get the uid from the session document
    const uid = sessionDoc.data().uid;

    // Get the user document
    const userDoc = await admin.firestore().collection("users").doc(uid).get();

    // OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    oAuth2Client.on("tokens", (tokens) => {
      if (tokens.refresh_token) {
        // store the refresh_token in my database!
        functions.logger.info("Refresh token: ", tokens.refresh_token);
        userDoc.ref.update({
          refreshToken: tokens.refresh_token,
        });
      }
      functions.logger.info("Access token: ", tokens.access_token);
      userDoc.ref.update({
        accessToken: tokens.access_token,
      });
    });

    // Get the tokens
    const { tokens } = await oAuth2Client.getToken(code);

    // Redirect to the home page
    res.redirect("http://localhost:3000");
  }
);

exports.transcribeAudio = functions
  .runWith({ secrets: ["OPENAI_API_KEY"] })
  .storage.object()
  .onFinalize(async (object) => {
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const fileName = path.basename(filePath); // File name.
    const fileDir = path.dirname(filePath); // File directory.
    const bucket = admin.storage().bucket(fileBucket); // Get the bucket

    // Check if the file is an audio file
    if (!contentType.startsWith("audio/")) {
      functions.logger.info("This is not an audio file.");
      return null;
    }

    // Check if the file is in the correct directory
    // if (!fileDir.startsWith("audio")) {
    //   functions.logger.info("This file is not in the correct directory. " + fileDir);
    //   return null;
    // }

    // Check if test.m4a
    if (
      fileName === "test.m4a" ||
      fileName === "test.mp4" ||
      fileName === "test.mp3"
    ) {
      functions.logger.info("This is a test file.");
      return null;
    }

    functions.logger.info("Content type: ", contentType);

    // Get the file
    const file = bucket.file(filePath);

    // Get the file metadata
    const metadata = await file.getMetadata();

    // Update the content type to be audio/mp4
    // await file.setMetadata({
    //   contentType: "audio/mp4",
    // });

    // Log the file content type
    functions.logger.info("File content type: ", metadata[0].contentType);

    // Download the file
    const tempFilePath = path.join(os.tmpdir(), fileName);
    await file.download({ destination: tempFilePath });
    functions.logger.info("Audio downloaded locally to ", tempFilePath);

    // Get the bytes
    const bytes = await file.download();
    functions.logger.info("Audio downloaded as bytes: ");

    const transcription = await whisperTranscribe(
      bytes[0],
      process.env.OPENAI_API_KEY
    );
    functions.logger.info("Transcription: ", transcription);

    // Get the audio document with the same filePath
    const audioDoc = await admin
      .firestore()
      .collection("audio")
      .where("filePath", "==", filePath)
      .get();

    // Check if the audio document exists
    if (audioDoc.empty) {
      functions.logger.info("Audio document does not exist.");
      return null;
    }

    // Check there is only one audio document
    if (audioDoc.size > 1) {
      functions.logger.info("There is more than one audio document.");
      return null;
    }

    // Update the audio document with the transcription
    audioDoc.forEach((doc) => {
      doc.ref.update({
        transcription,
      });
    });
  });

async function moveMoovAtomToStart(audioBytes) {
  const endpointUrl = process.env.AUDIO_CONVERSION_ENDPOINT_URL;
  const headers = {
    "file-extension": "m4a",
    "Content-Type": "application/octet-stream",
  };

  try {
    const response = await axios.post(endpointUrl, audioBytes, {
      headers,
      responseType: "arraybuffer",
      timeout: 60000, // 60 seconds
    });
    functions.logger.info("Moved moov atom to start");
    // Log the response data
    functions.logger.info("Response data: ", response.data);
    return response.data;
  } catch (error) {
    functions.logger.error("Error: ", error);
    return null;
  }
}
async function downloadAudioFile(drive, fileId) {
  const res = await drive.files.get(
    {
      fileId,
      alt: "media",
    },
    {
      responseType: "stream",
    }
  );

  const chunks = [];
  return new Promise((resolve, reject) => {
    res.data.on("error", reject);
    res.data.on("data", (chunk) => chunks.push(chunk));
    res.data.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });
  });
}

async function whisperTranscribe(audioBytes, openaiApiKey) {
  // Create a temporary file
  const tempFilePath = path.join(os.tmpdir(), "test.m4a");
  functions.logger.info("Temp file path: ", tempFilePath);

  // Write the audio bytes to the temp file
  fs.writeFileSync(tempFilePath, audioBytes);
  functions.logger.info("Audio bytes written to temp file");

  // Construct the form data
  const formData = new FormData();
  formData.append("model", "whisper-1");
  formData.append("file", fs.createReadStream(tempFilePath));
  functions.logger.info("Form data: ", formData);

  // If openaiApiKey is null, get the openai api key from the env
  if (openaiApiKey === null) {
    functions.logger.info(
      "openai api key not passed to whisperTranscribe. Attepmting to get openai api key from env"
    );
    openaiApiKey = process.env.OPENAI_API_KEY;
  }

  // Call the whisper API
  return Promise.resolve(
    axios
      .post("https://api.openai.com/v1/audio/transcriptions", formData, {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "multipart/form-data",
          ...formData.getHeaders(),
        },
      })
      .then((response) => {
        functions.logger.info("Response: ", response.data.text);

        // Check if temp file exists
        if (fs.existsSync(tempFilePath)) {
          // Delete the temp file
          fs.unlinkSync(tempFilePath);
        }
        return response.data.text;
      })
      .catch((error) => {
        functions.logger.error("Error: ", error);
        // Check if temp file exists
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      })
  );
}
