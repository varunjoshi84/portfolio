import { Link } from 'wouter';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 bg-darker border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="text-2xl font-bold gradient-text">DevFolio</Link>
            <p className="text-slate-400 mt-2">Creating immersive digital experiences</p>
          </div>
          <div className="flex space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition">
              <Github className="h-6 w-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition">
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition">
              <Twitter className="h-6 w-6" />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} DevFolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
