// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  observeAuthState, 
  signInWithGoogle, 
  signOutUser,
  createUserDocument
} from '../firebase';
import { toast } from 'react-toastify';

// Create the authentication context
const AuthContext = createContext();

// Custom hook for using the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sign in with Google
  const login = async () => {
    try {
      setAuthError(null);
      const user = await signInWithGoogle();
      
      // Create or update user document in Firestore
      if (user) {
        await createUserDocument(user);
      }
      
      return user;
    } catch (error) {
      setAuthError(error.message);
      toast.error(`Sign in failed: ${error.message}`);
      return null;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOutUser();
      toast.success('Signed out successfully');
      return true;
    } catch (error) {
      setAuthError(error.message);
      toast.error(`Sign out failed: ${error.message}`);
      return false;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = observeAuthState((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Value to be provided by the context
  const value = {
    currentUser,
    loading,
    authError,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="spinner"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;