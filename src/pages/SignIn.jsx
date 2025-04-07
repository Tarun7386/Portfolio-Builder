import React, { useEffect, useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { FcGoogle } from 'react-icons/fc';

function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user has a portfolio
      const docRef = doc(db, 'portfolios', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigate(`/portfolio/${user.uid}`);
      } else {
        // If no portfolio exists, redirect to form
        navigate('/form');
      }
    } catch (error) {
      console.error("Google sign-in error: ", error);
    }
  };

  // Update useEffect to navigate only if portfolio exists
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'portfolios', user.uid);
          const docSnap = await getDoc(docRef);

          // Only navigate to portfolio if it exists
          if (docSnap.exists()) {
            navigate(`/portfolio/${user.uid}`);
          } else {
            // If no portfolio exists, redirect to form
            navigate('/form');
          }
        } catch (error) {
          console.error("Error checking portfolio:", error);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h1>
          <p className="text-gray-600">Create your professional portfolio</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
        >
          <FcGoogle size={24} />
          <span>Continue with Google</span>
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default SignIn;