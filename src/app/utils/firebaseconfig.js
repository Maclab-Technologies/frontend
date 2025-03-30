// firebaseconfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Load environment variables (works with both ES modules and CommonJS)
try {
  if (typeof window === "undefined") {
    // Server-side environment
    const dotenv = await import("dotenv");
    dotenv.config();
  }
} catch (err) {
  console.warn("Dotenv import failed (client-side), using process.env directly");
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAZBVEdnLI83-Rbe1mquehYigoDgvXqZuU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "minutes-prints-local.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "minutes-prints-local",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "minutes-prints-local.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "349577346688",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:349577346688:web:c6ff2a2b2b5d35015db065",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-P7P40SMF6N"
};

// Initialize Firebase (singleton pattern)
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  throw new Error("Failed to initialize Firebase");
}

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Google sign-in configuration
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, storage, googleProvider };