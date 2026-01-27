import React from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AboutMe from './pages/AboutMe';
import ContactMe from './pages/ContactMe';
import Home from './pages/Home';
import Introduction from './pages/Introduction';
import Portfolio from './pages/Portfolio';
import Forum from './pages/Forum';
import ForumThread from './pages/ForumThread';
import NotFound from './pages/NotFound';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route exact path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/contactme" element={<ContactMe />} />
        <Route path="/aboutme" element={<AboutMe />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/:threadId" element={<ForumThread />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;