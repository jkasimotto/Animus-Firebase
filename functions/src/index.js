const functions = require("firebase-functions");
const admin = require("firebase-admin");
const config = require("../config/config");

admin.initializeApp(config);

// const createDriveWatchChannel = require("./functions/createDriveWatchChannel");
// const onNewFileInFirestore = require("./functions/onNewFileInFirestore");
const syncDriveFolder = require("./functions/syncDriveFolder");
const {generateAuthUrl, oauth2callback} = require('./functions/googleOAuth');
const processNewAudioFile = require('./functions/processNewAudioFile');
const transcribeAudioFileOnUpload = require('./functions/transcribeAudioFileOnUpload');
const transcribeAudioFileOnRequest = require('./functions/transcribeAudioFileOnRequest');
const generateTitle = require('./functions/generateTitle');
const generateReport = require('./functions/generateReport');

// exports.createDriveWatchChannel = createDriveWatchChannel;
// exports.onNewFileInFirestore = onNewFileInFirestore;
// exports.onStorageUrlUpdate = onStorageUrlUpdate;
exports.syncDriveFolder = syncDriveFolder;
exports.generateAuthUrl = generateAuthUrl;
exports.oauth2callback = oauth2callback;
exports.processNewAudioFile = processNewAudioFile;
exports.transcribeAudioFileOnUpload = transcribeAudioFileOnUpload;
exports.transcribeAudioFileOnRequest = transcribeAudioFileOnRequest;
exports.generateTitle = generateTitle;
exports.generateReport = generateReport;