
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  onIdTokenChanged,
  connectAuthEmulator 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  serverTimestamp,
  connectFirestoreEmulator 
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  connectStorageEmulator 
} from "firebase/storage";
import { getAnalytics, logEvent } from "firebase/analytics";

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Connect to emulators if in development mode
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectStorageEmulator(storage, "localhost", 9199);
  console.log("Using Firebase Emulators");
}

// Authentication helpers
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

// Firestore helpers
export const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email, photoURL } = user;
    const createdAt = serverTimestamp();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document: ", error);
      throw error;
    }
  }

  return userRef;
};

// Portfolio CRUD operations
export const getPortfolio = async (userId) => {
  try {
    const docRef = doc(db, "portfolios", userId);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting portfolio: ", error);
    throw error;
  }
};

export const createOrUpdatePortfolio = async (userId, portfolioData) => {
  try {
    const portfolioRef = doc(db, "portfolios", userId);
    
    // Process skills to ensure consistent format (array)
    let processedData = { ...portfolioData };
    if (typeof processedData.skills === 'string') {
      processedData.skills = processedData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);
    }
    
    // Add timestamps
    processedData.updatedAt = serverTimestamp();
    if (!(await getDoc(portfolioRef)).exists()) {
      processedData.createdAt = serverTimestamp();
    }
    
    await setDoc(portfolioRef, processedData, { merge: true });
    return portfolioRef;
  } catch (error) {
    console.error("Error creating/updating portfolio: ", error);
    throw error;
  }
};

export const deletePortfolio = async (userId) => {
  try {
    await deleteDoc(doc(db, "portfolios", userId));
    return true;
  } catch (error) {
    console.error("Error deleting portfolio: ", error);
    throw error;
  }
};

// Storage helpers
export const uploadProfileImage = async (userId, file) => {
  try {
    const storageRef = ref(storage, `profile-images/${userId}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading profile image: ", error);
    throw error;
  }
};

export const uploadProjectImage = async (userId, projectId, file) => {
  try {
    const storageRef = ref(storage, `project-images/${userId}/${projectId}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading project image: ", error);
    throw error;
  }
};

// Analytics
export const logAnalyticsEvent = (eventName, eventParams) => {
  logEvent(analytics, eventName, eventParams);
};

// Auth state observer
export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, db, storage, analytics };