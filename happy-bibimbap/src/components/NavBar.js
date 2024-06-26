import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="nav-link">Home</a>
      <a href="introduction" className="nav-link">Introduction</a>
      <a href="portfolio" className="nav-link">Portfolio</a>
      <a href="aboutme" className="nav-link">About Me</a>
      <a href="contactme" className="nav-link">Contact Me</a>
    </nav>
  );
};

export default Navbar;