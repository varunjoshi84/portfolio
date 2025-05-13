import { useEffect, useState, useRef } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import { ArrowLeft, ExternalLink, Image } from 'lucide-react';
import { Link } from 'wouter';

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'web app':
      return 'text-primary bg-primary/20';
    case '3d app':
      return 'text-secondary bg-secondary/20';
    case 'dashboard':
      return 'text-accent bg-accent/20';
    case 'mobile app':
      return 'text-primary bg-primary/20';
    default:
      return 'text-slate-300 bg-slate-700';
  }
};

export default function ProjectDetail() {
  const [, params] = useRoute('/project/:id');
  const projectId = params?.id ? parseInt(params.id) : null;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch project details
  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Invalid project ID");
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
    enabled: !!projectId,
  });

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker flex flex-col">
        <NavigationBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-darker flex flex-col">
        <NavigationBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-red-500 mb-4">Error Loading Project</h1>
            <p className="text-slate-300 mb-6">We couldn't find the project you're looking for.</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darker flex flex-col">
      <NavigationBar />
      
      <main className="flex-grow pt-20">
        {/* Hero section with main image */}
        <div className="w-full h-96 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-darker z-10"></div>
          <img 
            src={project.imageUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1920&h=500"} 
            alt={project.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-0 left-0 w-full p-8 z-20">
            <div className="container mx-auto">
              <Badge 
                variant="outline" 
                className={`rounded-full px-3 py-1 text-xs font-semibold mb-4 ${getCategoryColor(project.category)}`}
              >
                {project.category}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 slide-right">{project.title}</h1>
            </div>
          </div>
        </div>
        
        {/* Project content */}
        <div className="container mx-auto px-4 py-12" ref={sectionRef}>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main content */}
            <div className="flex-grow">
              <div className={`bg-dark rounded-xl p-8 mb-8 border border-slate-800 ${isVisible ? 'scale-in' : 'opacity-0'}`}>
                <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
                <p className="text-slate-300 mb-6">{project.description}</p>
                
                <div className="border-t border-slate-800 pt-6 mt-6">
                  <h3 className="text-xl font-bold mb-4">Detailed Description</h3>
                  <p className="text-slate-300 whitespace-pre-line">
                    {project.detailedDescription || project.description}
                  </p>
                </div>
              </div>
              
              {/* Screenshots gallery */}
              <div className={`bg-dark rounded-xl p-8 border border-slate-800 ${isVisible ? 'scale-in delay-100' : 'opacity-0'}`}>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Image className="w-5 h-5 mr-2" />
                  Project Screenshots
                </h2>
                
                {project.screenshots && project.screenshots.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.screenshots.map((screenshot, index) => (
                      <div 
                        key={index} 
                        className="rounded-lg overflow-hidden border border-slate-700 transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                      >
                        <img 
                          src={screenshot} 
                          alt={`${project.title} screenshot ${index + 1}`} 
                          className="w-full h-auto object-cover" 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 border border-dashed border-slate-700 rounded-lg">
                    <p>No screenshots available for this project</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Project information sidebar */}
            <div className="lg:w-1/3">
              <div className={`bg-dark rounded-xl p-6 border border-slate-800 sticky top-24 ${isVisible ? 'slide-right delay-200' : 'opacity-0'}`}>
                <h3 className="text-xl font-bold mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="text-xs bg-slate-800 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Category</h4>
                    <p className="text-white">{project.category}</p>
                  </div>
                  
                  {project.projectUrl && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-1">Live Demo</h4>
                      <a 
                        href={project.projectUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center"
                      >
                        Visit Project <ExternalLink className="ml-2 w-3 h-3" />
                      </a>
                    </div>
                  )}
                  
                  <div className="pt-4 mt-4 border-t border-slate-800">
                    <Link to="/#projects">
                      <Button variant="outline" className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}