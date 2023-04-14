// import required libraries
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useState, useEffect } from "react";

// create authentication context
export const AuthContext = createContext();

// create an authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Setting up authentication listener.");
    const unsubscribe = onAuthStateChanged(getAuth(), setUser);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

// initialize firebase authentication and listen for state changes
function initFirebaseAuth() {
  onAuthStateChanged(getAuth(), authStateObserver);
}

// observer function for authentication state
function authStateObserver(user) {
  if (user) {
    console.log("User is signed in!");
  } else {
    console.log("User is signed out!");
  }
}

// sign in user using Google as identity provider
async function signIn() {
  const userCredential = await signInWithGoogle();
}

// sign in user using GoogleAuthProvider
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(getAuth(), provider);
}

// sign out user
function signOutUser() {
  signOut(getAuth());
}

// export functions
export { signIn, initFirebaseAuth, signOutUser };
