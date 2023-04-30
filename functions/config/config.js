const functions = require("firebase-functions");
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "production"
        ? "./production/.env.production" 
        : "./development/.env.development"
)

if (fs.existsSync(envPath)) {
    require("dotenv").config({ path: envPath });
}

const admin = require("firebase-admin");

const loadConfig = () => {
  if (process.env.NODE_ENV === "production") {
    functions.logger.info("Running in production environment.");
    const serviceAccount = require("./production/serviceAccountKey.json");
    return {
      credential:admin.credential.cert(serviceAccount),
      storageBucket: "gs://website-f126b.appspot.com",
    };
  } else {
    functions.logger.info("Running in development environment.");
    const devServiceAccount = require("./development/serviceAccountKey.json");
    return {
      credential: admin.credential.cert(devServiceAccount),
      storageBucket: "animus-development.appspot.com",
    };
  }
};

module.exports = loadConfig();
