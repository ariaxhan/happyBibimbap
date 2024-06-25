import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { extend, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { useMemo } from 'react';

// ShaderMaterial for the waves
const WaveShaderMaterial = shaderMaterial(
  { uTime: 0, uMouse: new THREE.Vector2() },
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
  const { mouse } = useThree();
  
  useFrame(({ clock }) => {
    ref.current.uTime = clock.getElapsedTime();
    ref.current.uMouse = mouse;
  });

  return (
    <mesh>
      <planeBufferGeometry args={[10, 10, 100, 100]} />
      <waveShaderMaterial ref={ref} />
    </mesh>
  );
};

const ThreeScene = () => {
  return (
    <Canvas style={{ height: '100vh', background: 'linear-gradient(247deg, rgba(240, 144, 144, 0.83) 0%, #e379a9 50.01%, #ee9258 100%)' }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Waves />
    </Canvas>
  );
};

export default ThreeScene;