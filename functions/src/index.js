const functions = require("firebase-functions");
const admin = require("firebase-admin");
const config = require("../config/config");

admin.initializeApp(config);

// const createDriveWatchChannel = require("./functions/createDriveWatchChannel");
const onDriveNotification = require("./functions/onDriveNotification");
const onNewFileInFirestore = require("./functions/onNewFileInFirestore");
const onStorageUrlUpdate = require("./functions/onStorageUrlChange");
const syncDriveFolder = require("./functions/syncDriveFolder");
const {generateAuthUrl, oauth2callback} = require('./functions/googleOAuth');


// exports.createDriveWatchChannel = createDriveWatchChannel;
exports.onDriveNotification = onDriveNotification;
exports.onNewFileInFirestore = onNewFileInFirestore;
exports.onStorageUrlUpdate = onStorageUrlUpdate;
exports.syncDriveFolder = syncDriveFolder;
exports.generateAuthUrl = generateAuthUrl;
exports.oauth2callback = oauth2callback;