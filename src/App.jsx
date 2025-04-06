// import { useState } from 'react'

import './index.css'

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./components/Form";
import Portfolio from "./pages/Portfolio";
import EditPortfolio from "./pages/EditPortfolio";


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/portfolio/:id" element={<Portfolio />} />
          <Route path="/edit/:id" element={<EditPortfolio />} />
        </Routes>
    
      </div>
    </Router>
  );
}

export default App;
