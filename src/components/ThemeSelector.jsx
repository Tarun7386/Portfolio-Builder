// src/components/ThemeSelector.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Check, Sun, Moon, Monitor } from 'lucide-react';

const themes = [
  {
    id: 'classic',
    name: 'Classic',
    primaryColor: '#3b82f6', // blue-500
    secondaryColor: '#6366f1', // indigo-500
    previewImage: '/api/placeholder/100/100',
    description: 'Professional and clean design',
  },
  {
    id: 'modern',
    name: 'Modern',
    primaryColor: '#8b5cf6', // violet-500
    secondaryColor: '#ec4899', // pink-500
    previewImage: '/api/placeholder/100/100',
    description: 'Contemporary and bold style',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    primaryColor: '#10b981', // emerald-500
    secondaryColor: '#14b8a6', // teal-500
    previewImage: '/api/placeholder/100/100',
    description: 'Simple and elegant appearance',
  },
  {
    id: 'creative',
    name: 'Creative',
    primaryColor: '#f59e0b', // amber-500
    secondaryColor: '#ef4444', // red-500
    previewImage: '/api/placeholder/100/100',
    description: 'Vibrant and artistic design',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    primaryColor: '#6d28d9', // violet-700
    secondaryColor: '#4f46e5', // indigo-600
    previewImage: '/api/placeholder/100/100',
    description: 'Sleek dark interface',
  },
];

const colorSchemes = [
  {
    id: 'blue',
    name: 'Blue',
    color: '#3b82f6',
  },
  {
    id: 'purple',
    name: 'Purple',
    color: '#8b5cf6',
  },
  {
    id: 'green',
    name: 'Green',
    color: '#10b981',
  },
  {
    id: 'red',
    name: 'Red',
    color: '#ef4444',
  },
  {
    id: 'orange',
    name: 'Orange',
    color: '#f59e0b',
  },
  {
    id: 'pink',
    name: 'Pink',
    color: '#ec4899',
  },
];

const ThemeSelector = ({ currentTheme, onThemeChange, onColorChange, currentColor }) => {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || themes[0].id);
  const [selectedColor, setSelectedColor] = useState(currentColor || colorSchemes[0].id);
  const [activeTab, setActiveTab] = useState('themes');

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    if (onThemeChange) {
      onThemeChange(themeId);
    }
  };

  const handleColorSelect = (colorId) => {
    setSelectedColor(colorId);
    if (onColorChange) {
      onColorChange(colorId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <Palette className="h-5 w-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Appearance</h3>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-6">
          <button
            className={`flex-1 rounded-md py-2 text-sm font-medium ${
              activeTab === 'themes'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('themes')}
          >
            Themes
          </button>
          <button
            className={`flex-1 rounded-md py-2 text-sm font-medium ${
              activeTab === 'colors'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('colors')}
          >
            Colors
          </button>
          <button
            className={`flex-1 rounded-md py-2 text-sm font-medium ${
              activeTab === 'mode'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('mode')}
          >
            Mode
          </button>
        </div>

        {/* Theme Selection */}
        {activeTab === 'themes' && (
          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme) => (
              <motion.div
                key={theme.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleThemeSelect(theme.id)}
                className={`cursor-pointer rounded-lg border-2 p-3 ${
                  selectedTheme === theme.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="relative overflow-hidden rounded-md mb-3">
                  {/* Theme preview image */}
                  <div 
                    className="h-24 w-full rounded-md"
                    style={{
                      background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.secondaryColor})`
                    }}
                  ></div>
                  {selectedTheme === theme.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                        <Check className="h-5 w-5" />
                      </span>
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-gray-900">{theme.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Color Selection */}
        {activeTab === 'colors' && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {colorSchemes.map((colorScheme) => (
                <motion.div
                  key={colorScheme.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleColorSelect(colorScheme.id)}
                  className="cursor-pointer"
                >
                  <div className="relative">
                    <div
                      className="h-12 rounded-lg shadow-sm"
                      style={{ backgroundColor: colorScheme.color }}
                    ></div>
                    {selectedColor === colorScheme.id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
                          <Check className="h-4 w-4 text-gray-900" />
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-center mt-2 text-gray-700">{colorScheme.name}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Custom Color</h4>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-1">Primary</label>
                  <input
                    type="color"
                    className="h-10 w-full rounded-md border border-gray-300"
                    defaultValue="#3b82f6"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-1">Secondary</label>
                  <input
                    type="color"
                    className="h-10 w-full rounded-md border border-gray-300"
                    defaultValue="#6366f1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Display Mode */}
        {activeTab === 'mode' && (
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer rounded-lg border-2 border-gray-200 hover:border-gray-300 p-4 flex flex-col items-center"
            >
              <div className="bg-gray-100 rounded-full p-3 mb-3">
                <Sun className="h-6 w-6 text-orange-500" />
              </div>
              <h4 className="font-medium text-gray-900">Light</h4>
              <p className="text-xs text-gray-500 text-center mt-1">Bright interface</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer rounded-lg border-2 border-blue-500 bg-blue-50 p-4 flex flex-col items-center"
            >
              <div className="bg-blue-100 rounded-full p-3 mb-3">
                <Moon className="h-6 w-6 text-blue-800" />
              </div>
              <h4 className="font-medium text-gray-900">Dark</h4>
              <p className="text-xs text-gray-500 text-center mt-1">Low-light friendly</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer rounded-lg border-2 border-gray-200 hover:border-gray-300 p-4 flex flex-col items-center"
            >
              <div className="bg-gray-100 rounded-full p-3 mb-3">
                <Monitor className="h-6 w-6 text-purple-500" />
              </div>
              <h4 className="font-medium text-gray-900">System</h4>
              <p className="text-xs text-gray-500 text-center mt-1">Match device</p>
            </motion.div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors">
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;