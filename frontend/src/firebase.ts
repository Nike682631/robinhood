import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_firebaseApiKey,
  authDomain: import.meta.env.VITE_firebaseAuthDomain,
  projectId: import.meta.env.VITE_firebaseProjectId,
  storageBucket: import.meta.env.VITE_firebaseStorageBucket,
  messagingSenderId: import.meta.env.VITE_firebaseMessagingSenderId,
  appId: import.meta.env.VITE_firebaseAppId,
  measurementId: import.meta.env.VITE_firebaseMeasurementId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
