import { db, storage } from "./firebase";
import {
  collection,
 
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const portfolioRef = collection(db, "portfolios");

// Upload image to Firebase Storage and return URL
export const uploadImage = async (file, userId, folder = "portfolioImages") => {
  if (!file) return "";
  const fileRef = ref(storage, `${folder}/${userId}-${Date.now()}-${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

export const addPortfolio = async (portfolioData) => {
  try {
    const { userId } = portfolioData;
    if (!userId) {
      throw new Error('User ID is required');
    }

    const cleanedData = { ...portfolioData };
    delete cleanedData.imageFile;

    // Use setDoc instead of addDoc to set document ID explicitly
    await setDoc(doc(db, "portfolios", userId), {
      ...cleanedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return userId;
  } catch (error) {
    throw new Error("Error adding portfolio: " + error.message);
  }
};

// Get portfolio by ID
export const getPortfolio = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, "portfolios", id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    throw new Error(`Error getting portfolio: ${error.message}`);
  }
};

// Get all portfolios
export const getAllPortfolios = async () => {
  try {
    const snapshot = await getDocs(portfolioRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Error getting all portfolios: ${error.message}`);
  }
};

// Update portfolio by ID
export const updatePortfolio = async (id, updatedData) => {
  try {
    await updateDoc(doc(db, "portfolios", id), {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    throw new Error(`Error updating portfolio: ${error.message}`);
  }
};

// Delete portfolio by ID
export const deletePortfolio = async (id) => {
  try {
    await deleteDoc(doc(db, "portfolios", id));
    return true;
  } catch (error) {
    throw new Error(`Error deleting portfolio: ${error.message}`);
  }
};
