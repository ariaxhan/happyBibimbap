import React from "react";
import happybibimbap from "./happybibimbap.png";
import "./styles.css";

function Home() {
  return (
    <div className="container">
      <nav className="navbar">
        <a href="#introduction" className="nav-link">Introduction</a>
        <a href="#portfolio" className="nav-link">Portfolio</a>
        <a href="#about" className="nav-link">About Me</a>
        <a href="#contact" className="nav-link">Contact Me</a>
      </nav>
      <div className="content">
        <img
          src={happybibimbap}
          className="image"
          alt="Happy Bibimbap"
        />
        <div className="text">
          <h1>Hello,</h1>
          <p>I'm Happy Bibimbap</p>
          <button className="button">See My Work</button>
        </div>
      </div>
    </div>
  );
}

export default Home;