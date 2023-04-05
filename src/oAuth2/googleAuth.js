const {google} = require('googleapis');
const config = require('./config');

const oauth2Client = new google.auth.OAuth2(
  config.clientId,
  config.clientSecret,
  config.redirectUri
);

module.exports = {
  getAuthUrl: () => {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: config.scope,
    });
  },
  getToken: async (code) => {
    const {tokens} = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
  },
  setCredentials: (tokens) => {
    oauth2Client.setCredentials(tokens);
  },
  getAuthClient: () => {
    return oauth2Client;
  },
};
