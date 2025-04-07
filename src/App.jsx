import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./components/Form";
import Portfolio from "./pages/Portfolio";
import EditPortfolio from "./pages/EditPortfolio";
import SignIn from './pages/SignIn';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/form" element={
            <PrivateRoute>
              <Form />
            </PrivateRoute>
          } />
          <Route path="/portfolio/:id" element={
            <PrivateRoute>
              <Portfolio />
            </PrivateRoute>
          } />
          <Route path="/edit/:id" element={
            <PrivateRoute>
              <EditPortfolio />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
