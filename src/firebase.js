// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Add authentication if needed
import { getAnalytics } from "firebase/analytics";  // For analytics
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // For storage
import { getDatabase } from "firebase/database";  // For Realtime Database if needed

// Your web app's Firebase configuration (from the Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCl7cpvyRSPJipTxJ0NS0Pmr3gHXIEZ558",
  authDomain: "student-portfolio-636c9.firebaseapp.com",
  projectId: "student-portfolio-636c9",
  storageBucket: "student-portfolio-636c9.appspot.com",  // Fix storageBucket URL
  messagingSenderId: "884239880553",
  appId: "1:884239880553:web:35e14ca337cadaf82fedf8",
  measurementId: "G-2P37RS0M2F"
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
