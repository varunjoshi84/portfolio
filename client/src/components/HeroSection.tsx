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
    <section id="home" className="relative h-screen flex items-center bg-gradient-to-b from-gray-900 to-slate-900">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full filter blur-3xl pulse-slow"></div>
      </div>
      
      <div className="container mx-auto px-6 z-10 relative">
        <div className="max-w-2xl">
          <h1 className="slide-right text-5xl md:text-7xl font-bold mb-4">
            Creative <span className="gradient-text">Developer</span> Portfolio
          </h1>
          <p className="slide-right delay-100 text-xl text-slate-300 mb-8">
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
          
          <div className="mt-12 fade-in delay-500">
            <a 
              href="#projects" 
              className="flex flex-col items-center text-white/70 hover:text-white transition-colors"
              aria-label="Scroll down"
            >
              <span className="text-sm mb-2">Scroll Down</span>
              <div className="w-8 h-8 flex items-center justify-center bounce">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
