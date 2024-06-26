import React from "react";
import Navbar from '../components/NavBar'; // Import the Navbar component
import happybibimbap from "../happybibimbap.png";
import "../styles.css";

function Home() {
  return (
    <div className="container">
      <Navbar />
      <div className="introduction-container">
        <img
          src={happybibimbap}
          className="logo"
          alt="Happy Bibimbap"
        />
        <h1 className="introduction-title">Hello!</h1>
        <div className="introduction-content">
          <p>
            Welcome to my portfolio! I'm Happy Bibimbap, a creative culinary enthusiast who loves to bring joy and flavor to every dish. Explore my work and join me on this delicious journey!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;