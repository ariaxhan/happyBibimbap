import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ThreeScene from './components/ThreeScene';
import AboutMe from './pages/AboutMe';
import ContactMe from './pages/ContactMe';
import Home from './pages/Home';
import Introduction from './pages/Introduction';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/contactme" element={<ContactMe />} />
        <Route path="/aboutme" element={<AboutMe />} />
        <Route path="/3d" element={<ThreeScene />} /> 
      </Routes>
    </Router>
  );
}

export default App;