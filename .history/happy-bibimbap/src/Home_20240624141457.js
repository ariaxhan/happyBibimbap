import React from "react";

function Home() {
  return (
    <>
      <div className="container">
        <nav className="navbar">
          <a href="#introduction" className="nav-link">Introduction</a>
          <a href="#portfolio" className="nav-link">Portfolio</a>
          <a href="#about" className="nav-link">About Me</a>
          <a href="#contact" className="nav-link">Contact Me</a>
        </nav>
        <div className="content">
          <img
            src="happybibimbap
            className="image"
            alt="Happy Bibimbap"
          />
          <div className="text">
            <h1>Hello,</h1>
            <p>This is Happy Bibimbap</p>
            <button className="button">See My Work</button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          background: linear-gradient(
            247deg,
            rgba(246, 115, 115, 0.83) 0%,
            #d74d8b 50.01%,
            #f1823c 100%
          );
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: auto;
        }
        .navbar {
          display: flex;
          justify-content: space-around;
          width: 100%;
          margin-bottom: 20px;
        }
        .nav-link {
          color: white;
          text-decoration: none;
          font-size: 18px;
          font-weight: bold;
        }
        .nav-link:hover {
          text-decoration: underline;
        }
        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .image {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          margin-bottom: 20px;
        }
        .text h1 {
          font-size: 2rem;
          margin: 0;
        }
        .text p {
          font-size: 1.5rem;
          margin: 10px 0;
        }
        .button {
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 16px;
          color: #fff;
          background-color: #d74d8b;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #f1823c;
        }
      `}</style>
    </>
  );
}

export default Home;