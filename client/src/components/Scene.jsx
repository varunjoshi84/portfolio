import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Text3D, Center } from '@react-three/drei';

export default function Scene() {
  const torusRef = useRef();
  const coneRef = useRef();
  const cubeRef = useRef();
  
  useFrame((state, delta) => {
    // Rotate objects
    torusRef.current.rotation.z += delta * 0.3;
    torusRef.current.rotation.x += delta * 0.2;
    
    coneRef.current.rotation.y += delta * 0.4;
    
    cubeRef.current.rotation.y += delta * 0.2;
    cubeRef.current.rotation.x += delta * 0.3;
    
    // Pulse effect based on time
    const time = state.clock.getElapsedTime();
    const pulse = Math.sin(time * 2) * 0.05 + 1;
    
    torusRef.current.scale.set(pulse, pulse, pulse);
    coneRef.current.scale.set(pulse * 0.9, pulse * 1.1, pulse * 0.9);
    cubeRef.current.scale.set(pulse * 1.1, pulse * 1.1, pulse * 1.1);
  });
  
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.7} 
        color="#8B5CF6" 
      />
      
      {/* Secondary light */}
      <pointLight 
        position={[-5, 3, -5]} 
        intensity={0.5} 
        color="#F43F5E"
      />
      
      {/* 3D Text */}
      <Float
        speed={1.5}
        rotationIntensity={0.5}
        floatIntensity={0.5}
        position={[0, 3, -3]}
      >
        <Center>
          <Text3D
            font="/fonts/inter_bold.json"
            size={0.8}
            height={0.2}
            curveSegments={12}
          >
            3D Portfolio
            <meshStandardMaterial 
              color="#8B5CF6" 
              emissive="#8B5CF6"
              emissiveIntensity={0.5}
              roughness={0.3}
              metalness={0.8}
            />
          </Text3D>
        </Center>
      </Float>
      
      {/* Geometric shapes */}
      <group position={[0, -1, 0]}>
        {/* Torus */}
        <mesh ref={torusRef} position={[-2.5, 0, 0]}>
          <torusGeometry args={[1, 0.4, 16, 32]} />
          <meshStandardMaterial 
            color="#8B5CF6" 
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        
        {/* Cone */}
        <mesh ref={coneRef} position={[0, 0.5, 0]}>
          <coneGeometry args={[1, 2, 32]} />
          <meshStandardMaterial 
            color="#10B981" 
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
        
        {/* Cube */}
        <mesh ref={cubeRef} position={[2.5, 0, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial 
            color="#F43F5E" 
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </group>
      
      {/* Sparkles */}
      <Sparkles 
        count={100}
        scale={10}
        size={4}
        speed={0.3}
        color="#8B5CF6"
      />
    </>
  );
}
