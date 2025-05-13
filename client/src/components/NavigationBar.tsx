import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

interface NavigationBarProps {
  isAdmin?: boolean;
}

export default function NavigationBar({ isAdmin = false }: NavigationBarProps) {
  const [, setLocation] = useLocation();
  const { isAuthenticated, toggleLoginModal, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  if (isAdmin) {
    return (
      <nav className={`fixed top-0 left-0 w-full z-50 bg-darker/90 backdrop-blur-md border-b border-primary/20 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold gradient-text">DevFolio</Link>
            <span className="ml-4 px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">Admin</span>
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={handleLogout} className="text-slate-300 hover:text-accent transition flex items-center">
              <span className="mr-2">Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 8a1 1 0 10-2 0v3a1 1 0 102 0v-3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 bg-darker/80 backdrop-blur-md border-b border-primary/10 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold gradient-text">DevFolio</Link>
        <div className="flex space-x-4 md:space-x-8">
          <a href="#home" className="text-slate-200 hover:text-primary transition">Home</a>
          <a href="#projects" className="text-slate-200 hover:text-primary transition">Projects</a>
          <a href="#contact" className="text-slate-200 hover:text-primary transition">Contact</a>
          <button 
            onClick={isAuthenticated ? () => setLocation('/admin') : toggleLoginModal} 
            className="text-slate-200 hover:text-primary transition"
          >
            Admin
          </button>
        </div>
      </div>
    </nav>
  );
}
