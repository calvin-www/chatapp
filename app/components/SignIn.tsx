'use client'
import React from 'react';
import { Button } from "@nextui-org/react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '@/app/utils/firebase';

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Handle successful sign-in
        console.log("User signed in:", result.user);
      }).catch((error) => {
        // Handle errors
        console.error("Error during sign-in:", error);
      });
  };

  return (
    <Button onClick={signInWithGoogle}>
      Sign in with Google
    </Button>
  );
};

export default SignIn;