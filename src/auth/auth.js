import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

// Signs-in Friendly Chat.
async function signIn() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/drive.readonly");
  const userCredential = await signInWithPopup(getAuth(), provider);
  const stsTokenManager = userCredential._tokenResponse;
  const { oauthAccessToken, refreshToken } = stsTokenManager;

  console.log(userCredential);
  console.log("accessToken", oauthAccessToken);
  console.log("refreshToken", refreshToken);

  // Try and get the user document by user.uid
  const userDocRef = doc(db, "users", userCredential.user.uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    if ("accessToken" in docSnap.data()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No accessToken in document data");
      await updateDoc(userDocRef, {
        accessToken: oauthAccessToken,
        refreshToken: refreshToken,
      });
    }
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

// Signs-out of Friendly Chat.
function signOutUser() {
  // Sign out of Firebase.
  signOut(getAuth());
}

// Initialize firebase auth
function initFirebaseAuth() {
  // Listen to auth state changes.
  onAuthStateChanged(getAuth(), authStateObserver);
}

function authStateObserver(user) {
  if (user) {
    console.log("User is signed in!");
  } else {
    // User is signed out!
    console.log("User is signed out!");
  }
}

export { signIn, initFirebaseAuth, signOutUser };
