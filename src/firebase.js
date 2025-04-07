// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Add authentication if needed
import { getAnalytics } from "firebase/analytics";  // For analytics
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // For storage
import { getDatabase } from "firebase/database";  // For Realtime Database if needed

// Your web app's Firebase configuration (from the Firebase console)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);  // Initialize Firebase Storage
const database = getDatabase(app);  // Initialize Firebase Realtime Database

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app); 

export { auth, analytics,db, storage,database };  // Export auth and analytics
