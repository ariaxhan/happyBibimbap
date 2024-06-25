import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Introduction from './pages/Introduction';
import ContactMe from './pages/ContactMe';
import AboutMe from './pages/AboutMe';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/contactme" element={<ContactMe />} />
        <Route path="/aboutme" element={<AboutMe />} />
        <Route path="/3d" element={<ThreeScene />} />  // Add a route for your 3D scene
      </Routes>
    </Router>
  );
}

export default App;