const functions = require("firebase-functions");
const { google } = require("googleapis");
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const { TokenInvalidError } = require('../../errors/TokenInvalidError');

async function getDriveApiClient(tokens) {
  functions.logger.info("Tokens:", tokens);
  const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oAuth2Client.setCredentials(tokens);

  try {
    return google.drive({
      version: "v3",
      auth: oAuth2Client,
    });
  } catch (error) {
    if (error.message === 'invalid_token') {
      throw new TokenInvalidError('Token is invalid');
    } else {
      throw error;
    }
  }
}

module.exports = getDriveApiClient;
