// src/components/SignIn/SignIn.js
import React, { useContext } from 'react';
import { signIn } from '../../auth/auth';
import { AuthContext } from '../../auth/auth';

const SignIn = () => {
  const { user } = useContext(AuthContext);

  const signInWithGoogle = async () => {
    if (!user) {
      try {
        await signIn();
      } catch (error) {
        console.error('Error signing in with Google:', error);
      }
    }
  };

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};

export default SignIn;
