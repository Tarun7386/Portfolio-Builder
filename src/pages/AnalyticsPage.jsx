// src/pages/AnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, BarChart2, Eye, Clock, Users, Globe, Download, 
  MousePointer, Calendar, ChevronDown, Filter, RefreshCw, Share2
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  // Sample data - in a real app, this would come from your analytics database
  const [analyticsData, setAnalyticsData] = useState({
    views: {
      total: 0,
      trend: 0,
      history: []
    },
    interactions: {
      total: 0,
      trend: 0,
      breakdown: []
    },
    sources: [],
    demographics: {
      countries: [],
      devices: []
    },
    downloads: 0,
    averageTime: '0m 0s'
  });

  useEffect(() => {
    const loadData = async () => {
      if (!auth.currentUser) {
        navigate('/signin');
        return;
      }
      
      try {
        // Get portfolio data
        const portfolioDoc = await getDoc(doc(db, 'portfolios', auth.currentUser.uid));
        if (portfolioDoc.exists()) {
          setPortfolio(portfolioDoc.data());
        }
        
        // Generate mock analytics data
        generateMockData(timeRange);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [navigate, timeRange]);

  const generateMockData = (range) => {
    let days;
    switch (range) {
      case '7d': days = 7; break;
      case '90d': days = 90; break;
      case '1y': days = 365; break;
      case '30d':
      default: days = 30; break;
    }
    
    // Generate views history
    const viewsHistory = [];
    let totalViews = 0;
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      const views = Math.floor(Math.random() * 15) + 1;
      totalViews += views;
      viewsHistory.push({
        date: date.toISOString().split('T')[0],
        views: views
      });
    }
    
    // Generate interactions breakdown
    const interactions = [
      { name: 'Contact clicks', value: Math.floor(Math.random() * 50) + 10 },
      { name: 'Project views', value: Math.floor(Math.random() * 80) + 20 },
      { name: 'Resume downloads', value: Math.floor(Math.random() * 30) + 5 },
      { name: 'Links clicked', value: Math.floor(Math.random() * 40) + 15 }
    ];
    const totalInteractions = interactions.reduce((sum, item) => sum + item.value, 0);
    
    // Generate traffic sources
    const sources = [
      { name: 'Direct', value: Math.floor(Math.random() * 40) + 10 },
      { name: 'Search', value: Math.floor(Math.random() * 30) + 5 },
      { name: 'Social', value: Math.floor(Math.random() * 20) + 5 },
      { name: 'Referral', value: Math.floor(Math.random() * 20) + 5 }
    ];
    
    // Generate country data
    const countries = [
      { name: 'United States', value: Math.floor(Math.random() * 60) + 20 },
      { name: 'United Kingdom', value: Math.floor(Math.random() * 20) + 5 },
      { name: 'Canada', value: Math.floor(Math.random() * 15) + 5 },
      { name: 'Germany', value: Math.floor(Math.random() * 10) + 5 },
      { name: 'France', value: Math.floor(Math.random() * 10) + 5 }
    ];
    
    // Generate device data
    const devices = [
      { name: 'Desktop', value: Math.floor(Math.random() * 60) + 30 },
      { name: 'Mobile', value: Math.floor(Math.random() * 40) + 20 },
      { name: 'Tablet', value: Math.floor(Math.random() * 20) + 5 }
    ];
    
    // Set the analytics data
    setAnalyticsData({
      views: {
        total: totalViews,
        trend: Math.floor(Math.random() * 40) - 20, // Random trend between -20% and +20%
        history: viewsHistory
      },
      interactions: {
        total: totalInteractions,
        trend: Math.floor(Math.random() * 30) - 10, // Random trend between -10% and +20%
        breakdown: interactions
      },
      sources: sources,
      demographics: {
        countries: countries,
        devices: devices
      },
      downloads: Math.floor(Math.random() * 30) + 5,
      averageTime: `${Math.floor(Math.random() * 2) + 1}m ${Math.floor(Math.random() * 60)}s`
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      generateMockData(timeRange);
      setRefreshing(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Colors for charts
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444', '#f59e0b', '#ec4899'];

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
              <div className="relative">
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {timeRange === '7d' ? 'Last 7 days' : 
                   timeRange === '30d' ? 'Last 30 days' : 
                   timeRange === '90d' ? 'Last 90 days' : 'Last year'}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
                  <div className="py-1">
                    {['7d', '30d', '90d', '1y'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        {range === '7d' ? 'Last 7 days' : 
                         range === '30d' ? 'Last 30 days' : 
                         range === '90d' ? 'Last 90 days' : 'Last year'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
                  refreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart2 className="h-6 w-6 mr-2 text-blue-600" />
            Portfolio Analytics
          </h1>
          <p className="mt-1 text-gray-500">
            Track performance metrics and visitor insights for your portfolio
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { 
              title: 'Total Views', 
              value: analyticsData.views.total, 
              trend: analyticsData.views.trend, 
              icon: <Eye className="h-6 w-6 text-blue-600" />
            },
            { 
              title: 'Avg. Time on Page', 
              value: analyticsData.averageTime, 
              trend: null, 
              icon: <Clock className="h-6 w-6 text-purple-600" />
            },
            { 
              title: 'Interactions', 
              value: analyticsData.interactions.total, 
              trend: analyticsData.interactions.trend, 
              icon: <MousePointer className="h-6 w-6 text-green-600" />
            },
            { 
              title: 'Resume Downloads', 
              value: analyticsData.downloads, 
              trend: null, 
              icon: <Download className="h-6 w-6 text-orange-600" />
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md p-3 bg-gray-50">
                    {stat.icon}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
                {stat.trend !== null && (
                  <div className="mt-3 flex items-center text-sm">
                    <span className={`font-medium ${
                      stat.trend > 0 ? 'text-green-600' : stat.trend < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.trend > 0 ? '+' : ''}{stat.trend}%
                    </span>
                    <span className="ml-2 text-gray-500">vs. previous period</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-8">
          {/* Views Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Views Over Time</h3>
              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </button>
            </div>
            <div className="p-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.views.history}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip 
                    formatter={(value) => [`${value} views`, 'Views']}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorViews)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Interaction Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Interactions Breakdown</h3>
              </div>
              <div className="p-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.interactions.breakdown}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Traffic Sources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Traffic Sources</h3>
              </div>
              <div className="p-6 h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.sources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.sources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Traffic Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Countries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Top Countries</h3>
                <div className="text-blue-600">
                  <Globe className="h-5 w-5" />
                </div>
              </div>
              <div className="p-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.demographics.countries}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={120} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Devices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Device Breakdown</h3>
              </div>
              <div className="p-6 h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.demographics.devices}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.demographics.devices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Usage Share']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Share Report Button */}
        <div className="mt-8 flex justify-end">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;