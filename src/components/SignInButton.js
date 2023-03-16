import { useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { signOutUser, signIn } from '../auth/auth';
import app from '../firebase';

const SignInButton = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), setUser);
    return unsubscribe;
  }, []);

  const handleSignOut = () => {
    signOutUser()
  };

  if (user) {
    return <button onClick={handleSignOut}>Sign Out</button>;
  } else {
    return <button onClick={signIn}>Sign In</button>;
  }
};

export default SignInButton;
