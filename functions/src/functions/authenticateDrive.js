// exports.watchDriveFolder = functions.https.onCall(async (data, context) => {
//   const { folderId } = data;

//   // Get firestore channels collection
//   const channelsCollection = admin.firestore().collection("channels");

//   // In channels collection get the folder id document
//   const folderDoc = await channelsCollection
//     .where("fileId", "==", folderId)
//     .get();

//   // If the folder id document exists
//   if (folderDoc.exists) {
//     functions.logger.info("Channel Exists");
//     // Check if it's expiration date is greater than the current date
//     if (folderDoc.data().expiration < Date.now()) {
//       // If expired, we will delete the document and create a new one
//       functions.logger.info("Channel Expired");
//       await folderDoc.ref.delete();
//     } else {
//       // If not expired, we will return the channel id
//       functions.logger.info("Channel Not Expired");
//       return folderDoc.data().channelId;
//     }
//   }

//   // Get uid from context
//   const uid = context.auth.uid;

//   // Create a new document in channels collection
//   const newFolderDoc = await channelsCollection.add({
//     fileId: folderId,
//     uid: uid,
//     expirationDate: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
//     lastNotification: admin.firestore.FieldValue.serverTimestamp(),
//   });

//   // Get user document by uid
//   const userDoc = await admin.firestore().collection("users").doc(uid).get();

//   // Get access token from user document
//   const accessToken = userDoc.data().accessToken;

//   // Get refresh token from user document
//   const refreshToken = userDoc.data().refreshToken;

//   // Get client id and secret
//   // TODO: Remove hard coded values
//   const clientId =
//     "476897576252-q24tmv66p2l73r4qdhugk6t7r0lrls9s.apps.googleusercontent.com";
//   const clientSecret = "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";

//   const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
//   oAuth2Client.setCredentials({
//     access_token: accessToken,
//     refresh_token: refreshToken,
//   });

//   drive = google.drive({ version: "v3", auth: oAuth2Client });

//   const request = await drive.files.watch({
//     fileId: folderId,
//     resource: {
//       id: newFolderDoc.id,
//       type: "web_hook",
//       address:
//         // TODO: Remove hard coded URL
//         "https://us-central1-website-f126b.cloudfunctions.net/handleDriveNotification",
//     },
//   });

//   // Get the channel id
//   const channelId = request.data.id;

//   // Get the resource id
//   const resourceId = request.data.resourceId;

//   // Get the resource uri
//   const resourceUri = request.data.resourceUri;

//   // Get the expiration
//   const expiration = request.data.expiration;

//   // Update the document with the channel id
//   await newFolderDoc.update({
//     channelId,
//     resourceId,
//     resourceUri,
//     expiration,
//   });

//   return newFolderDoc.data;
// });

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
