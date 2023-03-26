
// exports.createUserDocument = functions.auth.user().onCreate((user) => {
//   const email = user.email; // The email of the user.
//   const displayName = user.displayName; // The display name of the user.
//   functions.logger.info(user);
//   const createdAt = admin.firestore.FieldValue.serverTimestamp();

//   const db = admin.firestore();
//   return db.collection("users").doc(user.uid).set({
//     email,
//     name: displayName,
//     createdAt,
//   });
// });