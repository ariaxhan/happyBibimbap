import React from "react";
import happybibimbap from "../happybibimbap.png";
import "../styles.css";
import Navbar from '../components/NavBar'; // Import the Navbar component

function Home() {
  return (
    <div className="container">
      <Navbar />
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