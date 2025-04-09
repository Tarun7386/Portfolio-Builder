// src/contexts/ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define theme options
const themes = {
  classic: {
    id: 'classic',
    primaryColor: '#3b82f6', // blue-500
    secondaryColor: '#6366f1', // indigo-500
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-indigo-600',
  },
  modern: {
    id: 'modern',
    primaryColor: '#8b5cf6', // violet-500
    secondaryColor: '#ec4899', // pink-500
    gradientFrom: 'from-violet-600',
    gradientTo: 'to-pink-500',
  },
  minimal: {
    id: 'minimal',
    primaryColor: '#10b981', // emerald-500
    secondaryColor: '#14b8a6', // teal-500
    gradientFrom: 'from-emerald-600',
    gradientTo: 'to-teal-600',
  },
  creative: {
    id: 'creative',
    primaryColor: '#f59e0b', // amber-500
    secondaryColor: '#ef4444', // red-500
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-red-500',
  },
  dark: {
    id: 'dark',
    primaryColor: '#6d28d9', // violet-700
    secondaryColor: '#4f46e5', // indigo-600
    gradientFrom: 'from-violet-700',
    gradientTo: 'to-indigo-800',
    isDark: true,
  },
};

// Create the context
const ThemeContext = createContext();

// Custom hook for using the theme context
export function useTheme() {
  return useContext(ThemeContext);
}

// ThemeProvider component
export function ThemeProvider({ children }) {
  // Initialize state with stored values or defaults
  const [themeId, setThemeId] = useState(() => {
    const storedTheme = localStorage.getItem('portfolioTheme');
    return storedTheme || 'classic';
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem('portfolioDarkMode');
    return storedMode ? JSON.parse(storedMode) : false;
  });
  
  const [primaryColor, setPrimaryColor] = useState(() => {
    const storedColor = localStorage.getItem('portfolioPrimaryColor');
    return storedColor || themes.classic.primaryColor;
  });

  // Current theme object
  const currentTheme = themes[themeId] || themes.classic;

  // Update theme in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('portfolioTheme', themeId);
  }, [themeId]);

  // Update dark mode in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('portfolioDarkMode', JSON.stringify(darkMode));
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update primary color in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('portfolioPrimaryColor', primaryColor);
    
    // Update CSS variables for colors
    document.documentElement.style.setProperty('--color-primary', primaryColor);
    document.documentElement.style.setProperty('--color-secondary', currentTheme.secondaryColor);
  }, [primaryColor, currentTheme.secondaryColor]);

  // Value to be provided by the context
  const value = {
    themeId,
    setThemeId,
    currentTheme,
    darkMode,
    setDarkMode,
    primaryColor,
    setPrimaryColor,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}