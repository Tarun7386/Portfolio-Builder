// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getPortfolio } from "../portfolioService";
// import { setDoc, doc } from "firebase/firestore";
// import { auth, db } from "../firebase"; // Ensure you import the auth and db from your firebase config
// import {
//   User,
//   Briefcase,
//   FileText,
//   Mail,
//   Phone,
//   MapPin,
//   Linkedin,
//   Github,
//   Code,
//   Building,
//   FolderPlus,
//   Camera,
//   Sparkles,
//   CheckCircle
// } from "lucide-react";

// const PortfolioForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(!!id);
//   const [activeStep, setActiveStep] = useState(0);
//   const [formComplete, setFormComplete] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     title: "",
//     about: "",
//     email: "",
//     imageUrl:"",
//     phone: "",
//     location: "",
//     linkedin: "",
//     github: "",
//     skills: "",
//     experience: "",
//     projects: "",
//     profileImage: "/api/placeholder/200/200"
//   });

//   // const [imageFile, setImageFile] = useState(null);
//   const [errors, setErrors] = useState({});
//   const fileInputRef = useRef(null);

//   // Steps configuration
//   const steps = [
//     { title: "Personal Info", icon: <User size={20} /> },
//     { title: "Contact Details", icon: <Mail size={20} /> },
//     { title: "Professional", icon: <Briefcase size={20} /> },
//     { title: "Showcase", icon: <FolderPlus size={20} /> }
//   ];

//   // Form field configuration with icons and helper text
//   const formSections = useMemo(() => [
//     // Step 1: Personal Info
//     [
//       {
//         label: "Profile Image",
//         name: "profileImage",
//         type: "image",
//         icon: <Camera size={18} />,
//         helper: "Upload a professional headshot (square format recommended)"
//       },
//       {
//         label: "Full Name",
//         name: "name",
//         icon: <User size={18} />,
//         helper: "Enter your full professional name (e.g., John Smith)"
//       },
//       {
//         label: "Professional Title",
//         name: "title",
//         icon: <Briefcase size={18} />,
//         helper: "Your current role or specialty (e.g., Full Stack Developer)"
//       },
//       {
//         label: "About Me",
//         name: "about",
//         type: "textarea",
//         icon: <FileText size={18} />,
//         helper: "Write a concise professional summary (2-3 paragraphs)"
//       }
//     ],
//     // Step 2: Contact Details
//     [
//       {
//         label: "Email",
//         name: "email",
//         icon: <Mail size={18} />,
//         helper: "Your professional email address"
//       },
//       {
//         label: "Phone",
//         name: "phone",
//         icon: <Phone size={18} />,
//         helper: "Your contact number with country code (e.g., +1 555-123-4567)"
//       },
//       {
//         label: "Location",
//         name: "location",
//         icon: <MapPin size={18} />,
//         helper: "City, State/Province, Country (e.g., Seattle, WA, USA)"
//       },
//       {
//         label: "LinkedIn URL",
//         name: "linkedin",
//         icon: <Linkedin size={18} />,
//         helper: "Full URL to your LinkedIn profile"
//       },
//       {
//         label: "GitHub URL",
//         name: "github",
//         icon: <Github size={18} />,
//         helper: "Full URL to your GitHub profile"
//       }
//     ],
//     // Step 3: Professional Skills
//     [
//       {
//         label: "Skills",
//         name: "skills",
//         icon: <Code size={18} />,
//         type: "commaSkills",
//         helper: "List your technical and soft skills, separated by commas (e.g., React, JavaScript, UI/UX)"
//       }
//     ],
//     // Step 4: Showcase
//     [
//       {
//         label: "Experience",
//         name: "experience",
//         type: "textarea",
//         icon: <Building size={18} />,
//         helper: "List your work experience in chronological order"
//       },
//       {
//         label: "Projects",
//         name: "projects",
//         type: "textarea",
//         icon: <FolderPlus size={18} />,
//         helper: "List your notable projects with descriptions"
//       }
//     ]
//   ], []);

//   useEffect(() => {
//     if (id) {
//       const loadPortfolio = async () => {
//         try {
//           const data = await getPortfolio(id);
//           if (data) {
//             setFormData({
//               ...data,
//               skills: Array.isArray(data.skills) ? data.skills.join(', ') : data.skills,
//               imageUrl: data.imageUrl || ""
//             });
//           }
//           setLoading(false);
//         } catch (error) {
//           console.error('Error loading portfolio:', error);
//           setLoading(false);
//         }
//       };
//       loadPortfolio();
//     }
//   }, [id]);

//   // Check if the current step is complete
//   useEffect(() => {
//     const currentStepFields = formSections[activeStep].map(field => field.name);
//     const isStepComplete = currentStepFields.every(
//       fieldName => formData[fieldName] && formData[fieldName].trim() !== ''
//     );
//     setFormComplete(isStepComplete);
//   }, [formData, activeStep, formSections]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const removeTag = (tagToRemove) => {
//     const updatedTags = formData.skills
//       .split(',')
//       .map(tag => tag.trim())
//       .filter(tag => tag !== tagToRemove)
//       .join(', ');
    
//     setFormData(prev => ({ ...prev, skills: updatedTags }));
//   };

//   const goToNextStep = (e) => {
//     if (e) e.preventDefault(); // Add this line
//     if (activeStep < steps.length - 1) {
//       setActiveStep(prev => prev + 1);
//     }
//   };

//   const goToPrevStep = () => {
//     if (activeStep > 0) {
//       setActiveStep(prev => prev - 1);
//     }
//   };

//   const validateForm = (data) => {
//     const errors = {};
    
//     if (!data.name?.trim()) errors.name = 'Name is required';
//     if (!data.title?.trim()) errors.title = 'Title is required';
//     if (!data.email?.trim()) errors.email = 'Email is required';
//     if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
//       errors.email = 'Invalid email format';
//     }
    
//     return errors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm(formData);
    
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const currentUser = auth.currentUser;
//       if (!currentUser) {
//         throw new Error('No authenticated user found');
//       }

//       const processedData = {
//         ...formData,
//         userId: currentUser.uid,
//         id: currentUser.uid, // Use user's UID as portfolio ID
//         skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };
      
//       // Create/update the portfolio document with the user's UID as the document ID
//       await setDoc(doc(db, 'portfolios', currentUser.uid), processedData);
      
//       // Navigate to the portfolio page using the user's UID
//       navigate(`/portfolio/${currentUser.uid}`);
//     } catch (error) {
//       console.error('Error saving portfolio:', error);
//       setErrors({ submit: error.message });
//     }
//   };

//   const renderImageUpload = () => (
//     <div className="flex flex-col items-center space-y-3">
//       <img 
//         src={formData.imageUrl || formData.profileImage} 
//         alt="Profile preview" 
//         className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" 
//       />

//       <input
//         type="text"
//         name="imageUrl"
//         value={formData.imageUrl}
//         onChange={handleChange}
//         placeholder="Enter image URL"
//       />

//       <button 
//         type="button"
//         onClick={() => fileInputRef.current?.click()}
//         className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm flex items-center gap-2"
//       >
//         <Camera size={16} />
//         Upload Image
//       </button>
//       {errors.image && (
//         <p className="text-red-500 text-sm">{errors.image}</p>
//       )}
//     </div>
//   );

//   const renderField = (field) => (
//     <div key={field.name} className="space-y-2">
//       <label className="flex items-center gap-2 text-gray-700 font-medium">
//         {field.icon}
//         {field.label}
//       </label>

//       {field.type === "textarea" ? (
//         <textarea
//           name={field.name}
//           value={formData[field.name] || ""}
//           onChange={handleChange}
//           rows={5}
//           className={`w-full p-3 border rounded-lg transition ${
//             errors[field.name] 
//               ? 'border-red-500 focus:ring-red-500' 
//               : 'border-gray-300 focus:ring-blue-500'
//           }`}
//           placeholder={`Enter your ${field.label.toLowerCase()}`}
//         />
//       ) : field.type === "image" ? (
//         renderImageUpload()
//       ) : field.type === "commaSkills" ? (
//         <div className="space-y-3">
//           <div className="mb-2">
//             <input
//               type="text"
//               name="skills"
//               value={formData.skills || ""}
//               onChange={handleChange}
//               className={`w-full p-3 border rounded-lg transition ${
//                 errors.skills 
//                   ? 'border-red-500 focus:ring-red-500' 
//                   : 'border-gray-300 focus:ring-blue-500'
//               }`}
//               placeholder="Enter skills separated by commas (e.g., React, JavaScript, CSS)"
//             />
//           </div>
          
//           {/* Display skills as tags */}
//           <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-12">
//             {formData.skills && formData.skills.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, i) => (
//               <div 
//                 key={i} 
//                 className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1 group"
//               >
//                 <Sparkles size={14} />
//                 {tag}
//                 <button 
//                   type="button" 
//                   onClick={() => removeTag(tag)}
//                   className="ml-1 rounded-full hover:bg-blue-200 p-1"
//                 >
//                   &times;
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <input
//           type="text"
//           name={field.name}
//           value={formData[field.name] || ""}
//           onChange={handleChange}
//           className={`w-full p-3 border rounded-lg transition ${
//             errors[field.name] 
//               ? 'border-red-500 focus:ring-red-500' 
//               : 'border-gray-300 focus:ring-blue-500'
//           }`}
//           placeholder={`Enter your ${field.label.toLowerCase()}`}
//         />
//       )}

//       {errors[field.name] && (
//         <p className="text-red-500 text-sm">{errors[field.name]}</p>
//       )}
//       <p className="text-sm text-gray-500">{field.helper}</p>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-gray-50">
//       <div className="bg-white shadow-xl rounded-xl overflow-hidden">
//         {/* Header with title */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
//           <h1 className="text-3xl font-bold">
//             {id ? "Edit Your Portfolio" : "Create Your Portfolio"}
//           </h1>
//           <p className="opacity-80">
//             {id ? "Update your professional profile" : "Build your professional presence online"}
//           </p>
//         </div>

//         {/* Progress indicator */}
//         <div className="flex border-b border-gray-200">
//           {steps.map((step, index) => (
//             <button
//               key={index}
//               onClick={() => setActiveStep(index)}
//               type="button"  
//               className={`flex-1 text-center py-4 px-2 flex flex-col items-center justify-center transition-all duration-200 ${
//                 activeStep === index
//                   ? "border-b-2 border-blue-500 text-blue-600"
//                   : index < activeStep
//                   ? "text-green-500"
//                   : "text-gray-500"
//               }`}
//             >
//               <div className="flex items-center justify-center w-8 h-8 rounded-full mb-1">
//                 {index < activeStep ? (
//                   <CheckCircle size={20} className="text-green-500" />
//                 ) : (
//                   step.icon
//                 )}
//               </div>
//               <span className="text-sm font-medium hidden md:block">{step.title}</span>
//               <span className="text-xs md:hidden">{step.title}</span>
//             </button>
//           ))}
//         </div>

//         <form onSubmit={(e) => {
//     if (activeStep < steps.length - 1) {
//       e.preventDefault();
//       return;
//     }
//     handleSubmit(e);
//   }} className="p-6 space-y-6">
//           {formSections[activeStep].map(renderField)}

//           <div className="flex justify-between items-center pt-4">
//             {activeStep > 0 && (
//               <button
//                 type="button"
//                 onClick={goToPrevStep}
//                 className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
//               >
//                 Previous
//               </button>
//             )}
            
//             {activeStep < steps.length - 1 ? (
//               <button
//                 type="button"
//                 onClick={(e) => {
//                   e.preventDefault(); // Add this to prevent form submission
//                   goToNextStep();
//                 }}
//                 disabled={!formComplete}
//                 className={`px-6 py-2 rounded text-white transition ${
//                   formComplete
//                     ? "bg-blue-600 hover:bg-blue-700"
//                     : "bg-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700"
//               >
//                 {id ? "Update Portfolio" : "Submit Portfolio"}
//               </button>
//             )}
//           </div>

//           {errors.submit && (
//             <p className="text-red-500 text-sm text-center">{errors.submit}</p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PortfolioForm;

// src/components/Form.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  User, Briefcase, FileText, Mail, Phone, 
  MapPin, Linkedin, Github, Code, Building, 
  FolderPlus, Camera, Sparkles, CheckCircle, 
  Plus, Trash2, X, Edit
} from "lucide-react";

const Form = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formComplete, setFormComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    about: "",
    email: "",
    imageUrl: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    skills: [],
    experience: [],
    projects: [],
    profileImage: "/api/placeholder/200/200"
  });

  const [errors, setErrors] = useState({});
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentExperience, setCurrentExperience] = useState(null);
  const fileInputRef = useRef(null);

  // Steps configuration
  const steps = [
    { title: "Personal Info", icon: <User size={20} /> },
    { title: "Contact Details", icon: <Mail size={20} /> },
    { title: "Professional", icon: <Briefcase size={20} /> },
    { title: "Projects", icon: <FolderPlus size={20} /> },
    { title: "Experience", icon: <Building size={20} /> },
  ];

  // Load initial data from authenticated user
  useEffect(() => {
    if (auth.currentUser) {
      setFormData(prev => ({
        ...prev,
        name: auth.currentUser.displayName || "",
        email: auth.currentUser.email || "",
        imageUrl: auth.currentUser.photoURL || "",
      }));
    }
  }, []);

  // Check if the current step is complete
  useEffect(() => {
    const checkStepCompletion = () => {
      switch (activeStep) {
        case 0: // Personal Info
          return !!formData.name && !!formData.title && !!formData.about;
        case 1: // Contact Details
          return !!formData.email; // Only email is required
        case 2: // Skills
          return formData.skills && formData.skills.length > 0; 
        case 3: // Projects
          return true; // Projects are optional
        case 4: // Experience
          return true; // Experience is optional
        default:
          return false;
      }
    };
    
    setFormComplete(checkStepCompletion());
  }, [formData, activeStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear any validation errors
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddSkill = () => {
    const skillInput = document.getElementById("skill-input");
    if (!skillInput || !skillInput.value.trim()) return;
    
    const newSkill = skillInput.value.trim();
    if (!formData.skills.includes(newSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
    }
    
    skillInput.value = "";
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Project related functions
  const openProjectModal = (project = null) => {
    setCurrentProject(project || {
      id: Date.now().toString(),
      title: "",
      description: "",
      technologies: [],
      imageUrl: "",
      link: "",
      github: ""
    });
    setProjectModalOpen(true);
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setCurrentProject(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProjectTechnology = () => {
    const techInput = document.getElementById("project-tech-input");
    if (!techInput || !techInput.value.trim()) return;
    
    const newTech = techInput.value.trim();
    if (!currentProject.technologies || !currentProject.technologies.includes(newTech)) {
      setCurrentProject(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTech]
      }));
    }
    
    techInput.value = "";
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
    
    setProjectModalOpen(false);
  };

  const deleteProject = (projectId) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }));
  };

  // Experience related functions
  const openExperienceModal = (experience = null) => {
    setCurrentExperience(experience || {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      details: []
    });
    setExperienceModalOpen(true);
  };

  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentExperience(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddExperienceDetail = () => {
    const detailInput = document.getElementById("experience-detail-input");
    if (!detailInput || !detailInput.value.trim()) return;
    
    const newDetail = detailInput.value.trim();
    setCurrentExperience(prev => ({
      ...prev,
      details: [...(prev.details || []), newDetail]
    }));
    
    detailInput.value = "";
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
    
    setExperienceModalOpen(false);
  };

  const deleteExperience = (experienceId) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== experienceId)
    }));
  };

  const goToNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    try {
      setLoading(true);
      const storageRef = ref(storage, `profile-images/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setFormData(prev => ({
        ...prev,
        imageUrl: downloadURL,
        profileImage: downloadURL
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors(prev => ({ ...prev, image: "Failed to upload image" }));
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.about?.trim()) newErrors.about = "About section is required";
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (!auth.currentUser) {
        throw new Error("No authenticated user found");
      }

      const userId = auth.currentUser.uid;
      
      // Prepare the data for Firestore
      const portfolioData = {
        ...formData,
        userId,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      
      // Ensure skills is an array
      if (!Array.isArray(portfolioData.skills)) {
        portfolioData.skills = [];
      }
      
      // Save to Firestore
      await setDoc(doc(db, "portfolios", userId), portfolioData);
      
      // Navigate to the portfolio page
      navigate(`/portfolio/${userId}`);
    } catch (error) {
      console.error("Error saving portfolio:", error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Render functions for form sections
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <Camera size={18} />
          Profile Image
        </label>
        <div className="flex flex-col items-center space-y-3">
          <img 
            src={formData.imageUrl || formData.profileImage} 
            alt="Profile preview" 
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" 
          />
          
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm flex items-center gap-2"
          >
            <Camera size={16} />
            Upload Image
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*"
            />
          </button>
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <User size={18} />
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg transition ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <Briefcase size={18} />
          Professional Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg transition ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Frontend Developer, UI/UX Designer"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <FileText size={18} />
          About Me
        </label>
        <textarea
          name="about"
          value={formData.about || ""}
          onChange={handleChange}
          rows={5}
          className={`w-full p-3 border rounded-lg transition ${
            errors.about ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Write a brief introduction about yourself, your background, and professional interests"
        />
        {errors.about && (
          <p className="text-red-500 text-sm">{errors.about}</p>
        )}
      </div>
    </div>
  );

  const renderContactDetails = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <Mail size={18} />
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          className={`w-full p-3 border rounded-lg transition ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="your.email@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <Phone size={18} />
          Phone (Optional)
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="+1 (123) 456-7890"
        />
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <MapPin size={18} />
          Location (Optional)
        </label>
        <input
          type="text"
          name="location"
          value={formData.location || ""}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="City, Country"
        />
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <Linkedin size={18} />
          LinkedIn URL (Optional)
        </label>
        <input
          type="url"
          name="linkedin"
          value={formData.linkedin || ""}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="https://linkedin.com/in/yourusername"
        />
      </div>
      
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <Github size={18} />
          GitHub URL (Optional)
        </label>
        <input
          type="url"
          name="github"
          value={formData.github || ""}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="https://github.com/yourusername"
        />
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <Code size={18} />
          Skills
        </label>
        
        <div className="flex gap-2">
          <input
            id="skill-input"
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-lg"
            placeholder="Add skills one by one (e.g., JavaScript, React)"
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
        
        <div className="mt-4 p-4 border border-gray-300 rounded-lg min-h-32 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {formData.skills && formData.skills.map((skill, index) => (
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
            {(!formData.skills || formData.skills.length === 0) && (
              <p className="text-gray-500 text-sm">Add your skills above</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-700 flex items-center">
          <FolderPlus size={20} className="mr-2" />
          Projects
        </h3>
        <button
          type="button"
          onClick={() => openProjectModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Project
        </button>
      </div>
      
      {(!formData.projects || formData.projects.length === 0) ? (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <FolderPlus size={48} className="mx-auto text-gray-400 mb-4" />
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
            <div key={project.id} className="border border-gray-300 rounded-lg overflow-hidden">
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
      {projectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="p-4 border-b border-gray-300 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {currentProject.id ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                type="button"
                onClick={() => setProjectModalOpen(false)}
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
                onClick={() => setProjectModalOpen(false)}
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
        <h3 className="text-lg font-medium text-gray-700 flex items-center">
          <Building size={20} className="mr-2" />
          Work Experience
        </h3>
        <button
          type="button"
          onClick={() => openExperienceModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Experience
        </button>
      </div>
      
      {(!formData.experience || formData.experience.length === 0) ? (
        <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Building size={48} className="mx-auto text-gray-400 mb-4" />
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
            .sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0))
            .map(exp => (
              <div key={exp.id} className="border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{exp.position}</h4>
                    <p className="text-gray-700">{exp.company}</p>
                    <div className="text-sm text-gray-600 mt-1">
                      {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {
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
      {experienceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="p-4 border-b border-gray-300 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {currentExperience.id ? 'Edit Experience' : 'Add New Experience'}
              </h3>
              <button
                type="button"
                onClick={() => setExperienceModalOpen(false)}
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
                onClick={() => setExperienceModalOpen(false)}
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

  const renderActiveStep = () => {
    switch (activeStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderContactDetails();
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
            Create Your Portfolio
          </h1>
          <p className="opacity-80">
            Build your professional presence online
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {renderActiveStep()}

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
                onClick={goToNextStep}
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
                disabled={loading}
                className={`px-6 py-2 rounded text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Submitting...
                  </div>
                ) : "Submit Portfolio"}
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

export default Form;