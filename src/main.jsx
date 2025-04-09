// import React from 'react'
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerLucideIcons } from './utils/iconUtils'

// Register commonly used Lucide icons
registerLucideIcons();

// Create custom CSS variables for theming
document.documentElement.style.setProperty('--color-primary', '#3b82f6'); // Default blue
document.documentElement.style.setProperty('--color-secondary', '#6366f1'); // Default indigo

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)