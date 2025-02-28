// firebaseconfig.js 
import dotenv from "dotenv";
require("dotenv").config();


import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// console.log("Loaded Firebase API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: "AIzaSyAZBVEdnLI83-Rbe1mquehYigoDgvXqZuU",
  authDomain: "minutes-prints-local.firebaseapp.com",
  projectId: "minutes-prints-local",
  storageBucket: "minutes-prints-local.firebasestorage.app",
  messagingSenderId: "349577346688",
  appId: "1:349577346688:web:c6ff2a2b2b5d35015db065",
  measurementId: "G-P7P40SMF6N"
};
// console.log("FIREBASE API KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);


// Initialize Firebase only if it's not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth };

