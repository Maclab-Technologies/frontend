// firebaseconfig.js 

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZBVEdnLI83-Rbe1mquehYigoDgvXqZuU",
  authDomain: "minutes-prints-local.firebaseapp.com",
  projectId: "minutes-prints-local",
  storageBucket: "minutes-prints-local.firebasestorage.app",
  messagingSenderId: "349577346688",
  appId: "1:349577346688:web:c6ff2a2b2b5d35015db065",
  measurementId: "G-P7P40SMF6N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
