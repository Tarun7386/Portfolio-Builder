// src/pages/TemplateGallery.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { 
  ArrowLeft, Star, Check, Briefcase, Layout, Sparkles, 
  Zap, Award, Code, Terminal, PenTool, Globe
} from 'lucide-react';
import { toast } from 'react-toastify';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with bold typography and smooth animations',
    features: ['Animated sections', 'Bold typography', 'Minimalist aesthetic'],
    image: '/api/placeholder/600/400',
    popular: true,
    category: 'professional'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional and professional layout with a timeless design approach',
    features: ['Professional layout', 'Easy navigation', 'Focus on content'],
    image: '/api/placeholder/600/400',
    popular: false,
    category: 'professional'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Unique and artistic template for designers and creative professionals',
    features: ['Creative layout', 'Vibrant colors', 'Portfolio showcase'],
    image: '/api/placeholder/600/400',
    popular: true,
    category: 'creative'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant design that prioritizes content and readability',
    features: ['Minimalist design', 'Content-focused', 'Fast loading'],
    image: '/api/placeholder/600/400',
    popular: false,
    category: 'professional'
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Tech-focused template with code snippets and GitHub integration',
    features: ['Code snippet display', 'GitHub integration', 'Skills visualization'],
    image: '/api/placeholder/600/400',
    popular: true,
    category: 'technical'
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Bold and impactful design for entrepreneurs and startup founders',
    features: ['Bold statements', 'Achievement highlights', 'Call-to-action focus'],
    image: '/api/placeholder/600/400',
    popular: false,
    category: 'business'
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Professional template for researchers, professors, and students',
    features: ['Publication listings', 'Research interests', 'Academic credentials'],
    image: '/api/placeholder/600/400',
    popular: false,
    category: 'professional'
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    description: 'Versatile template for freelancers with service offerings and testimonials',
    features: ['Service showcase', 'Testimonial carousel', 'Contact form'],
    image: '/api/placeholder/600/400',
    popular: true,
    category: 'business'
  }
];

const categories = [
  { id: 'all', name: 'All Templates', icon: <Layout /> },
  { id: 'professional', name: 'Professional', icon: <Briefcase /> },
  { id: 'creative', name: 'Creative', icon: <PenTool /> },
  { id: 'technical', name: 'Technical', icon: <Terminal /> },
  { id: 'business', name: 'Business', icon: <Globe /> }
];

const TemplateGallery = () => {
  const navigate = useNavigate();
  const { themeId, setThemeId } = useTheme();
  const [loading, setLoading] = useState(true);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!auth.currentUser) {
        navigate('/signin');
        return;
      }
      
      try {
        // Get user portfolio to determine current template
        const portfolioDoc = await getDoc(doc(db, 'portfolios', auth.currentUser.uid));
        
        if (portfolioDoc.exists()) {
          setCurrentTemplate(portfolioDoc.data().template || 'modern');
        } else {
          setCurrentTemplate('modern');
        }
      } catch (error) {
        console.error('Error loading template data:', error);
        toast.error('Failed to load template data');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate]);

  const filteredTemplates = templates.filter(template => {
    const matchesFilter = filter === 'all' || template.category === filter;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const applyTemplate = async (templateId) => {
    try {
      setApplying(true);
      
      // Update Firestore portfolio
      await updateDoc(doc(db, 'portfolios', auth.currentUser.uid), {
        template: templateId,
        updatedAt: new Date().toISOString()
      });
      
      setCurrentTemplate(templateId);
      
      // Also update theme if the template has a corresponding theme
      if (templateId === 'modern' || templateId === 'classic' || 
          templateId === 'creative' || templateId === 'minimal') {
        setThemeId(templateId);
      }
      
      toast.success('Template applied successfully');
    } catch (error) {
      console.error('Error applying template:', error);
      toast.error('Failed to apply template');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
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
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border border-gray-300 rounded-md shadow-sm py-2 px-4 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Layout className="h-6 w-6 mr-2 text-blue-600" />
            Portfolio Templates
          </h1>
          <p className="mt-1 text-gray-500">
            Choose a template that best showcases your work and professional brand
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  filter === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors duration-200 shadow-sm`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={`bg-white rounded-xl shadow-md overflow-hidden ${
                currentTemplate === template.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                {template.popular && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center bg-blue-600 bg-opacity-90 rounded-full px-3 py-1 text-xs text-white">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Popular
                    </span>
                  </div>
                )}
                {currentTemplate === template.id && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center bg-green-600 bg-opacity-90 rounded-full px-3 py-1 text-xs text-white">
                      <Check className="h-3 w-3 mr-1" />
                      Current
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Features</h4>
                  <ul className="mt-2 space-y-1">
                    {template.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600">
                        <Sparkles className="h-3 w-3 mr-2 text-blue-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => applyTemplate(template.id)}
                    disabled={currentTemplate === template.id || applying}
                    className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      currentTemplate === template.id
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      applying ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {applying ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Applying...
                      </>
                    ) : currentTemplate === template.id ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Current Template
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Apply Template
                      </>
                    )}
                  </button>
                  <button 
                    className="mt-2 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Layout className="h-full w-full" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setFilter('all');
                  setSearchQuery('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {/* Custom Template Banner */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 md:flex md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                <span className="block">Need a custom template?</span>
              </h2>
              <p className="mt-2 text-blue-100">
                Get a template designed specifically for your needs with custom features and branding.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-purple-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-purple-600"
              >
                <Award className="h-5 w-5 mr-2" />
                Request Custom Template
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TemplateGallery;