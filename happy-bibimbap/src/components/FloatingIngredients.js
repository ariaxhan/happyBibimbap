import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Ingredient({ position, color, size, speed, type }) {
  const meshRef = useRef();
  const floatOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime * speed;

      // Floating motion - sine wave for smooth up/down
      meshRef.current.position.y = position[1] + Math.sin(time + floatOffset) * 0.5;

      // Gentle horizontal drift
      meshRef.current.position.x = position[0] + Math.sin(time * 0.5 + floatOffset) * 0.3;
      meshRef.current.position.z = position[2] + Math.cos(time * 0.5 + floatOffset) * 0.3;

      // Gentle rotation
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.015 * speed;
    }
  });

  // Different shapes for different ingredient types
  const geometry = useMemo(() => {
    switch(type) {
      case 'carrot':
        return <coneGeometry args={[size * 0.3, size, 8]} />;
      case 'mushroom':
        return (
          <>
            <sphereGeometry args={[size * 0.5, 16, 16]} />
          </>
        );
      case 'spinach':
        return <boxGeometry args={[size * 0.8, size * 0.2, size * 0.8]} />;
      default:
        return <sphereGeometry args={[size * 0.5, 16, 16]} />;
    }
  }, [type, size]);

  return (
    <mesh ref={meshRef} position={position} castShadow>
      {geometry}
      <meshStandardMaterial
        color={color}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}

function IngredientField({ count = 20 }) {
  const ingredients = useMemo(() => {
    const types = [
      { type: 'carrot', color: '#FF6F00' },
      { type: 'spinach', color: '#2E7D32' },
      { type: 'mushroom', color: '#5D4037' },
      { type: 'bean', color: '#FBC02D' },
    ];

    return Array.from({ length: count }, (_, i) => {
      const ingredientType = types[Math.floor(Math.random() * types.length)];
      return {
        id: i,
        type: ingredientType.type,
        color: ingredientType.color,
        position: [
          (Math.random() - 0.5) * 10,
          Math.random() * 8 - 2,
          (Math.random() - 0.5) * 10,
        ],
        size: 0.3 + Math.random() * 0.3,
        speed: 0.5 + Math.random() * 0.5,
      };
    });
  }, [count]);

  return (
    <>
      {ingredients.map((ingredient) => (
        <Ingredient
          key={ingredient.id}
          position={ingredient.position}
          color={ingredient.color}
          size={ingredient.size}
          speed={ingredient.speed}
          type={ingredient.type}
        />
      ))}
    </>
  );
}

function FloatingIngredients({
  width = '100%',
  height = '400px',
  count = 20,
  backgroundColor = '#FFF8E1',
  cameraPosition = [0, 2, 8]
}) {
  return (
    <div style={{ width, height, background: backgroundColor }}>
      <Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.3} color="#FFE4B5" />

        <IngredientField count={count} />

        {/* Optional ground plane for shadows */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial
            color="#FFF3E0"
            transparent
            opacity={0.3}
          />
        </mesh>
      </Canvas>
    </div>
  );
}

export default FloatingIngredients;
