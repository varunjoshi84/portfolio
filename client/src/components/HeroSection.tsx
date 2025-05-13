import { Link } from 'wouter';
import { useEffect } from 'react';

export default function HeroSection() {
  // Smooth scroll functionality
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-b from-gray-900 to-slate-900 py-20 md:py-0">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 right-1/4 w-52 sm:w-64 md:w-72 h-52 sm:h-64 md:h-72 bg-primary/20 rounded-full filter blur-3xl pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-secondary/20 rounded-full filter blur-3xl pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 bg-accent/20 rounded-full filter blur-3xl pulse-slow"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 z-10 relative">
        <div className="max-w-2xl">
          <h1 className="slide-right text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4">
            Creative <span className="gradient-text">Developer</span> Portfolio
          </h1>
          <p className="slide-right delay-100 text-lg sm:text-xl text-slate-300 mb-8">
            Building immersive digital experiences with modern technologies
          </p>
          <div className="slide-right delay-200 flex flex-wrap gap-4">
            <a 
              href="#projects" 
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg shadow-primary/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all duration-300"
            >
              View Projects
            </a>
            <a 
              href="#contact" 
              className="px-6 py-3 border border-primary text-primary hover:bg-primary/10 rounded-lg hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
