import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Portfolio from './components/Portfolio';
import Introduction from './components/Introduction';
import ContactMe from './components/ContactMe';
import AboutMe from './components/AboutMe';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/contactme" element={<ContactMe />} />
        <Route path="/aboutme" element={<AboutMe />} />
      </Routes>
    </Router>
  );
}

export default App;