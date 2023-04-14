const functions = require("firebase-functions");
const { google } = require("googleapis");
const { defineString } = require("firebase-functions/params");
const cors = require("cors");
const corsHandler = cors({ origin: true });
const { getUser, updateTokens } = require("../firestore/users");
const { getChannelDoc } = require("../firestore/channels");


const clientId = defineString("GOOGLE_CLIENT_ID");
const clientSecret = defineString("GOOGLE_CLIENT_SECRET");
const redirectUri = defineString("OAUTH2_REDIRECT_URI");

// Replace these with your own client ID, client secret, and redirect URL from the Google API Console
// const YOUR_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const YOUR_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const YOUR_REDIRECT_URL =
//   "http://127.0.0.1:5001/website-f126b/us-central1/oauth2callback";

/**
 * Firebase Cloud Function to generate an authorization URL for Google API access.
 * @param {Object} req - The request object from the client.
 * @param {Object} res - The response object to be sent to the client.
 */
exports.generateAuthUrl = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {

    functions.logger.info("Client id: ", clientId.value());
    functions.logger.info("Client secret: ", clientSecret.value());
    functions.logger.info("Redirect uri: ", redirectUri.value());

    // Check if the request method is POST
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    // Get the UID and scopes from the request body
    const { uid, scopes } = req.body;
    if (!uid || !scopes) {
      res
        .status(400)
        .send("Bad Request: Missing UID or scopes in request body");
      return;
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId.value(),
      clientSecret.value(),
      redirectUri.value() 
    );

    // Generate the authorization URL with the passed scopes and state (in this case, the UID)
    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state: uid,
      include_granted_scopes: true,
    });

    // Send the authorization URL in the response
    res.status(200).send({ authorizationUrl });
  });
});

// Callback function to handle the OAuth 2.0 server response
exports.oauth2callback = functions.https.onRequest(async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }


  const oauth2Client = new google.auth.OAuth2(
    clientId.value(),
    clientSecret.value(),
    redirectUri.value()
  );

  const code = req.query.code;
  const uid = req.query.state;

  if (!code || !uid) {
    res
      .status(400)
      .send("Bad Request: Missing code or UID in query parameters");
    return;
  }

  try {
    // Exchange the authorization code for access and refresh tokens
    const { tokens } = await oauth2Client.getToken(code);

    functions.logger.info("Tokens: ", tokens);

    // Store the tokens in the Firestore document for the user
    await updateTokens(uid, tokens);

    functions.logger.info("Tokens stored successfully");

    // Read the user doc by uid
    const userDocRef = await getUser(uid);

    const channelDocRef = await getChannelDoc("s0ng1YkzlewvUZcsPsmF");

    functions.logger.info("Channel doc data: ", channelDocRef.data());


    // Log the user doc
    functions.logger.info("User doc: ", userDocRef.data());

    // res.status(200).send("Tokens stored successfully");
    res.redirect("http://localhost:3000");
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Error exchanging code for tokens");
  }
});
