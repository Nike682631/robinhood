import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Login: React.FC = () => {
  const handleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error during sign in:', error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={handleLogin}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
