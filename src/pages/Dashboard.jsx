// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  User, Edit, Eye, LogOut, Plus, Settings, 
  Share2, Clock, Award, BarChart, ChevronRight, 
  ExternalLink, Briefcase
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    views: 0,
    shares: 0,
    lastUpdated: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      if (!auth.currentUser) {
        navigate('/signin');
        return;
      }
      
      setUser(auth.currentUser);
      
      try {
        // Fetch portfolio data
        const portfolioRef = doc(db, 'portfolios', auth.currentUser.uid);
        const portfolioSnap = await getDoc(portfolioRef);
        
        if (portfolioSnap.exists()) {
          setPortfolio({ id: portfolioSnap.id, ...portfolioSnap.data() });
          // Set mock stats data
          setStats({
            views: Math.floor(Math.random() * 100),
            shares: Math.floor(Math.random() * 20),
            lastUpdated: portfolioSnap.data().updatedAt || new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">PortfolioHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&size=32`}
                  alt={user?.displayName || 'User'}
                />
                <span className="ml-2 text-sm font-medium text-gray-700">{user?.displayName || user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="px-6 py-8 sm:p-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome, {user?.displayName?.split(' ')[0] || 'there'}!</h2>
                <p className="mt-1 text-blue-100">
                  {portfolio ? 'Manage your professional portfolio' : 'Get started with your professional portfolio'}
                </p>
              </div>
              {portfolio ? (
                <button
                  onClick={() => navigate(`/portfolio/${user.uid}`)}
                  className="inline-flex items-center px-4 py-2 bg-white rounded-md shadow-sm text-sm font-medium text-blue-700 hover:bg-blue-50"
                >
                  View Portfolio
                  <Eye size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/form')}
                  className="inline-flex items-center px-4 py-2 bg-white rounded-md shadow-sm text-sm font-medium text-blue-700 hover:bg-blue-50"
                >
                  Create Portfolio
                  <Plus size={16} className="ml-2" />
                </button>
              )}
            </div>
          </div>
          <div className="px-6 py-2 bg-gradient-to-r from-blue-700 to-indigo-800">
            <div className="text-sm text-blue-100">
              {portfolio ? (
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span>Last updated: {formatDate(stats.lastUpdated)}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Plus size={14} className="mr-1" />
                  <span>Create your portfolio to showcase your professional work</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Preview Card */}
            {portfolio ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-gray-200">
                        <img
                          src={portfolio.imageUrl || `https://ui-avatars.com/api/?name=${portfolio.name}&size=56`}
                          alt={portfolio.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{portfolio.name}</h3>
                        <p className="text-sm text-gray-500">{portfolio.title}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/edit/${user.uid}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/portfolio/${user.uid}`)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-semibold text-gray-800">{stats.views}</div>
                        <div className="text-xs text-gray-500">Profile Views</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-semibold text-gray-800">{stats.shares}</div>
                        <div className="text-xs text-gray-500">Shares</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-2xl font-semibold text-gray-800">{portfolio.skills ? Array.isArray(portfolio.skills) ? portfolio.skills.length : portfolio.skills.split(',').length : 0}</div>
                        <div className="text-xs text-gray-500">Skills</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Portfolio Details</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm">{portfolio.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm">{portfolio.location || 'Not specified'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">About</p>
                        <p className="text-sm line-clamp-3">{portfolio.about}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span className="inline-flex items-center">
                      <Clock size={14} className="mr-1" />
                      Last updated {formatDate(stats.lastUpdated)}
                    </span>
                  </div>
                  <a 
                    href={`/portfolio/${user.uid}`}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    View full portfolio
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <div className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <Briefcase size={32} className="text-blue-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Create Your Portfolio</h3>
                  <p className="mt-2 text-gray-500">
                    Showcase your skills, experience, and projects to potential employers or clients.
                  </p>
                  <button
                    onClick={() => navigate('/form')}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Get Started
                    <ChevronRight size={16} className="ml-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-base font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => navigate('/form')}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                      <Edit size={20} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-medium text-gray-900">{portfolio ? 'Update Portfolio' : 'Create Portfolio'}</h4>
                      <p className="text-xs text-gray-500 mt-1">{portfolio ? 'Edit your existing portfolio' : 'Build your professional profile'}</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => portfolio ? navigate(`/portfolio/${user.uid}`) : navigate('/form')}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
                      <Eye size={20} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-medium text-gray-900">{portfolio ? 'View Portfolio' : 'Preview Templates'}</h4>
                      <p className="text-xs text-gray-500 mt-1">{portfolio ? 'See how your portfolio looks' : 'Browse available designs'}</p>
                    </div>
                  </button>
                  <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
                      <Settings size={20} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-medium text-gray-900">Account Settings</h4>
                      <p className="text-xs text-gray-500 mt-1">Manage your account preferences</p>
                    </div>
                  </button>
                  <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mr-4">
                      <Share2 size={20} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-medium text-gray-900">Share Portfolio</h4>
                      <p className="text-xs text-gray-500 mt-1">Share your work with others</p>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-base font-medium text-gray-900">Your Profile</h3>
              </div>
              <div className="p-6 text-center">
                <div className="relative w-20 h-20 mx-auto">
                  <img
                    className="rounded-full border-2 border-gray-200"
                    src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&size=80`}
                    alt={user?.displayName || 'User'}
                  />
                  <span className="absolute bottom-0 right-0 block h-5 w-5 rounded-full ring-2 ring-white bg-green-400"></span>
                </div>
                <h4 className="mt-3 text-lg font-medium text-gray-900">{user?.displayName || 'User'}</h4>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <button
                  onClick={() => navigate('/account')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <User size={16} className="mr-2" />
                  Edit Profile
                </button>
              </div>
            </motion.div>

            {/* Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-base font-medium text-gray-900">Analytics</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                        <Eye size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Profile Views</p>
                        <p className="text-xs text-gray-500">Last 30 days</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{stats.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                        <BarChart size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Engagement Rate</p>
                        <p className="text-xs text-gray-500">Average time on page</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">2m 34s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                        <Award size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Conversion Rate</p>
                        <p className="text-xs text-gray-500">Contact requests</p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">3.2%</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    View detailed analytics
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-base font-medium text-gray-900">Tips & Resources</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">1</span>
                      </div>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Keep your portfolio updated with your latest work</p>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">2</span>
                      </div>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Add detailed descriptions to your projects</p>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">3</span>
                      </div>
                    </div>
                    <p className="ml-3 text-sm text-gray-700">Include links to live projects or GitHub repositories</p>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    View all resources
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;