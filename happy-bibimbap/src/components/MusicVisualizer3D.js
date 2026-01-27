import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function VisualizerBars({ audioData, barCount = 64, style = 'bars' }) {
  const groupRef = useRef();
  const barsRef = useRef([]);

  useFrame(() => {
    if (!audioData || !barsRef.current.length) return;

    barsRef.current.forEach((bar, i) => {
      if (!bar) return;

      const dataIndex = Math.floor((i / barCount) * audioData.length);
      const value = audioData[dataIndex] || 0;
      const scale = value / 255;

      if (style === 'bars') {
        // Bar height animation
        bar.scale.y = 0.1 + scale * 5;
        bar.position.y = bar.scale.y / 2;

        // Color based on frequency
        const hue = (i / barCount) * 0.8 + 0.1; // Range from red to blue
        bar.material.color.setHSL(hue, 0.8, 0.5 + scale * 0.3);
        bar.material.emissiveIntensity = scale * 0.5;
      } else if (style === 'spheres') {
        // Sphere size animation
        const baseScale = 0.3;
        bar.scale.setScalar(baseScale + scale * 1.5);

        // Color based on frequency
        const hue = (i / barCount) * 0.8 + 0.1;
        bar.material.color.setHSL(hue, 0.9, 0.5 + scale * 0.4);
        bar.material.emissiveIntensity = scale * 0.8;
      } else if (style === 'particles') {
        // Particle position animation
        const radius = 3 + scale * 2;
        const angle = (i / barCount) * Math.PI * 2;
        bar.position.x = Math.cos(angle) * radius;
        bar.position.z = Math.sin(angle) * radius;
        bar.position.y = scale * 3;

        // Color and glow
        const hue = (i / barCount) * 0.8 + 0.1;
        bar.material.color.setHSL(hue, 1, 0.5 + scale * 0.5);
        bar.material.emissiveIntensity = scale;
      }
    });

    // Gentle rotation for the whole group
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const angle = (i / barCount) * Math.PI * 2;

      if (style === 'bars') {
        return {
          id: i,
          position: [Math.cos(angle) * 3, 0, Math.sin(angle) * 3],
          rotation: [0, -angle, 0],
        };
      } else if (style === 'spheres') {
        return {
          id: i,
          position: [Math.cos(angle) * 3, 0, Math.sin(angle) * 3],
          rotation: [0, 0, 0],
        };
      } else if (style === 'particles') {
        return {
          id: i,
          position: [Math.cos(angle) * 3, 0, Math.sin(angle) * 3],
          rotation: [0, 0, 0],
        };
      }
      return { id: i, position: [0, 0, 0], rotation: [0, 0, 0] };
    });
  }, [barCount, style]);

  return (
    <group ref={groupRef}>
      {bars.map((bar, i) => (
        <mesh
          key={bar.id}
          ref={(el) => (barsRef.current[i] = el)}
          position={bar.position}
          rotation={bar.rotation}
          castShadow
        >
          {style === 'bars' && <boxGeometry args={[0.3, 1, 0.3]} />}
          {style === 'spheres' && <sphereGeometry args={[0.3, 16, 16]} />}
          {style === 'particles' && <sphereGeometry args={[0.15, 12, 12]} />}
          <meshStandardMaterial
            color="#FF6F00"
            emissive="#FF6F00"
            emissiveIntensity={0.5}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function MusicVisualizer3D({
  audioElement,
  width = '100%',
  height = '400px',
  barCount = 64,
  style = 'bars', // 'bars', 'spheres', or 'particles'
  backgroundColor = '#1a1a2e',
  cameraPosition = [0, 3, 8],
}) {
  const [audioData, setAudioData] = useState(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!audioElement) return;

    // Set up Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyserRef.current = analyser;
    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

    const updateAudioData = () => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        setAudioData([...dataArrayRef.current]);
      }
      animationFrameRef.current = requestAnimationFrame(updateAudioData);
    };

    updateAudioData();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [audioElement]);

  return (
    <div style={{ width, height, background: backgroundColor }}>
      <Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        shadows
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={1} color="#FFE4B5" />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.5}
          castShadow
        />

        <VisualizerBars audioData={audioData} barCount={barCount} style={style} />

        {/* Ground plane for depth */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial
            color="#0f0f1e"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      </Canvas>
    </div>
  );
}

export default MusicVisualizer3D;
