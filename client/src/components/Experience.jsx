import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function Experience() {
  const particlesCount = 2000;
  const positions = useRef(new Float32Array(particlesCount * 3));
  const colors = useRef(new Float32Array(particlesCount * 3));
  
  const particlesRef = useRef();
  const groupRef = useRef();
  
  // Generate particles
  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    
    // Positions - scatter in a sphere
    const radius = Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions.current[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions.current[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions.current[i3 + 2] = radius * Math.cos(phi);
    
    // Colors - using primary, secondary, accent
    const colorChoice = Math.random();
    if (colorChoice < 0.33) {
      // Primary - purple
      colors.current[i3] = 0.55;
      colors.current[i3 + 1] = 0.36;
      colors.current[i3 + 2] = 0.96;
    } else if (colorChoice < 0.66) {
      // Secondary - teal
      colors.current[i3] = 0.16;
      colors.current[i3 + 1] = 0.73;
      colors.current[i3 + 2] = 0.51;
    } else {
      // Accent - pink
      colors.current[i3] = 0.96;
      colors.current[i3 + 1] = 0.25;
      colors.current[i3 + 2] = 0.37;
    }
  }
  
  useFrame((state, delta) => {
    // Rotate the group
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      
      // Get mouse position and apply subtle movement
      const { mouse } = state;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.y * 0.2,
        0.1
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -mouse.x * 0.2,
        0.1
      );
    }
    
    // Animate the particles
    if (particlesRef.current) {
      // Pulse effect
      const elapsedTime = state.clock.getElapsedTime();
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        // Get current position
        const x = positions.current[i3];
        const y = positions.current[i3 + 1];
        const z = positions.current[i3 + 2];
        
        // Calculate distance from center
        const distance = Math.sqrt(x*x + y*y + z*z);
        
        // Apply sine wave based on distance and time
        const amplitude = 0.1 * Math.sin(distance * 2 + elapsedTime);
        
        // Update position attribute
        particlesRef.current.geometry.attributes.position.array[i3] = x * (1 + amplitude);
        particlesRef.current.geometry.attributes.position.array[i3 + 1] = y * (1 + amplitude);
        particlesRef.current.geometry.attributes.position.array[i3 + 2] = z * (1 + amplitude);
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={positions.current}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particlesCount}
            array={colors.current}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          sizeAttenuation={true}
          vertexColors
          transparent
          opacity={0.8}
        />
      </points>
    </group>
  );
}
