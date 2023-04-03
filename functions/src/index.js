const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "website-f126b.appspot.com",
});

// const createDriveWatchChannel = require("./functions/createDriveWatchChannel");
const onDriveNotification = require("./functions/onDriveNotification");
const onNewFileInFirestore = require("./functions/onNewFileInFirestore");
const onStorageUrlUpdate = require("./functions/onStorageUrlChange");


// exports.createDriveWatchChannel = createDriveWatchChannel;
exports.onDriveNotification = onDriveNotification;
exports.onNewFileInFirestore = onNewFileInFirestore;
exports.onStorageUrlUpdate = onStorageUrlUpdate;