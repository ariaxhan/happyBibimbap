import React, { useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { a, useSpring } from '@react-spring/three';

// ShaderMaterial for the waves
const WaveShaderMaterial = shaderMaterial(
  { uTime: 0, uMouse: new THREE.Vector2(0.5, 0.5) },
  `uniform float uTime;
   uniform vec2 uMouse;
   varying vec2 vUv;

   void main() {
     vUv = uv;
     vec3 pos = position;
     float dist = distance(uv, uMouse);
     pos.z += sin(dist * 10.0 - uTime * 2.0) * 0.1;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
   }`,
  `uniform float uTime;
   varying vec2 vUv;

   void main() {
     vec3 color1 = vec3(0.94, 0.56, 0.56);
     vec3 color2 = vec3(0.89, 0.48, 0.66);
     vec3 color3 = vec3(0.93, 0.57, 0.35);
     vec3 color = mix(color1, color2, vUv.y);
     color = mix(color, color3, vUv.x);
     gl_FragColor = vec4(color, 1.0);
   }`
);

extend({ WaveShaderMaterial });

const Waves = () => {
  const ref = useRef();
  const [mouse, setMouse] = useState(new THREE.Vector2(0.5, 0.5));

  const { uMouse } = useSpring({
    uMouse: mouse,
    config: { mass: 5, tension: 350, friction: 40 },
  });

  useFrame(({ clock }) => {
    ref.current.uTime = clock.getElapsedTime();
  });

  return (
    <mesh>
      <planeGeometry args={[10, 10, 100, 100]} />
      <a.waveShaderMaterial ref={ref} uMouse={uMouse} />
    </mesh>
  );
};

const ThreeScene = () => {
  const [mouse, setMouse] = useState(new THREE.Vector2(0.5, 0.5));

  const handleMouseMove = (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    setMouse(new THREE.Vector2(x * 0.5 + 0.5, y * 0.5 + 0.5));
  };

  return (
    <Canvas
      style={{
        height: '100vh',
        background: 'linear-gradient(247deg, rgba(240, 144, 144, 0.83) 0%, #e379a9 50.01%, #ee9258 100%)',
      }}
      onMouseMove={handleMouseMove}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Waves />
    </Canvas>
  );
};

export default ThreeScene;