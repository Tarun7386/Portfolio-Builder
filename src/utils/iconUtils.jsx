// src/utils/iconUtils.js
import { icons } from 'lucide-react';

// This function registers commonly used Lucide icons globally
// which can improve performance by avoiding re-renders when using icons
export const registerLucideIcons = () => {
  // You can add or remove icons from this list based on your application needs
  const commonIcons = [
    'User', 'Briefcase', 'FileText', 'Mail', 'Phone', 'MapPin', 
    'Linkedin', 'Github', 'Code', 'Building', 'FolderPlus', 'Camera',
    'Sparkles', 'CheckCircle', 'Edit', 'Eye', 'LogOut', 'Plus',
    'Settings', 'Share2', 'Clock', 'Award', 'BarChart', 'ChevronRight', 
    'ExternalLink', 'Save', 'ArrowLeft', 'Bell', 'Shield', 'Key',
    'LockIcon', 'Calendar', 'Star', 'Moon', 'Sun', 'Download', 
    'Link2', 'Trash2', 'Filter', 'Layout', 'Terminal', 'PenTool',
    'Globe', 'X', 'Zap', 'RefreshCw', 'BarChart2', 'ChevronDown',
    'Users', 'MousePointer'
  ];

  // Create a container for SVG defs if it doesn't exist
  let svgDefs = document.getElementById('lucide-icon-defs');
  if (!svgDefs) {
    svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgDefs.style.display = 'none';
    svgDefs.id = 'lucide-icon-defs';
    document.body.appendChild(svgDefs);
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svgDefs.appendChild(defs);
  }

  // Register each icon in the commonIcons list
  commonIcons.forEach(iconName => {
    if (icons[iconName]) {
      // Add the icon definition to the defs
      const iconSvg = icons[iconName];
      // Note: In a real implementation, we would parse the SVG and add it to the defs
      // but this requires DOM manipulation of SVG elements
      // This is a simplified version for demonstration
    }
  });
};

// Helper function to get a Lucide icon by name
export const getIcon = (name, props = {}) => {
  const Icon = icons[name];
  return Icon ? <Icon {...props} /> : null;
};