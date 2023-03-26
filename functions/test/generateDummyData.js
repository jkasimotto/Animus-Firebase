// generateDummyData.js

const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "website-f126b.appspot.com",
});

const db = admin.firestore();

// Function to generate and add dummy data to Firestore
async function generateFirestoreDummyData() {
  const users = [
    {
      uid: "zD7Ar5AzePcKxsEm9F0caemTCUh1",
      name: "John Doe",
      refreshToken:
        "1//0gwqe8jBDrnwyCgYIARAAGBASNwF-L9IrTtXJRBf87P5d4GsTgaNVHahwuDQhEBBiDbpmIqw1Fd2Bx_egtwrqGQIARgeQCPIZxHs",
    },
  ];

  const channels = [
    {
      channelId: "s0ng1YkzlewvUZcsPsmF",
      expiration: "1678421415000",
      expirationDate: "1679022612621",
      fileId: "1J8r0GceHAu8CLhCm-bNfOtk2X0k7iM6k",
      lastNotification: admin.firestore.FieldValue.serverTimestamp(),
      uid: "zD7Ar5AzePcKxsEm9F0caemTCUh1",
    },
  ];

  const batch = db.batch();
  users.forEach((user) => {
    const userRef = db.collection("users").doc(user.uid);
    batch.set(userRef, user);
  });
  channels.forEach((channel) => {
    const channelRef = db.collection("channels").doc(channel.channelId);
    batch.set(channelRef, channel);
  });

  await batch.commit();
  console.log("Dummy Firestore data added.");
}

// Function to generate and add dummy data to Storage
async function generateStorageDummyData() {
  // Add your logic to generate and save dummy data to Storage
  // For example, you can use the 'fs' and 'path' modules to read and upload files
}

(async () => {
  await generateFirestoreDummyData();
  process.exit(0);
})();
