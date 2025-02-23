// firebaseconfig.js 

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZBVEdnLI83-Rbe1mquehYigoDgvXqZuU",
  authDomain: "minutes-prints-local.firebaseapp.com",
  projectId: "minutes-prints-local",
  storageBucket: "minutes-prints-local.firebasestorage.app",
  messagingSenderId: "349577346688",
  appId: "1:349577346688:web:c6ff2a2b2b5d35015db065",
  measurementId: "G-P7P40SMF6N"
};

// Ensure Firebase only runs on the client
let app;
let auth;

if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { app, auth };
