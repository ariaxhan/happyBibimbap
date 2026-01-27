import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Bowl() {
  const bowlRef = useRef();
  const riceRef = useRef();

  // Auto-rotate when not being manually controlled
  useFrame((state, delta) => {
    if (bowlRef.current && !state.controls?.enabled) {
      bowlRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={bowlRef}>
      {/* Bowl - using a hemisphere shape */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.8}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner bowl color - slightly smaller */}
      <mesh position={[0, 0.05, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[1.9, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#D2691E"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Rice base */}
      <mesh ref={riceRef} position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.8, 32]} />
        <meshStandardMaterial
          color="#FFFFFF"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* Ingredients on top - colorful vegetables */}
      {/* Spinach - green */}
      <mesh position={[0.8, 1, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.7} />
      </mesh>

      {/* Carrots - orange */}
      <mesh position={[-0.8, 1, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#FF6F00" roughness={0.7} />
      </mesh>

      {/* Mushrooms - brown */}
      <mesh position={[0, 1, 0.8]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#5D4037" roughness={0.7} />
      </mesh>

      {/* Bean sprouts - yellow */}
      <mesh position={[0, 1, -0.8]} rotation={[-0.3, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#FBC02D" roughness={0.7} />
      </mesh>

      {/* Beef - dark red */}
      <mesh position={[0.6, 1, 0.6]} rotation={[0.2, 0, 0.2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#C62828" roughness={0.6} />
      </mesh>

      {/* Gochujang sauce - red in center */}
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color="#D32F2F"
          roughness={0.3}
          metalness={0.2}
          emissive="#D32F2F"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Fried egg on top */}
      <group position={[0, 1.3, 0]}>
        {/* Egg white */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
          <meshStandardMaterial color="#FFFACD" roughness={0.5} />
        </mesh>
        {/* Egg yolk */}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#FFD700"
            roughness={0.4}
            emissive="#FFD700"
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>
    </group>
  );
}

function BibimbapBowl3D({
  width = '100%',
  height = '400px',
  autoRotate = true,
  enableZoom = true,
  cameraPosition = [0, 3, 6]
}) {
  return (
    <div style={{ width, height }}>
      <Canvas
        camera={{ position: cameraPosition, fov: 50 }}
        shadows
      >
        {/* Lighting setup for good visibility */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
        />
        <directionalLight
          position={[-5, 3, -5]}
          intensity={0.5}
        />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFE4B5" />

        <Bowl />

        <OrbitControls
          enableZoom={enableZoom}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
          minDistance={4}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}

export default BibimbapBowl3D;
