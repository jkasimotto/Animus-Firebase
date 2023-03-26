// Your web app's FirebasOe configuration
config = {
  apiKey: functions.config().animus.api_key,
  authDomain: functions.config().animus.auth_domain,
  projectId: functions.config().animus.project_id,
  storageBucket: functions.config().animus.storage_bucket,
  messagingSenderId: functions.config().animus.messaging_sender_id,
  appId: functions.config().animus.app_id,
};


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
