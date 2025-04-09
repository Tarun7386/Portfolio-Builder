// src/pages/AccountSettings.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTheme } from '../contexts/ThemeContext';
import ThemeSelector from '../components/ThemeSelector';
import { motion } from 'framer-motion';
import { 
  User, Settings, Shield, Mail, Bell, Briefcase, LogOut, Camera, 
  Save, ArrowLeft, CheckCircle, ExternalLink, Key, LockIcon
} from 'lucide-react';
import { toast } from 'react-toastify';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { themeId, setThemeId, primaryColor, setPrimaryColor } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    photoURL: '',
    phone: '',
    location: '',
    title: '',
    bio: '',
    notificationsEnabled: true,
    emailUpdates: true,
    portfolioUrl: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changesSaved, setChangesSaved] = useState(false);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    const loadUserData = async () => {
      if (!auth.currentUser) {
        navigate('/signin');
        return;
      }
      
      setUser(auth.currentUser);
      
      try {
        // Get user profile data
        const profileDoc = await getDoc(doc(db, 'profiles', auth.currentUser.uid));
        
        setProfileData({
          displayName: auth.currentUser.displayName || '',
          email: auth.currentUser.email || '',
          photoURL: auth.currentUser.photoURL || '',
          phone: profileDoc.exists() ? profileDoc.data().phone || '' : '',
          location: profileDoc.exists() ? profileDoc.data().location || '' : '',
          title: profileDoc.exists() ? profileDoc.data().title || '' : '',
          bio: profileDoc.exists() ? profileDoc.data().bio || '' : '',
          notificationsEnabled: profileDoc.exists() ? profileDoc.data().notificationsEnabled !== false : true,
          emailUpdates: profileDoc.exists() ? profileDoc.data().emailUpdates !== false : true,
          portfolioUrl: `${window.location.origin}/portfolio/${auth.currentUser.uid}`
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate]);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setSaving(true);
      const storageRef = ref(storage, `profile-images/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      
      setProfileData(prev => ({ ...prev, photoURL }));
      
      // Update auth profile
      await updateProfile(auth.currentUser, { photoURL });
      
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      
      // Update auth profile
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });
      
      // Update Firestore profile
      await updateDoc(doc(db, 'profiles', auth.currentUser.uid), {
        displayName: profileData.displayName,
        phone: profileData.phone,
        location: profileData.location,
        title: profileData.title,
        bio: profileData.bio,
        notificationsEnabled: profileData.notificationsEnabled,
        emailUpdates: profileData.emailUpdates,
        updatedAt: new Date().toISOString()
      });
      
      setChangesSaved(true);
      setTimeout(() => setChangesSaved(false), 3000);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    // Password update logic would go here
    // This is a placeholder since Firebase password update requires re-authentication
    toast.info('Password update feature coming soon');
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleThemeChange = (newThemeId) => {
    setThemeId(newThemeId);
    toast.success('Theme updated successfully');
  };

  const handleColorChange = (newColorId) => {
    // This would map color IDs to actual color values
    const colorMap = {
      blue: '#3b82f6',
      purple: '#8b5cf6',
      green: '#10b981',
      red: '#ef4444',
      orange: '#f59e0b',
      pink: '#ec4899',
    };
    
    setPrimaryColor(colorMap[newColorId] || colorMap.blue);
    toast.success('Color scheme updated successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <img
                className="h-10 w-10 rounded-full border-2 border-gray-200"
                src={profileData.photoURL || `https://ui-avatars.com/api/?name=${profileData.displayName || 'User'}&size=40`}
                alt={profileData.displayName || 'User'}
              />
              <span className="text-sm font-medium text-gray-700">
                {profileData.displayName || user?.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="h-5 w-5 mr-3" />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === 'account'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Shield className="h-5 w-5 mr-3" />
                Account & Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === 'notifications'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bell className="h-5 w-5 mr-3" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  activeTab === 'appearance'
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-5 w-5 mr-3" />
                Appearance
              </button>
              <div className="pt-5">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign out
                </button>
              </div>
            </nav>
          </aside>

          {/* Main content */}
          <div className="mt-10 lg:mt-0 lg:col-span-9">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white shadow rounded-lg"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Profile Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Update your personal information and how it appears on your portfolio
                    </p>
                  </div>
                  <div className="px-6 py-6 space-y-6">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
                      <div className="relative">
                        <img
                          className="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                          src={profileData.photoURL || `https://ui-avatars.com/api/?name=${profileData.displayName || 'User'}&size=96`}
                          alt={profileData.displayName || 'User'}
                        />
                        <button
                          onClick={handleImageUpload}
                          className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
                          disabled={saving}
                        >
                          {saving ? (
                            <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                          ) : (
                            <Camera className="h-5 w-5" />
                          )}
                          <input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*"
                          />
                        </button>
                      </div>
                      <div className="mt-4 sm:mt-0 text-center sm:text-left">
                        <h4 className="text-lg font-medium text-gray-900">{profileData.displayName || 'Your Name'}</h4>
                        <p className="text-sm text-gray-500">{profileData.title || 'Your Title'}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <button
                            onClick={handleImageUpload}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Change photo
                          </button>
                          <a
                            href={profileData.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            View portfolio <ExternalLink className="h-4 w-4 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="displayName"
                          name="displayName"
                          value={profileData.displayName}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          disabled
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 cursor-not-allowed sm:text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                      </div>
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Professional Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={profileData.title}
                          onChange={handleProfileChange}
                          placeholder="e.g., Frontend Developer"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={profileData.location}
                          onChange={handleProfileChange}
                          placeholder="e.g., New York, NY"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          placeholder="e.g., +1 (555) 123-4567"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={profileData.bio}
                          onChange={handleProfileChange}
                          placeholder="Write a short bio about yourself..."
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 flex items-center justify-between rounded-b-lg border-t border-gray-200">
                    {changesSaved && (
                      <span className="inline-flex items-center text-sm text-green-600">
                        <CheckCircle className="h-5 w-5 mr-1" />
                        Profile saved successfully
                      </span>
                    )}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleUpdateProfile}
                        disabled={saving}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {saving ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div>
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Account & Security
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage your account settings and security preferences
                    </p>
                  </div>
                  <div className="px-6 py-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-base font-medium text-gray-900 flex items-center">
                          <LockIcon className="h-5 w-5 mr-2" />
                          Change Password
                        </h4>
                        <div className="mt-4 space-y-4">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                              Current Password
                            </label>
                            <input
                              type="password"
                              id="currentPassword"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Enter your current password"
                            />
                          </div>
                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="newPassword"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Enter your new password"
                            />
                          </div>
                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Confirm your new password"
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={handleUpdatePassword}
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Key className="h-4 w-4 mr-2" />
                              Update Password
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200">
                        <h4 className="text-base font-medium text-gray-900">Account Management</h4>
                        <div className="mt-4">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                          >
                            Delete Account
                          </button>
                          <p className="mt-2 text-sm text-gray-500">
                            This will permanently delete your account and all associated data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notification Settings
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Manage how and when you receive notifications
                    </p>
                  </div>
                  <div className="px-6 py-6 space-y-6">
                    <div className="space-y-4">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="notificationsEnabled"
                            name="notificationsEnabled"
                            type="checkbox"
                            checked={profileData.notificationsEnabled}
                            onChange={handleProfileChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="notificationsEnabled" className="font-medium text-gray-700">
                            Enable Notifications
                          </label>
                          <p className="text-gray-500">
                            Receive notifications about activity on your portfolio
                          </p>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="emailUpdates"
                            name="emailUpdates"
                            type="checkbox"
                            checked={profileData.emailUpdates}
                            onChange={handleProfileChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="emailUpdates" className="font-medium text-gray-700">
                            Email Updates
                          </label>
                          <p className="text-gray-500">
                            Receive email notifications about new features and updates
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-base font-medium text-gray-900">Notification Types</h4>
                      <div className="mt-4 space-y-4">
                        {[
                          { id: 'profile-views', label: 'Profile Views', description: 'When someone views your portfolio' },
                          { id: 'messages', label: 'Messages', description: 'When you receive a new message' },
                          { id: 'portfolio-updates', label: 'Portfolio Updates', description: 'Updates about your portfolio performance' }
                        ].map(item => (
                          <div key={item.id} className="relative flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id={item.id}
                                name={item.id}
                                type="checkbox"
                                defaultChecked={true}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor={item.id} className="font-medium text-gray-700">
                                {item.label}
                              </label>
                              <p className="text-gray-500">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 flex justify-end rounded-b-lg border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleUpdateProfile}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div>
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Appearance Settings
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Customize how your portfolio looks and feels
                    </p>
                  </div>
                  <div className="p-6">
                    <ThemeSelector 
                      currentTheme={themeId}
                      onThemeChange={handleThemeChange}
                      currentColor="blue"
                      onColorChange={handleColorChange}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountSettings;