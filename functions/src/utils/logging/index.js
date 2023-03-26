const functions = require("firebase-functions");

function logMessage(...message) {
  if (process.env.ENVIRONMENT === "local") {
    functions.logger.info(message);
  }
}

module.exports = {
    logMessage,
}