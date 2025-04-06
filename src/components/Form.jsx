import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPortfolio, updatePortfolio, addPortfolio } from "../portfolioService";
import {
  User,
  Briefcase,
  FileText,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Code,
  Building,
  FolderPlus,
  Camera,
  Sparkles,
  CheckCircle
} from "lucide-react";

const PortfolioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [activeStep, setActiveStep] = useState(0);
  const [formComplete, setFormComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    about: "",
    email: "",
    imageUrl:"",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    skills: "",
    experience: "",
    projects: "",
    profileImage: "/api/placeholder/200/200"
  });

  // const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Steps configuration
  const steps = [
    { title: "Personal Info", icon: <User size={20} /> },
    { title: "Contact Details", icon: <Mail size={20} /> },
    { title: "Professional", icon: <Briefcase size={20} /> },
    { title: "Showcase", icon: <FolderPlus size={20} /> }
  ];

  // Form field configuration with icons and helper text
  const formSections = useMemo(() => [
    // Step 1: Personal Info
    [
      {
        label: "Profile Image",
        name: "profileImage",
        type: "image",
        icon: <Camera size={18} />,
        helper: "Upload a professional headshot (square format recommended)"
      },
      {
        label: "Full Name",
        name: "name",
        icon: <User size={18} />,
        helper: "Enter your full professional name (e.g., John Smith)"
      },
      {
        label: "Professional Title",
        name: "title",
        icon: <Briefcase size={18} />,
        helper: "Your current role or specialty (e.g., Full Stack Developer)"
      },
      {
        label: "About Me",
        name: "about",
        type: "textarea",
        icon: <FileText size={18} />,
        helper: "Write a concise professional summary (2-3 paragraphs)"
      }
    ],
    // Step 2: Contact Details
    [
      {
        label: "Email",
        name: "email",
        icon: <Mail size={18} />,
        helper: "Your professional email address"
      },
      {
        label: "Phone",
        name: "phone",
        icon: <Phone size={18} />,
        helper: "Your contact number with country code (e.g., +1 555-123-4567)"
      },
      {
        label: "Location",
        name: "location",
        icon: <MapPin size={18} />,
        helper: "City, State/Province, Country (e.g., Seattle, WA, USA)"
      },
      {
        label: "LinkedIn URL",
        name: "linkedin",
        icon: <Linkedin size={18} />,
        helper: "Full URL to your LinkedIn profile"
      },
      {
        label: "GitHub URL",
        name: "github",
        icon: <Github size={18} />,
        helper: "Full URL to your GitHub profile"
      }
    ],
    // Step 3: Professional Skills
    [
      {
        label: "Skills",
        name: "skills",
        icon: <Code size={18} />,
        type: "commaSkills",
        helper: "List your technical and soft skills, separated by commas (e.g., React, JavaScript, UI/UX)"
      }
    ],
    // Step 4: Showcase
    [
      {
        label: "Experience",
        name: "experience",
        type: "textarea",
        icon: <Building size={18} />,
        helper: "List your work experience in chronological order"
      },
      {
        label: "Projects",
        name: "projects",
        type: "textarea",
        icon: <FolderPlus size={18} />,
        helper: "List your notable projects with descriptions"
      }
    ]
  ], []);

  useEffect(() => {
    if (id) {
      const loadPortfolio = async () => {
        try {
          const data = await getPortfolio(id);
          if (data) {
            setFormData({
              ...data,
              skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills,
              imageUrl: data.imageUrl || ""
            });
          }
          setLoading(false);
        } catch (error) {
          console.error('Error loading portfolio:', error);
          setLoading(false);
        }
      };
      loadPortfolio();
    }
  }, [id]);

  // Check if the current step is complete
  useEffect(() => {
    const currentStepFields = formSections[activeStep].map(field => field.name);
    const isStepComplete = currentStepFields.every(
      fieldName => formData[fieldName] && formData[fieldName].trim() !== ''
    );
    setFormComplete(isStepComplete);
  }, [formData, activeStep, formSections]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = formData.skills
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== tagToRemove)
      .join(', ');
    
    setFormData(prev => ({ ...prev, skills: updatedTags }));
  };

  const goToNextStep = (e) => {
    if (e) e.preventDefault(); // Add this line
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const goToPrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const validateForm = (data) => {
    const errors = {};
    
    if (!data.name?.trim()) errors.name = 'Name is required';
    if (!data.title?.trim()) errors.title = 'Title is required';
    if (!data.email?.trim()) errors.email = 'Email is required';
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const processedData = {
        ...formData,
         // Assuming you have auth context
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        updatedAt: new Date().toISOString()
      };
      
      if (id) {
        await updatePortfolio(id, processedData);
        navigate(`/portfolio/${id}`);
      } else {
        const newId = await addPortfolio(processedData);
        navigate(`/portfolio/${newId}`);
      }
    } catch (error) {
      console.error('Error saving portfolio:', error);
      setErrors({ submit: error.message });
    }
  };

  const renderImageUpload = () => (
    <div className="flex flex-col items-center space-y-3">
      <img 
        src={formData.imageUrl || formData.profileImage} 
        alt="Profile preview" 
        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" 
      />

      <input
        type="text"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="Enter image URL"
      />

      <button 
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm flex items-center gap-2"
      >
        <Camera size={16} />
        Upload Image
      </button>
      {errors.image && (
        <p className="text-red-500 text-sm">{errors.image}</p>
      )}
    </div>
  );

  const renderField = (field) => (
    <div key={field.name} className="space-y-2">
      <label className="flex items-center gap-2 text-gray-700 font-medium">
        {field.icon}
        {field.label}
      </label>

      {field.type === "textarea" ? (
        <textarea
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          rows={5}
          className={`w-full p-3 border rounded-lg transition ${
            errors[field.name] 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder={`Enter your ${field.label.toLowerCase()}`}
        />
      ) : field.type === "image" ? (
        renderImageUpload()
      ) : field.type === "commaSkills" ? (
        <div className="space-y-3">
          <div className="mb-2">
            <input
              type="text"
              name="skills"
              value={formData.skills || ""}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg transition ${
                errors.skills 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter skills separated by commas (e.g., React, JavaScript, CSS)"
            />
          </div>
          
          {/* Display skills as tags */}
          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-12">
            {formData.skills && formData.skills.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, i) => (
              <div 
                key={i} 
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1 group"
              >
                <Sparkles size={14} />
                {tag}
                <button 
                  type="button" 
                  onClick={() => removeTag(tag)}
                  className="ml-1 rounded-full hover:bg-blue-200 p-1"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <input
          type="text"
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg transition ${
            errors[field.name] 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder={`Enter your ${field.label.toLowerCase()}`}
        />
      )}

      {errors[field.name] && (
        <p className="text-red-500 text-sm">{errors[field.name]}</p>
      )}
      <p className="text-sm text-gray-500">{field.helper}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50">
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header with title */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-3xl font-bold">
            {id ? "Edit Your Portfolio" : "Create Your Portfolio"}
          </h1>
          <p className="opacity-80">
            {id ? "Update your professional profile" : "Build your professional presence online"}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex border-b border-gray-200">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              type="button"  
              className={`flex-1 text-center py-4 px-2 flex flex-col items-center justify-center transition-all duration-200 ${
                activeStep === index
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : index < activeStep
                  ? "text-green-500"
                  : "text-gray-500"
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full mb-1">
                {index < activeStep ? (
                  <CheckCircle size={20} className="text-green-500" />
                ) : (
                  step.icon
                )}
              </div>
              <span className="text-sm font-medium hidden md:block">{step.title}</span>
              <span className="text-xs md:hidden">{step.title}</span>
            </button>
          ))}
        </div>

        <form onSubmit={(e) => {
    if (activeStep < steps.length - 1) {
      e.preventDefault();
      return;
    }
    handleSubmit(e);
  }} className="p-6 space-y-6">
          {formSections[activeStep].map(renderField)}

          <div className="flex justify-between items-center pt-4">
            {activeStep > 0 && (
              <button
                type="button"
                onClick={goToPrevStep}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
              >
                Previous
              </button>
            )}
            
            {activeStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault(); // Add this to prevent form submission
                  goToNextStep();
                }}
                disabled={!formComplete}
                className={`px-6 py-2 rounded text-white transition ${
                  formComplete
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                {id ? "Update Portfolio" : "Submit Portfolio"}
              </button>
            )}
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PortfolioForm;