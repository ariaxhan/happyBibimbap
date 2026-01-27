import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/introduction', label: 'Introduction' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/forum', label: 'Forum' },
    { path: '/aboutme', label: 'About Me' },
    { path: '/contactme', label: 'Contact Me' },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''}`}
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;