const { google } = require("googleapis");
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const { getUserTokens } = require("../../firestore/users");

async function getDriveApiClient(uid) {
  const tokens = await getUserTokens(uid);
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oAuth2Client.setCredentials(tokens);

  return google.drive({
    version: "v3",
    auth: oAuth2Client,
  });
}

module.exports = getDriveApiClient;
