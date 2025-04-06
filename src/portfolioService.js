// // import { db } from "./firebase";
// import { db, storage } from "./firebase";
// import { 
//     collection, 
//     addDoc, 
//     getDoc, 
//     getDocs, 
//     updateDoc, 
//     deleteDoc, 
//     doc 
// } from "firebase/firestore";
// import { 
//   ref, 
//   uploadBytes, 
//   getDownloadURL, 
  
// } from "firebase/storage";


// const portfolioRef = collection(db, "portfolios");

// export const uploadImage = async (file, userId) => {
//     if (!file) return null;
//     const fileRef = ref(storage, `profiles/${userId}/${file.name}`);
//     await uploadBytes(fileRef, file);
//     return getDownloadURL(fileRef);
// };

// export const addPortfolioi = async (data) => {
//   try {
//     let imageUrl = "";
//     if (data.imageFile) {
//       const imageRef = ref(storage, `portfolioImages/${Date.now()}-${data.imageFile.name}`);
//       await uploadBytes(imageRef, data.imageFile);
//       imageUrl = await getDownloadURL(imageRef);
//     }

//     const docRef = await addDoc(collection(db, "portfolios"), {
//       ...data,
//       imageFile: undefined, // remove the File object
//       imageUrl,             // save the URL instead
//       createdAt: Date.now(),
//     });

//     return docRef.id;
//   } catch (error) {
//     throw new Error("Error adding portfolio: " + error.message);
//   }
// };


// export const addPortfolio = async (data) => {
//     try {
//         const docRef = await addDoc(portfolioRef, {
//             ...data,
//             createdAt: new Date().toISOString()
//         });
//         return docRef.id;
//     } catch (error) {
//         throw new Error(`Error adding portfolio: ${error.message}`);
//     }
// };

// export const getPortfolio = async (id) => {
//     try {
//         const docSnap = await getDoc(doc(db, "portfolios", id));
//         return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
//     } catch (error) {
//         throw new Error(`Error getting portfolio: ${error.message}`);
//     }
// };

// export const getAllPortfolios = async () => {
//     try {
//         const snapshot = await getDocs(portfolioRef);
//         return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     } catch (error) {
//         throw new Error(`Error getting all portfolios: ${error.message}`);
//     }
// };

// export const updatePortfolio = async (id, updatedData) => {
//     try {
//         await updateDoc(doc(db, "portfolios", id), updatedData);
//         return true;
//     } catch (error) {
//         throw new Error(`Error updating portfolio: ${error.message}`);
//     }
// };

// export const deletePortfolio = async (id) => {
//     try {
//         await deleteDoc(doc(db, "portfolios", id));
//         return true;
//     } catch (error) {
//         throw new Error(`Error deleting portfolio: ${error.message}`);
//     }
// };
import { db, storage } from "./firebase";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
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
    const cleanedData = { ...portfolioData };

    // ✅ Remove fields that Firestore doesn't accept
    delete cleanedData.imageFile;

    const docRef = await addDoc(collection(db, "portfolios"), cleanedData);
    return docRef.id;
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
