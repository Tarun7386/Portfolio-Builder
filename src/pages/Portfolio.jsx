
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getPortfolio } from "../portfolioService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Phone, MapPin, Linkedin, Github, 
  Download, Edit, ArrowLeft, ExternalLink,
  Moon, Sun, Calendar, Award, BookOpen, Code,
  Coffee, Image, MessageCircle, Star
} from "lucide-react";

const Portfolio = () => {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("about");
  const [darkMode, setDarkMode] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionsRef = useRef({});

  // Theme toggling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for sections
  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: "-10% 0px -10% 0px"
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    Object.values(sectionsRef.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [portfolio]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPortfolio(id);
        if (data) setPortfolio(data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen dark:bg-gray-900 bg-gray-50 transition-colors duration-300">
        <div className="w-24 h-24 relative">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 dark:border-blue-900 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">Loading portfolio...</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="max-w-4xl mx-auto mt-20 text-center p-8"
      >
        <div className="text-red-500 mb-6">
          <svg className="w-20 h-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-200">Portfolio not found</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400">The portfolio you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="inline-flex items-center mt-6 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </Link>
      </motion.div>
    );
  }

  const {
    name,
    title,
    about,
    email,
    imageUrl,
    phone,
    location,
    linkedin,
    github,
    skills,
    experience,
    projects,
  } = portfolio;

  // Convert experience text to structured format
  const formatExperience = (experienceText) => {
    if (!experienceText) return [];
    
    const experiences = experienceText.split("\n\n");
    return experiences.map(exp => {
      const lines = exp.split("\n");
      const header = lines[0].split("|");
      const company = header[0]?.trim() || "";
      const position = header[1]?.trim() || "";
      const period = header[2]?.trim() || "";
      const details = lines.slice(1).map(line => line.trim()).filter(Boolean);
      
      return { company, position, period, details };
    });
  };

  // Convert projects text to structured format
  const formatProjects = (projectsText) => {
    if (!projectsText) return [];
    
    const projectsList = projectsText.split("\n\n");
    return projectsList.map(proj => {
      const lines = proj.split("\n");
      const header = lines[0].split("|");
      const name = header[0]?.trim() || "";
      const tech = header[1]?.trim() || "";
      const details = lines.slice(1).map(line => line.trim()).filter(Boolean);
      
      // Extract image URL if available
      const imageUrl = details.find(d => d.includes("Image:"))?.replace("Image:", "").trim() || null;
      const filteredDetails = details.filter(d => !d.includes("Image:"));
      
      return { name, tech, details: filteredDetails, imageUrl };
    });
  };

  const experienceList = formatExperience(experience);
  const projectsList = formatProjects(projects);
  // const skillsList = skills?.split(",").map(skill => skill.trim()).filter(Boolean) || [];
  const skillsList = Array.isArray(skills) ? skills : (skills || "").split(",");

  // Group skills by category for better presentation
  const skillCategories = {
    "Languages": skillsList.filter(s => ["JavaScript", "TypeScript", "Python", "Java", "C#", "PHP", "Ruby", "Go", "Swift", "Kotlin"].includes(s)),
    "Frontend": skillsList.filter(s => ["React", "Vue", "Angular", "HTML", "CSS", "Tailwind", "Bootstrap", "Redux", "Next.js"].includes(s)),
    "Backend": skillsList.filter(s => ["Node.js", "Express", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET", "GraphQL"].includes(s)),
    "Database": skillsList.filter(s => ["MongoDB", "PostgreSQL", "MySQL", "SQLite", "DynamoDB", "Firebase", "Oracle", "SQL Server"].includes(s)),
    "Other": skillsList.filter(s => 
      !["JavaScript", "TypeScript", "Python", "Java", "C#", "PHP", "Ruby", "Go", "Swift", "Kotlin",
        "React", "Vue", "Angular", "HTML", "CSS", "Tailwind", "Bootstrap", "Redux", "Next.js",
        "Node.js", "Express", "Django", "Flask", "Spring Boot", "Laravel", "ASP.NET", "GraphQL",
        "MongoDB", "PostgreSQL", "MySQL", "SQLite", "DynamoDB", "Firebase", "Oracle", "SQL Server"].includes(s))
  };

  // Navigation items
  const navItems = [
    { id: "about", icon: <Coffee size={18} />, label: "About" },
    { id: "skills", icon: <Star size={18} />, label: "Skills" },
    { id: "experience", icon: <Calendar size={18} />, label: "Experience" },
    { id: "projects", icon: <Code size={18} />, label: "Projects" },
    { id: "education", icon: <BookOpen size={18} />, label: "Education" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-200 dark:bg-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
      
      {/* Header with actions */}
      <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
            <ArrowLeft size={20} className="mr-2" /> Back
          </Link>
          
          <div className="hidden md:flex space-x-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`inline-flex items-center px-2 py-1 rounded transition-colors duration-200 ${
                  activeSection === item.id 
                  ? 'text-blue-600 dark:text-blue-400 font-medium' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <Link 
              to={`/edit/${id}`} 
              className="hidden md:inline-flex items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-md transition-colors duration-200"
            >
              <Edit size={18} className="mr-2" /> Edit
            </Link>
            
            <button 
              onClick={() => window.print()}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition-colors duration-200"
            >
              <Download size={18} className="mr-2" /> Resume
            </button>
          </div>
        </div>
      </div>

      {/* Hero section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-purple-700/80"></div>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/30 overflow-hidden flex-shrink-0 shadow-lg"
            >
              {/* https://ui-avatars.com/api/?name=${name}&background=random&size=200` */}
              <img 
                src={`${imageUrl || `https://ui-avatars.com/api/?name=${name}&background=random&size=200`}`} 
                alt={name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="text-center md:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold"
              >
                {name}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl md:text-2xl text-blue-100 mt-2"
              >
                {title}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-3 mt-6 justify-center md:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowContact(!showContact)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-2 rounded-full flex items-center transition-all duration-200"
                >
                  <MessageCircle size={18} className="mr-2" />
                  Contact Me
                </motion.button>
                
                {linkedin && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center transition-all duration-200"
                  >
                    <Linkedin size={18} className="mr-2" />
                    LinkedIn
                  </motion.a>
                )}
                
                {github && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center transition-all duration-200"
                  >
                    <Github size={18} className="mr-2" />
                    GitHub
                  </motion.a>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact info popup */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-4 md:right-8 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700 max-w-xs"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800 dark:text-white">Contact Info</h3>
              <button 
                onClick={() => setShowContact(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {email && (
              <div className="flex items-center mb-3 text-gray-700 dark:text-gray-300">
                <Mail size={18} className="mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 break-all">
                  {email}
                </a>
              </div>
            )}
            
            {phone && (
              <div className="flex items-center mb-3 text-gray-700 dark:text-gray-300">
                <Phone size={18} className="mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                  {phone}
                </a>
              </div>
            )}
            
            {location && (
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <MapPin size={18} className="mr-2 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>{location}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* About section */}
        {about && (
          <motion.section
            ref={el => sectionsRef.current.about = el}
            id="about"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 inline-flex items-center">
              <Coffee size={24} className="mr-3 text-blue-600 dark:text-blue-400" />
              About Me
            </h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-colors duration-300">
              <div className="p-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg"
                >
                  {about}
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Skills section */}
        {skillsList.length > 0 && (
          <motion.section
            ref={el => sectionsRef.current.skills = el}
            id="skills"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 inline-flex items-center">
              <Star size={24} className="mr-3 text-blue-600 dark:text-blue-400" />
              Skills & Expertise
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(skillCategories).map(([category, skills], index) => (
                skills.length > 0 && (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.05 * i + 0.2, duration: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium transition-all duration-200"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience section */}
        {experienceList.length > 0 && (
          <motion.section
            ref={el => sectionsRef.current.experience = el}
            id="experience"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 inline-flex items-center">
              <Calendar size={24} className="mr-3 text-blue-600 dark:text-blue-400" />
              Professional Experience
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-900 transform md:translate-x-px"></div>
              
              <div className="space-y-12">
                {experienceList.map((exp, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-400 shadow-md transform -translate-x-1.5 md:-translate-x-2"></div>
                    
                    <div className={`md:w-1/2 ${experienceList.length > 2 && index % 2 !== 0 ? 'md:pl-12' : 'md:pr-12 md:ml-auto'}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300 hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-1">
                        <div className="p-6">
                          <div className="flex flex-col mb-4">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{exp.company}</h3>
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{exp.period}</span>
                            </div>
                            <p className="text-blue-600 dark:text-blue-400 font-semibold">{exp.position}</p>
                          </div>
                          
                          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                            {exp.details.map((detail, idx) => (
                              <motion.li 
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * idx + 0.3, duration: 0.4 }}
                                className="flex items-start"
                              >
                                <span className="inline-block h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs mr-2 mt-0.5">•</span>
                                <span>{detail.replace(/^• /, '')}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Projects section */}
        {projectsList.length > 0 && (
          <motion.section
            ref={el => sectionsRef.current.projects = el}
            id="projects"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 inline-flex items-center">
              <Code size={24} className="mr-3 text-blue-600 dark:text-blue-400" />
              Featured Projects
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projectsList.map((project, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * index, duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300 hover:shadow-xl transform transition-transform duration-300 hover:-translate-y-2"
                >
                  {/* Project image or placeholder */}
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center overflow-hidden">
                    {project.imageUrl ? (
                      <img 
                        src={project.imageUrl} 
                        alt={project.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-blue-400 dark:text-blue-300 opacity-50">
                        <Image size={48} />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col mb-4">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{project.name}</h3>
                      {project.tech && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.tech.split('/').map((tech, i) => (
                            <span 
                              key={i} 
                              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs font-medium"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                      {project.details.map((detail, idx) => {
                        // Check if detail contains a URL
                        // ...previous code...

                        // Check if detail contains a URL
                        const urlMatch = detail.match(/(https?:\/\/[^\s]+)/g);
                        if (urlMatch && detail.includes("Link:")) {
                          return (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 * idx }}
                              className="flex items-center"
                            >
                              <a 
                                href={urlMatch[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                              >
                                <ExternalLink size={16} className="mr-1" />
                                View Project
                              </a>
                            </motion.li>
                          );
                        }

                        return (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * idx + 0.3, duration: 0.4 }}
                            className="flex items-start"
                          >
                            <span className="inline-block h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs mr-2 mt-0.5">•</span>
                            <span>{detail.replace(/^• /, '')}</span>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Print styles - Only applied when printing */}
      <style>
  {`
    @media print {
      body {
        background: white !important;
        color: black !important;
      }
      
      .no-print {
        display: none !important;
      }
      
      .print-break-inside-avoid {
        break-inside: avoid;
      }
      
      .print-break-before-page {
        break-before: page;
      }
    }
  `}
</style>

    </div>
  );
};

export default Portfolio;
