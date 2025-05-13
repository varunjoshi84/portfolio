import { Suspense } from 'react';
import { Link } from 'wouter';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Scene from './Scene';
import Experience from './Experience';

export default function HeroSection() {
  return (
    <section id="home" className="relative h-screen flex items-center">
      <div className="canvas-container">
        <Suspense fallback={null}>
          <Canvas shadows dpr={[1, 2]}>
            <color attach="background" args={['#0F172A']} />
            <fog attach="fog" args={['#0F172A', 5, 18]} />
            <Scene />
            <Experience />
            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 6} />
          </Canvas>
        </Suspense>
      </div>
      <div className="container mx-auto px-6 z-10 relative">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Creative <span className="gradient-text">Developer</span> Portfolio</h1>
          <p className="text-xl text-slate-300 mb-8">Building immersive digital experiences with modern technologies</p>
          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition shadow-lg shadow-primary/20">View Projects</a>
            <a href="#contact" className="px-6 py-3 border border-primary text-primary hover:bg-primary/10 rounded-lg transition">Get in Touch</a>
          </div>
        </div>
      </div>
    </section>
  );
}
