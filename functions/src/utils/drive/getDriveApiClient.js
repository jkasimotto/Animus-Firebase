const { google } = require("googleapis");
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

async function getDriveApiClient(refreshToken) {
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oAuth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return google.drive({
    version: "v3",
    auth: oAuth2Client,
  });
}

module.exports = getDriveApiClient;