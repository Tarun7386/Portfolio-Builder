
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { 
  User, Briefcase, FileText, Mail, Phone, MapPin, Linkedin, Github,
  Code, X, ChevronRight, ChevronLeft, Save, ArrowLeft, Plus, 
  Sparkles, Calendar, Trash2, Edit, Camera, CheckCircle
} from 'lucide-react';

const EditPortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    about: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    skills: [],
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
    { name: 'Skills', icon: <Code size={18} /> },
    { name: 'Projects', icon: <Briefcase size={18} /> },
    { name: 'Experience', icon: <Calendar size={18} /> }
  ];

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        if (id !== auth.currentUser?.uid) {
          throw new Error('Unauthorized access');
        }
        
        const docRef = doc(db, 'portfolios', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const portfolioData = docSnap.data();
          
          // Ensure skills is an array
          let skills = portfolioData.skills || [];
          if (typeof skills === 'string') {
            skills = skills.split(',').map(skill => skill.trim()).filter(Boolean);
          }
          
          setFormData({
            ...portfolioData,
            skills,
            projects: portfolioData.projects || [],
            experience: portfolioData.experience || []
          });
        } else {
          navigate('/form');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading portfolio:', error);
        setLoading(false);
        navigate('/');
      }
    };
    
    loadPortfolio();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setSaving(true);
      const storageRef = ref(storage, `profile-images/${id}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setFormData(prev => ({
        ...prev,
        imageUrl: downloadURL
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setSaving(false);
    }
  };

  // Skills management
  const handleAddSkill = () => {
    const skillInput = document.getElementById('skill-input');
    if (!skillInput || !skillInput.value.trim()) return;
    
    const newSkill = skillInput.value.trim();
    if (!formData.skills.includes(newSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
    }
    
    skillInput.value = '';
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Project functions
  const openProjectModal = (project = null) => {
    setCurrentProject(project || {
      id: Date.now().toString(),
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

  const handleAddProjectTechnology = () => {
    const techInput = document.getElementById('project-tech-input');
    if (!techInput || !techInput.value.trim()) return;
    
    const newTech = techInput.value.trim();
    if (!currentProject.technologies.includes(newTech)) {
      setCurrentProject(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTech]
      }));
    }
    
    techInput.value = '';
  };

  const removeProjectTechnology = (tech) => {
    setCurrentProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const saveProject = () => {
    if (currentProject) {
      const projectExists = formData.projects.some(p => p.id === currentProject.id);
      
      if (projectExists) {
        // Update existing project
        setFormData(prev => ({
          ...prev,
          projects: prev.projects.map(p => p.id === currentProject.id ? currentProject : p)
        }));
      } else {
        // Add new project
        setFormData(prev => ({
          ...prev,
          projects: [...prev.projects, currentProject]
        }));
      }
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

  // Experience functions
  const openExperienceModal = (experience = null) => {
    setCurrentExperience(experience || {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      details: []
    });
    setShowExperienceModal(true);
  };

  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentExperience(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddExperienceDetail = () => {
    const detailInput = document.getElementById('experience-detail-input');
    if (!detailInput || !detailInput.value.trim()) return;
    
    const newDetail = detailInput.value.trim();
    setCurrentExperience(prev => ({
      ...prev,
      details: [...(prev.details || []), newDetail]
    }));
    
    detailInput.value = '';
  };

  const removeExperienceDetail = (detail) => {
    setCurrentExperience(prev => ({
      ...prev,
      details: prev.details.filter(d => d !== detail)
    }));
  };

  const saveExperience = () => {
    if (currentExperience) {
      const experienceExists = formData.experience.some(e => e.id === currentExperience.id);
      
      if (experienceExists) {
        // Update existing experience
        setFormData(prev => ({
          ...prev,
          experience: prev.experience.map(e => 
            e.id === currentExperience.id ? currentExperience : e
          )
        }));
      } else {
        // Add new experience
        setFormData(prev => ({
          ...prev,
          experience: [...prev.experience, currentExperience]
        }));
      }
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
        updatedAt: new Date().toISOString()
      };
      
      const portfolioRef = doc(db, 'portfolios', id);
      await updateDoc(portfolioRef, updatedData);
      
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

  // Render functions for each tab
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={formData.imageUrl || '/api/placeholder/200/200'}
            alt={formData.name || 'Profile'}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
          />
          <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer">
            <Camera size={16} />
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
        
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="e.g., Frontend Developer"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About Me
        </label>
        <textarea
          name="about"
          value={formData.about || ''}
          onChange={handleChange}
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Write a brief introduction about yourself"
        />
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="your.email@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone (Optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="+1 (123) 456-7890"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location (Optional)
        </label>
        <input
          type="text"
          name="location"
          value={formData.location || ''}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="City, Country"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn URL (Optional)
          </label>
          <input
            type="url"
            name="linkedin"
            value={formData.linkedin || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="https://linkedin.com/in/yourusername"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub URL (Optional)
          </label>
          <input
            type="url"
            name="github"
            value={formData.github || ''}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="https://github.com/yourusername"
          />
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <label className="block text-sm font-medium text-gray-700">
        Skills
      </label>
      
      <div className="flex gap-2">
        <input
          id="skill-input"
          type="text"
          className="flex-grow p-3 border border-gray-300 rounded-lg"
          placeholder="Add skills one by one"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddSkill();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="bg-blue-600 text-white p-3 rounded-lg"
        >
          <Plus size={18} />
        </button>
      </div>
      
      <div className="p-4 border border-gray-300 rounded-lg min-h-32 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <div 
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
            >
              <Sparkles size={14} className="mr-1" />
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 hover:text-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {formData.skills.length === 0 && (
            <p className="text-gray-500 text-sm">Add your skills above</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-700">Projects</h3>
        <button
          type="button"
          onClick={() => openProjectModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Project
        </button>
      </div>
      
      {formData.projects.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-700">No projects yet</h4>
          <p className="text-gray-500 mb-4">Showcase your work by adding projects</p>
          <button
            type="button"
            onClick={() => openProjectModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.projects.map(project => (
            <div key={project.id} className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-800">{project.title}</h4>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => openProjectModal(project)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProject(project.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
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

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="p-4 border-b border-gray-300 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {currentProject.id ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentProject.title || ''}
                  onChange={handleProjectChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., E-commerce Website"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={currentProject.description || ''}
                  onChange={handleProjectChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Describe your project and your role in it"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies Used
                </label>
                <div className="flex gap-2">
                  <input
                    id="project-tech-input"
                    type="text"
                    className="flex-grow p-2 border border-gray-300 rounded-lg"
                    placeholder="Add technologies one by one"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddProjectTechnology();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddProjectTechnology}
                    className="bg-blue-600 text-white p-2 rounded-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentProject.technologies && currentProject.technologies.map((tech, i) => (
                    <div 
                      key={i}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeProjectTechnology(tech)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={currentProject.imageUrl || ''}
                  onChange={handleProjectChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Link (Optional)
                </label>
                <input
                  type="url"
                  name="link"
                  value={currentProject.link || ''}
                  onChange={handleProjectChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Repository (Optional)
                </label>
                <input
                  type="url"
                  name="github"
                  value={currentProject.github || ''}
                  onChange={handleProjectChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-300 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-700">Work Experience</h3>
        <button
          type="button"
          onClick={() => openExperienceModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Experience
        </button>
      </div>
      
      {formData.experience.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-700">No experience entries yet</h4>
          <p className="text-gray-500 mb-4">Add your work history</p>
          <button
            type="button"
            onClick={() => openExperienceModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Your First Position
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.experience
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .map(exp => (
              <div key={exp.id} className="border border-gray-300 rounded-lg p-4 bg-white">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{exp.position}</h4>
                    <p className="text-gray-700">{exp.company}</p>
                    <div className="text-sm text-gray-600 mt-1">
                      {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {
                        exp.current 
                          ? 'Present' 
                          : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      }
                      {exp.location && ` • ${exp.location}`}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => openExperienceModal(exp)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteExperience(exp.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {exp.details && exp.details.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Details:</h5>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      {exp.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Experience Modal */}
      {showExperienceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="p-4 border-b border-gray-300 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {currentExperience.id ? 'Edit Experience' : 'Add New Experience'}
              </h3>
              <button
                type="button"
                onClick={() => setShowExperienceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  value={currentExperience.company || ''}
                  onChange={handleExperienceChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Google"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <input
                  type="text"
                  name="position"
                  value={currentExperience.position || ''}
                  onChange={handleExperienceChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Senior Frontend Developer"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  name="location"
                  value={currentExperience.location || ''}
                  onChange={handleExperienceChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., New York, NY"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
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
                  id="current-position"
                  name="current"
                  checked={currentExperience.current || false}
                  onChange={handleExperienceChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="current-position" className="ml-2 text-sm text-gray-700">
                  I currently work here
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Details
                </label>
                <div className="flex gap-2">
                  <input
                    id="experience-detail-input"
                    type="text"
                    className="flex-grow p-2 border border-gray-300 rounded-lg"
                    placeholder="Add details one by one"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddExperienceDetail();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddExperienceDetail}
                    className="bg-blue-600 text-white p-2 rounded-lg"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className="mt-2 space-y-2">
                  {currentExperience.details && currentExperience.details.map((detail, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm">{detail}</span>
                      <button
                        type="button"
                        onClick={() => removeExperienceDetail(detail)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-300 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowExperienceModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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

  const renderActiveTab = () => {
    switch (activeTab) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderContactInfo();
      case 2:
        return renderSkills();
      case 3:
        return renderProjects();
      case 4:
        return renderExperience();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          type="button"
          onClick={() => navigate(`/portfolio/${id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Portfolio
        </button>
        
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <h1 className="text-3xl font-bold">Edit Your Portfolio</h1>
            <p className="text-blue-100 mt-1">Update your professional information</p>
          </div>
          
          <div className="flex border-b border-gray-200">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex items-center py-4 px-6 transition-colors ${
                  activeTab === index 
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.name}</span>
              </button>
            ))}
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="p-8">
              {renderActiveTab()}
            </div>
            
            <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-t border-gray-200">
              <div>
                {activeTab > 0 && (
                  <button
                    type="button"
                    onClick={prevTab}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                {activeTab < tabs.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextTab}
                    className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={saving}
                    className={`flex items-center px-6 py-2 rounded-lg text-white ${
                      saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPortfolio;