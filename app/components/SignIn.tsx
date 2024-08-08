'use client'
import React, { useRef, useEffect } from 'react';
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

  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (backgroundRef.current) {
        const { clientX, clientY } = event;
        const { width, height } = backgroundRef.current.getBoundingClientRect();
        const centerX = width / 2;
        const centerY = height / 2;
        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;
        const angle = Math.atan2(distanceY, distanceX);
        const radius = Math.sqrt(distanceX ** 2 + distanceY ** 2);
        const gradientAngle = (angle + Math.PI) * 180 / Math.PI;

        backgroundRef.current.style.background = `radial-gradient(circle at ${clientX}px ${clientY}px, #0e1016, #040506)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

    return (
      <div ref={backgroundRef}
           style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div className="text-center">
          <h1 className="text-9xl mb-3 font-bold bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text">Welcome!</h1>
          <p className="text-3xl mb-6">Please sign in to start chatting.</p>
          <Button 
              onClick={signInWithGoogle}
              size="lg"
              className="transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r from-blue-400 to-cyan-500"
          >
            Sign in with Google
          </Button>
        </div>
      </div>
    );
};

export default SignIn;