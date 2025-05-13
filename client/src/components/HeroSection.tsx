import { Link } from 'wouter';

export default function HeroSection() {
  return (
    <section id="home" className="relative h-screen flex items-center bg-gradient-to-b from-gray-900 to-slate-900">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full filter blur-3xl"></div>
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
