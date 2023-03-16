// Your web app's FirebasOe configuration
const config = {
  apiKey: "AIzaSyB6gRs9P0B-pO12zpupaR81BsewT4kk9LM",
  authDomain: "website-f126b.firebaseapp.com",
  projectId: "website-f126b",
  storageBucket: "website-f126b.appspot.com",
  messagingSenderId: "476897576252",
  appId: "1:476897576252:web:b81a6c0c3a80f30b808a39",
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}
