import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPortfolio, updatePortfolio } from '../portfolioService';
import { 
  User, Briefcase, FileText, Mail, Phone, MapPin, Linkedin, Github,
  Code, X, ChevronRight, ChevronLeft, Save, ArrowLeft, Plus, 
  Sparkles, Calendar, Trash2, Edit3
} from 'lucide-react';
import { motion } from 'framer-motion';

const EditPortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    about: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    skills: '',
    imageUrl: '/api/placeholder/200/200',
    projects: [],
    experience: []
  });

  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentExperience, setCurrentExperience] = useState(null);

  // Tabs configuration
  const tabs = [
    { name: 'Basic Info', icon: <User size={18} /> },
    { name: 'Contact', icon: <Mail size={18} /> },
    { name: 'Professional', icon: <Briefcase size={18} /> },
    { name: 'Projects', icon: <Code size={18} /> },
    { name: 'Experience', icon: <Calendar size={18} /> }
  ];

  // Form fields organized by tabs
  const formSections = [
    // Basic Info
    [
      { name: 'name', label: 'Full Name', icon: <User size={18} />, placeholder: 'e.g. John Smith' },
      { name: 'title', label: 'Professional Title', icon: <Briefcase size={18} />, placeholder: 'e.g. Senior Frontend Developer' },
      { name: 'about', label: 'About Me', type: 'textarea', icon: <FileText size={18} />, placeholder: 'Share a brief professional summary...' },
    ],
    // Contact
    [
      { name: 'email', label: 'Email Address', icon: <Mail size={18} />, placeholder: 'e.g. john@example.com' },
      { name: 'phone', label: 'Phone Number', icon: <Phone size={18} />, placeholder: 'e.g. +1 555-123-4567' },
      { name: 'location', label: 'Location', icon: <MapPin size={18} />, placeholder: 'e.g. New York, NY, USA' },
      { name: 'linkedin', label: 'LinkedIn URL', icon: <Linkedin size={18} />, placeholder: 'https://linkedin.com/in/yourprofile' },
      { name: 'github', label: 'GitHub URL', icon: <Github size={18} />, placeholder: 'https://github.com/yourusername' },
    ],
    // Professional
    [
      { name: 'skills', label: 'Skills', type: 'tags', icon: <Code size={18} />, placeholder: 'Add your technical and soft skills' },
    ]
  ];

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const data = await getPortfolio(id);
        if (data) {
          setFormData({
            ...data,
            skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills,
            imageUrl: data.imageUrl || '/api/placeholder/200/200',
            projects: data.projects || [],
            experience: data.experience || []
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading portfolio:', error);
        setLoading(false);
      }
    };
    loadPortfolio();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    const tagInput = document.getElementById('tag-input');
    if (tagInput && tagInput.value.trim()) {
      const newTag = tagInput.value.trim();
      const currentTags = formData.skills
        ? formData.skills.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];
      
      if (!currentTags.includes(newTag)) {
        const updatedTags = [...currentTags, newTag].join(', ');
        setFormData(prev => ({ ...prev, skills: updatedTags }));
      }
      
      tagInput.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = formData.skills
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== tagToRemove)
      .join(', ');
    
    setFormData(prev => ({ ...prev, skills: updatedTags }));
  };

  // Project handlers
  const openProjectModal = (project = null) => {
    setCurrentProject(project || {
      id: Date.now(),
      title: '',
      description: '',
      technologies: [],
      imageUrl: '',
      link: '',
      github: ''
    });
    setShowProjectModal(true);
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectTechnologies = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const tech = e.target.value.trim();
      if (!currentProject.technologies?.includes(tech)) {
        setCurrentProject(prev => ({
          ...prev,
          technologies: [...(prev.technologies || []), tech]
        }));
      }
      e.target.value = '';
    }
  };

  const removeProjectTechnology = (tech) => {
    setCurrentProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const saveProject = () => {
    if (currentProject.id) {
      setFormData(prev => ({
        ...prev,
        projects: prev.projects.map(p => 
          p.id === currentProject.id ? currentProject : p
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, currentProject]
      }));
    }
    setShowProjectModal(false);
  };

  const deleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setFormData(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== projectId)
      }));
    }
  };

  // Experience handlers
  const openExperienceModal = (experience = null) => {
    setCurrentExperience(experience || {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    });
    setShowExperienceModal(true);
  };

  const handleExperienceChange = (e) => {
    const { name, type, value, checked } = e.target;
    setCurrentExperience(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleExperienceAchievement = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const achievement = e.target.value.trim();
      if (!currentExperience.achievements?.includes(achievement)) {
        setCurrentExperience(prev => ({
          ...prev,
          achievements: [...(prev.achievements || []), achievement]
        }));
      }
      e.target.value = '';
    }
  };

  const removeExperienceAchievement = (achievement) => {
    setCurrentExperience(prev => ({
      ...prev,
      achievements: prev.achievements.filter(a => a !== achievement)
    }));
  };

  const saveExperience = () => {
    if (currentExperience.id) {
      setFormData(prev => ({
        ...prev,
        experience: prev.experience.map(e => 
          e.id === currentExperience.id ? currentExperience : e
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, currentExperience]
      }));
    }
    setShowExperienceModal(false);
  };

  const deleteExperience = (experienceId) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      setFormData(prev => ({
        ...prev,
        experience: prev.experience.filter(e => e.id !== experienceId)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updatedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        updatedAt: new Date().toISOString()
      };
      await updatePortfolio(id, updatedData);
      setSaving(false);
      navigate(`/portfolio/${id}`);
    } catch (error) {
      console.error('Error updating portfolio:', error);
      setSaving(false);
    }
  };

  const nextTab = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab(prev => prev + 1);
    }
  };

  const prevTab = () => {
    if (activeTab > 0) {
      setActiveTab(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  const renderField = (field) => (
    <div key={field.name} className="space-y-2">
      <label className="flex items-center gap-2 font-medium text-gray-700">
        {field.icon}
        {field.label}
      </label>
      
      {field.type === 'textarea' ? (
        <textarea
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm bg-white"
          placeholder={field.placeholder}
        />
      ) : field.type === 'tags' ? (
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <input
              id="tag-input"
              type="text"
              placeholder={field.placeholder}
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <button
              type="button"
              onClick={addTag}
              className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-24 bg-gray-50">
            {formData.skills && formData.skills.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, i) => (
              <div 
                key={i}
                className="flex items-center gap-1 bg-white text-gray-800 px-3 py-1.5 rounded-full text-sm border border-gray-200 shadow-sm group hover:border-blue-300 transition-all"
              >
                <Sparkles size={14} className="text-blue-500" />
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {!formData.skills && 
              <p className="text-gray-400 text-sm p-2">Add your skills by typing them above and pressing Enter</p>
            }
          </div>
        </div>
      ) : (
        <input
          type="text"
          name={field.name}
          value={formData[field.name] || ''}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm bg-white"
          placeholder={field.placeholder}
        />
      )}
    </div>
  );

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">My Projects</h3>
        <button
          type="button"
          onClick={() => openProjectModal()}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      {formData.projects.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Code size={40} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">No projects yet</h3>
          <p className="text-gray-500 mt-1 mb-4">Showcase your best work by adding some projects</p>
          <button
            type="button"
            onClick={() => openProjectModal()}
            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={16} />
            <span>Add Your First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.projects.map(project => (
            <div key={project.id} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition-all">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={project.imageUrl || '/api/placeholder/300/200'}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => openProjectModal(project)}
                    className="p-2 bg-white bg-opacity-90 rounded-full shadow-sm hover:bg-blue-100 transition"
                  >
                    <Edit3 size={16} className="text-blue-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProject(project.id)}
                    className="p-2 bg-white bg-opacity-90 rounded-full shadow-sm hover:bg-red-100 transition"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-900">{project.title}</h4>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderExperienceTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Work Experience</h3>
        <button
          type="button"
          onClick={() => openExperienceModal()}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={16} />
          <span>Add Experience</span>
        </button>
      </div>

      {formData.experience.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Briefcase size={40} className="mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium text-gray-700">No experience entries yet</h3>
          <p className="text-gray-500 mt-1 mb-4">Add your work history to showcase your professional journey</p>
          <button
            type="button"
            onClick={() => openExperienceModal()}
            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={16} />
            <span>Add Your First Position</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.experience
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .map(exp => (
              <div key={exp.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-all">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{exp.position}</h4>
                    <p className="text-gray-700">{exp.company}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span>
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {
                          exp.current 
                            ? 'Present' 
                            : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        }
                      </span>
                      {exp.location && (
                        <>
                          <span className="text-gray-400">•</span>
                          <MapPin size={14} />
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openExperienceModal(exp)}
                      className="p-2 bg-gray-50 rounded-full shadow-sm hover:bg-blue-100 transition"
                    >
                      <Edit3 size={16} className="text-blue-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteExperience(exp.id)}
                      className="p-2 bg-gray-50 rounded-full shadow-sm hover:bg-red-100 transition"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
                
                {exp.description && (
                  <p className="mt-3 text-sm text-gray-600">{exp.description}</p>
                )}
                
                {exp.achievements && exp.achievements.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Key Achievements:</h5>
                    <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(`/portfolio/${id}`)}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </button>
        
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex items-center gap-4">
              <img
                src={formData.imageUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold">Edit Portfolio</h1>
                <p className="text-blue-100 mt-1">
                  Update your professional information
                </p>
              </div>
            </div>
          </div>
          
          {/* Tab navigation */}
          <div className="bg-white border-b border-gray-200 overflow-x-auto">
            <div className="flex">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center gap-2 py-4 px-6 transition-all ${
                    activeTab === index
                      ? 'border-b-2 border-blue-600 text-blue-700 font-medium'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Form content */}
          <form onSubmit={handleSubmit}>
            <div className="p-8">
              {activeTab <= 2 && (
                <div className="space-y-6">
                  {formSections[activeTab].map(renderField)}
                </div>
              )}
              
              {activeTab === 3 && renderProjectsTab()}
              {activeTab === 4 && renderExperienceTab()}
            </div>
            
            {/* Navigation and submit buttons */}
            <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-t border-gray-200">
              <div>
                {activeTab > 0 && (
                  <button
                    type="button"
                    onClick={prevTab}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition shadow-sm"
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                {activeTab < tabs.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextTab}
                    className="flex items-center gap-1 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white transition shadow-sm ${
                      saving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Save Portfolio</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {currentProject.id ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                <div className="flex items-center gap-3">
                  <img
                    src={currentProject.imageUrl || '/api/placeholder/300/200'}
                    alt="Project preview"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      name="imageUrl"
                      value={currentProject.imageUrl || ''}
                      onChange={handleProjectChange}
                      placeholder="Image URL or leave default"
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter an image URL or leave blank for default</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={currentProject.title || ''}
                  onChange={handleProjectChange}
                  placeholder="e.g. E-commerce Website"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={currentProject.description || ''}
                  onChange={handleProjectChange}
                  rows={3}
                  placeholder="Describe your project and your role in it"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
                <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50 mb-2 min-h-16">
                  {currentProject.technologies && currentProject.technologies.map((tech, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-1 bg-white text-gray-800 px-2 py-1 rounded-full text-sm border border-gray-200"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeProjectTechnology(tech)}
                        className="ml-1 text-red-500 hover:bg-red-50 rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <input
                  type="text"
                  placeholder="Type a technology and press Enter"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onKeyDown={handleProjectTechnologies}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
                <input
                  type="url"
                  name="link"
                  value={currentProject.link || ''}
                  onChange={handleProjectChange}
                  placeholder="https://your-project-url.com"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repository</label>
                <input
                  type="url"
                  name="github"
                  value={currentProject.github || ''}
                  onChange={handleProjectChange}
                  placeholder="https://github.com/username/repo"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveProject}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {currentProject.id ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {showExperienceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {currentExperience.id ? 'Edit Experience' : 'Add New Experience'}
              </h3>
              <button
                type="button"
                onClick={() => setShowExperienceModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  value={currentExperience.company || ''}
                  onChange={handleExperienceChange}
                  placeholder="e.g. Google"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                <input
                  type="text"
                  name="position"
                  value={currentExperience.position || ''}
                  onChange={handleExperienceChange}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={currentExperience.location || ''}
                  onChange={handleExperienceChange}
                  placeholder="e.g. New York, NY"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={currentExperience.startDate || ''}
                    onChange={handleExperienceChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={currentExperience.endDate || ''}
                    onChange={handleExperienceChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    disabled={currentExperience.current}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="current"
                  name="current"
                  checked={currentExperience.current || false}
                  onChange={handleExperienceChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="current" className="ml-2 text-sm text-gray-700">
                  I currently work here
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={currentExperience.description || ''}
                  onChange={handleExperienceChange}
                  rows={3}
                  placeholder="Describe your role and responsibilities"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Achievements</label>
                <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50 mb-2 min-h-16">
                  {currentExperience.achievements && currentExperience.achievements.map((achievement, i) => (
                    <div 
                      key={i}
                      className="flex items-center gap-1 bg-white text-gray-800 px-2 py-1 rounded-full text-sm border border-gray-200"
                    >
                      <span>{achievement}</span>
                      <button
                        type="button"
                        onClick={() => removeExperienceAchievement(achievement)}
                        className="ml-1 text-red-500 hover:bg-red-50 rounded-full p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <input
                  type="text"
                  placeholder="Type an achievement and press Enter"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onKeyDown={handleExperienceAchievement}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowExperienceModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveExperience}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {currentExperience.id ? 'Update Experience' : 'Add Experience'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPortfolio;