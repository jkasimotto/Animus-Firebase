// functions-config.js

const functions = require("firebase-functions");

const devConfig = require("./development/firebase-config-dev");
const prodConfig = require("./production/firebase-config-prod");

const isProduction = process.env.NODE_ENV === "production";
const config = isProduction ? prodConfig : devConfig;

functions.logger.info("Is production:", isProduction);
functions.logger.info("NODE_ENV:", process.env.NODE_ENV);

function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error(
      "No Firebase configuration object provided." +
        "\n" +
        "Add your web app's configuration object to firebase-config.js"
    );
  } else {
    return config;
  }
}

module.exports = {
  getFirebaseConfig,
  config,
};
