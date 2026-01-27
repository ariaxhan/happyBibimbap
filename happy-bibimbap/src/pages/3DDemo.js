import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../components/NavBar';
import BibimbapBowl3D from '../components/BibimbapBowl3D';
import FloatingIngredients from '../components/FloatingIngredients';
import MusicVisualizer3D from '../components/MusicVisualizer3D';

/**
 * Demo page showcasing all three 3D components
 * This can be used as a reference or as an actual page in the portfolio
 */
function ThreeDDemo() {
  const audioRef = useRef(null);
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
    }
  }, []);

  return (
    <div className="container">
      <Navbar />

      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>
          3D Interactive Components
        </h1>

        {/* Section 1: Bibimbap Bowl */}
        <section style={{ marginBottom: '60px' }}>
          <h2>Interactive Bibimbap Bowl</h2>
          <p>
            Drag to rotate, scroll to zoom. Watch it auto-rotate when you're not interacting.
          </p>
          <div className="canvas-container">
            <BibimbapBowl3D
              height="500px"
              autoRotate={true}
              enableZoom={true}
            />
          </div>
        </section>

        {/* Section 2: Floating Ingredients */}
        <section style={{ marginBottom: '60px' }}>
          <h2>Floating Ingredients</h2>
          <p>
            Watch the vegetables float and dance in 3D space with gentle physics-based motion.
          </p>
          <div className="canvas-container">
            <FloatingIngredients
              height="400px"
              count={20}
              backgroundColor="#FFF8E1"
            />
          </div>
        </section>

        {/* Section 3: Music Visualizer */}
        <section style={{ marginBottom: '60px' }}>
          <h2>3D Music Visualizer</h2>
          <p>
            Play the music to see the 3D visualization react to the audio in real-time.
          </p>

          {/* Audio controls */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <audio ref={audioRef} controls style={{ width: '100%', maxWidth: '500px' }}>
              <source src="/music/HappyBibimbap.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>

          {/* Visualizer - Bars style */}
          <div style={{ marginBottom: '30px' }}>
            <h3>Style: Bars</h3>
            <div className="canvas-container">
              <MusicVisualizer3D
                audioElement={audioElement}
                height="350px"
                style="bars"
                barCount={64}
                backgroundColor="#1a1a2e"
              />
            </div>
          </div>

          {/* Visualizer - Spheres style */}
          <div style={{ marginBottom: '30px' }}>
            <h3>Style: Spheres</h3>
            <div className="canvas-container">
              <MusicVisualizer3D
                audioElement={audioElement}
                height="350px"
                style="spheres"
                barCount={64}
                backgroundColor="#16213e"
              />
            </div>
          </div>

          {/* Visualizer - Particles style */}
          <div style={{ marginBottom: '30px' }}>
            <h3>Style: Particles</h3>
            <div className="canvas-container">
              <MusicVisualizer3D
                audioElement={audioElement}
                height="350px"
                style="particles"
                barCount={64}
                backgroundColor="#0f3460"
              />
            </div>
          </div>
        </section>

        {/* Info section */}
        <section style={{
          background: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '40px'
        }}>
          <h3>Technical Details</h3>
          <ul>
            <li>Built with React Three Fiber (R3F) and Three.js</li>
            <li>Uses WebGL for hardware-accelerated 3D rendering</li>
            <li>Music visualizer uses Web Audio API for real-time frequency analysis</li>
            <li>All components are interactive and responsive</li>
            <li>Optimized for 60fps performance on modern devices</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default ThreeDDemo;
