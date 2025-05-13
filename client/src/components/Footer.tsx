import { Link } from 'wouter';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 sm:py-12 bg-darker border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <Link href="/" className="text-xl sm:text-2xl font-bold gradient-text">DevFolio</Link>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">Creating immersive digital experiences</p>
          </div>
          <div className="flex space-x-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition">
              <Github className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition">
              <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition">
              <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
          </div>
        </div>
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-800 text-center text-slate-400 text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} DevFolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
