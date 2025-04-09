// src/components/LoadingSpinner.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ fullScreen = true, size = 'medium', message = 'Loading...' }) => {
  // Size configurations
  const sizes = {
    small: 'w-8 h-8 border-2',
    medium: 'w-12 h-12 border-3',
    large: 'w-16 h-16 border-4'
  };
  
  const spinnerSize = sizes[size] || sizes.medium;
  
  // Container configurations
  const containerClass = fullScreen 
    ? 'min-h-screen flex items-center justify-center bg-gray-50' 
    : 'w-full flex items-center justify-center py-8';
  
  return (
    <div className={containerClass}>
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className={`${spinnerSize} border-t-transparent rounded-full border-blue-500 animate-spin`}></div>
          <p className="mt-4 text-gray-600 font-medium">{message}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;