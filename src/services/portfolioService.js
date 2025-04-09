
import { db, storage } from "../firebase";
import {
  collection,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Default structure for new portfolios
export const DEFAULT_PORTFOLIO = {
  name: "",
  title: "",
  about: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  skills: [],
  experience: [],
  projects: [],
  imageUrl: "",
  profileImage: "/api/placeholder/200/200"
};

// Get a portfolio by ID
export const getPortfolio = async (id) => {
  try {
    const docRef = doc(db, "portfolios", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Ensure skills is an array
      let processedSkills = data.skills || [];
      if (typeof processedSkills === 'string') {
        processedSkills = processedSkills.split(',').map(skill => skill.trim()).filter(Boolean);
      }
      
      // Ensure experience and projects are arrays
      const processedExperience = Array.isArray(data.experience) ? data.experience : [];
      const processedProjects = Array.isArray(data.projects) ? data.projects : [];
      
      return { 
        id: docSnap.id, 
        ...data, 
        skills: processedSkills,
        experience: processedExperience,
        projects: processedProjects 
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting portfolio:", error);
    throw error;
  }
};

// Get all portfolios
export const getAllPortfolios = async () => {
  try {
    const q = query(collection(db, "portfolios"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Ensure skills is an array
      let processedSkills = data.skills || [];
      if (typeof processedSkills === 'string') {
        processedSkills = processedSkills.split(',').map(skill => skill.trim()).filter(Boolean);
      }
      
      return { 
        id: doc.id, 
        ...data, 
        skills: processedSkills 
      };
    });
  } catch (error) {
    console.error("Error getting all portfolios:", error);
    throw error;
  }
};

// Upload image to storage
export const uploadImage = async (userId, file, type = "profile") => {
  try {
    if (!file) return null;
    
    const timestamp = new Date().getTime();
    const filename = `${type}-${timestamp}-${file.name}`;
    const storageRef = ref(storage, `${userId}/${filename}`);
    
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Create or update portfolio
export const savePortfolio = async (portfolioData) => {
  try {
    const { userId } = portfolioData;
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    // Process portfolio data for saving
    const processedData = { ...portfolioData };
    
    // Ensure skills is an array
    if (typeof processedData.skills === 'string') {
      processedData.skills = processedData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);
    }
    
    // Ensure experience and projects are arrays
    if (!Array.isArray(processedData.experience)) {
      processedData.experience = [];
    }
    
    if (!Array.isArray(processedData.projects)) {
      processedData.projects = [];
    }
    
    // Add timestamps
    processedData.updatedAt = serverTimestamp();
    
    // Check if document exists
    const docRef = doc(db, "portfolios", userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      processedData.createdAt = serverTimestamp();
    }
    
    // Save to Firestore
    await setDoc(docRef, processedData, { merge: true });
    
    return userId;
  } catch (error) {
    console.error("Error saving portfolio:", error);
    throw error;
  }
};

// Update an existing portfolio
export const updatePortfolio = async (id, portfolioData) => {
  try {
    const docRef = doc(db, "portfolios", id);
    
    // Process portfolio data for saving
    const processedData = { ...portfolioData };
    
    // Ensure skills is an array
    if (typeof processedData.skills === 'string') {
      processedData.skills = processedData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);
    }
    
    // Add updated timestamp
    processedData.updatedAt = serverTimestamp();
    
    // Update the document
    await updateDoc(docRef, processedData);
    
    return true;
  } catch (error) {
    console.error("Error updating portfolio:", error);
    throw error;
  }
};

// Delete a portfolio
export const deletePortfolio = async (id) => {
  try {
    await deleteDoc(doc(db, "portfolios", id));
    return true;
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    throw error;
  }
};

// Handle project creation/update
export const saveProject = async (portfolioId, projectData) => {
  try {
    const portfolio = await getPortfolio(portfolioId);
    
    if (!portfolio) {
      throw new Error("Portfolio not found");
    }
    
    const projects = Array.isArray(portfolio.projects) ? [...portfolio.projects] : [];
    const projectIndex = projects.findIndex(p => p.id === projectData.id);
    
    if (projectIndex >= 0) {
      // Update existing project
      projects[projectIndex] = projectData;
    } else {
      // Add new project
      projects.push({
        ...projectData,
        id: projectData.id || Date.now().toString()
      });
    }
    
    // Update the portfolio
    await updateDoc(doc(db, "portfolios", portfolioId), {
      projects,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error saving project:", error);
    throw error;
  }
};

// Handle experience creation/update
export const saveExperience = async (portfolioId, experienceData) => {
  try {
    const portfolio = await getPortfolio(portfolioId);
    
    if (!portfolio) {
      throw new Error("Portfolio not found");
    }
    
    const experiences = Array.isArray(portfolio.experience) ? [...portfolio.experience] : [];
    const experienceIndex = experiences.findIndex(e => e.id === experienceData.id);
    
    if (experienceIndex >= 0) {
      // Update existing experience
      experiences[experienceIndex] = experienceData;
    } else {
      // Add new experience
      experiences.push({
        ...experienceData,
        id: experienceData.id || Date.now().toString()
      });
    }
    
    // Update the portfolio
    await updateDoc(doc(db, "portfolios", portfolioId), {
      experience: experiences,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error saving experience:", error);
    throw error;
  }
};

export default {
  getPortfolio,
  getAllPortfolios,
  savePortfolio,
  updatePortfolio,
  deletePortfolio,
  uploadImage,
  saveProject,
  saveExperience,
  DEFAULT_PORTFOLIO
};