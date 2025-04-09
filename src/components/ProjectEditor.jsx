// src/components/ProjectEditor.jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Link2, Github, Image as ImageIcon, ExternalLink, 
  Calendar, Tag, User, UploadCloud, Check, Paperclip, Trash2, DragDropIcon, Loader
} from 'lucide-react';

const ProjectEditor = ({ 
  project = {}, 
  onSave, 
  onCancel,
  isOpen = false
}) => {
  const [formData, setFormData] = useState({
    id: project.id || Date.now(),
    title: project.title || '',
    description: project.description || '',
    technologies: project.technologies || [],
    imageUrl: project.imageUrl || '',
    link: project.link || '',
    github: project.github || '',
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    collaborators: project.collaborators || [],
    role: project.role || '',
    category: project.category || 'web',
    featured: project.featured || false
  });

  const [techInput, setTechInput] = useState('');
  const [collaboratorInput, setCollaboratorInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');
  const [isUnsaved, setIsUnsaved] = useState(false);
  const fileInputRef = useRef(null);
  
  const categories = [
    { id: 'web', name: 'Web Application' },
    { id: 'mobile', name: 'Mobile App' },
    { id: 'design', name: 'Design Project' },
    { id: 'data', name: 'Data Science' },
    { id: 'other', name: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setIsUnsaved(true);
  };

  const handleAddTechnology = () => {
    if (!techInput.trim()) return;
    if (!formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setIsUnsaved(true);
    }
    setTechInput('');
  };

  const handleRemoveTechnology = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
    setIsUnsaved(true);
  };

  const handleAddCollaborator = () => {
    if (!collaboratorInput.trim()) return;
    if (!formData.collaborators.includes(collaboratorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, collaboratorInput.trim()]
      }));
      setIsUnsaved(true);
    }
    setCollaboratorInput('');
  };

  const handleRemoveCollaborator = (collaborator) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter(c => c !== collaborator)
    }));
    setIsUnsaved(true);
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate file upload
    setUploading(true);
    
    // In a real implementation, you would upload to Firebase Storage here
    setTimeout(() => {
      // Mock successful upload with placeholder image
      setFormData(prev => ({
        ...prev,
        imageUrl: '/api/placeholder/800/600'
      }));
      setUploading(false);
      setIsUnsaved(true);
    }, 1500);
  };

  const handleSubmit = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
        >
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {project.id ? 'Edit Project' : 'Add New Project'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex h-[calc(100vh-18rem)] max-h-[700px]">
            {/* Tabs Sidebar */}
            <div className="w-48 bg-gray-50 border-r border-gray-200 py-6 space-y-1">
              <button
                onClick={() => setCurrentTab('basic')}
                className={`w-full text-left px-4 py-2 flex items-center space-x-2 text-sm ${
                  currentTab === 'basic'
                    ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex-1">Basic Information</span>
              </button>
              <button
                onClick={() => setCurrentTab('details')}
                className={`w-full text-left px-4 py-2 flex items-center space-x-2 text-sm ${
                  currentTab === 'details'
                    ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex-1">Details & Links</span>
              </button>
              <button
                onClick={() => setCurrentTab('team')}
                className={`w-full text-left px-4 py-2 flex items-center space-x-2 text-sm ${
                  currentTab === 'team'
                    ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex-1">Team & Role</span>
              </button>
              <button
                onClick={() => setCurrentTab('media')}
                className={`w-full text-left px-4 py-2 flex items-center space-x-2 text-sm ${
                  currentTab === 'media'
                    ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="flex-1">Media</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Basic Information Tab */}
                  {currentTab === 'basic' && (
                    <>
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Project Title*
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="e.g., E-commerce Website"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description*
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={5}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="Describe your project, its purpose, and your contribution..."
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700">
                            Technologies Used
                          </label>
                        </div>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTechnology();
                              }
                            }}
                            className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Add technology (e.g., React, Node.js)"
                          />
                          <button
                            type="button"
                            onClick={handleAddTechnology}
                            className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.technologies.map((tech, i) => (
                            <div 
                              key={i}
                              className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tech}
                              <button
                                type="button"
                                onClick={() => handleRemoveTechnology(tech)}
                                className="ml-1 h-4 w-4 rounded-full hover:bg-blue-200 inline-flex items-center justify-center"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          {formData.technologies.length === 0 && (
                            <span className="text-sm text-gray-500 italic">No technologies added yet</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id="featured"
                              name="featured"
                              type="checkbox"
                              checked={formData.featured}
                              onChange={handleChange}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="featured" className="font-medium text-gray-700">
                              Feature this project
                            </label>
                            <p className="text-gray-500">Highlight this as one of your best works on your portfolio</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Details & Links Tab */}
                  {currentTab === 'details' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                          Live Project URL
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                            <Link2 className="h-4 w-4" />
                          </span>
                          <input
                            type="url"
                            id="link"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            className="block w-full rounded-r-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                          GitHub Repository
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                            <Github className="h-4 w-4" />
                          </span>
                          <input
                            type="url"
                            id="github"
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            className="block w-full rounded-r-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="https://github.com/username/repo"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">Preview Links</h4>
                        </div>
                        <div className="mt-3 bg-gray-50 p-4 rounded-md">
                          {(formData.link || formData.github) ? (
                            <div className="space-y-3">
                              {formData.link && (
                                <a 
                                  href={formData.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View Live Project
                                </a>
                              )}
                              {formData.github && (
                                <a 
                                  href={formData.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                >
                                  <Github className="h-4 w-4 mr-2" />
                                  View Source Code
                                </a>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic">No links added yet</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Team & Role Tab */}
                  {currentTab === 'team' && (
                    <>
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Role
                        </label>
                        <input
                          type="text"
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="e.g., Lead Developer, UI Designer"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700">
                            Collaborators
                          </label>
                        </div>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            value={collaboratorInput}
                            onChange={(e) => setCollaboratorInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCollaborator();
                              }
                            }}
                            className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Add collaborator name"
                          />
                          <button
                            type="button"
                            onClick={handleAddCollaborator}
                            className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {formData.collaborators.map((collaborator, i) => (
                            <div 
                              key={i}
                              className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700"
                            >
                              <User className="h-3 w-3 mr-1" />
                              {collaborator}
                              <button
                                type="button"
                                onClick={() => handleRemoveCollaborator(collaborator)}
                                className="ml-1 h-4 w-4 rounded-full hover:bg-purple-200 inline-flex items-center justify-center"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          {formData.collaborators.length === 0 && (
                            <span className="text-sm text-gray-500 italic">No collaborators added yet</span>
                          )}
                        </div>
                      </div>

                      <div className="pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Team Contributions</h4>
                        <p className="text-sm text-gray-500 mb-3">
                          Describe your specific contributions and responsibilities in this project
                        </p>
                        <textarea
                          rows={4}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="I was responsible for..."
                        />
                      </div>
                    </>
                  )}

                  {/* Media Tab */}
                  {currentTab === 'media' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Image
                        </label>
                        <div className="mt-1 flex justify-center px-6 py-10 border-2 border-gray-300 border-dashed rounded-md">
                          {formData.imageUrl ? (
                            <div className="space-y-2 text-center">
                              <div className="overflow-hidden rounded-md max-w-xs mx-auto">
                                <img
                                  src={formData.imageUrl}
                                  alt="Project preview"
                                  className="h-40 w-full object-cover"
                                />
                              </div>
                              <div className="flex space-x-2 justify-center">
                                <button
                                  type="button"
                                  onClick={handleImageUpload}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <UploadCloud className="h-4 w-4 mr-1" />
                                  Replace
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, imageUrl: '' }));
                                    setIsUnsaved(true);
                                  }}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1 text-center">
                              {uploading ? (
                                <div className="text-center">
                                  <Loader className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                                  <p className="mt-2 text-sm text-gray-500">Uploading image...</p>
                                </div>
                              ) : (
                                <>
                                  <div className="flex text-sm text-gray-600">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                  </div>
                                  <div className="flex text-sm text-gray-600">
                                    <label
                                      htmlFor="file-upload"
                                      className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                    >
                                      <span>Upload a file</span>
                                      <input 
                                        id="file-upload" 
                                        name="file-upload" 
                                        type="file" 
                                        className="sr-only"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                      />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    PNG, JPG, GIF up to 10MB
                                  </p>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          id="imageUrl"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="https://example.com/image.jpg"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Enter a direct URL to an image or upload one above
                        </p>
                      </div>

                      {/* Additional media could be added here (screenshots, videos, etc.) */}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
            <div>
              {isUnsaved && (
                <span className="text-sm text-amber-600 flex items-center">
                  <span className="h-2 w-2 bg-amber-600 rounded-full mr-2"></span>
                  Unsaved changes
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {project.id ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectEditor;