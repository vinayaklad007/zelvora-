import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAv7skX2UC3cNBFHlPwUkx0Pg0XeLgvi-c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zelvora-f1972.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zelvora-f1972",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "zelvora-f1972.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "823743105366",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:823743105366:web:eb7d81c7b9c3bbc0982ef7"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
