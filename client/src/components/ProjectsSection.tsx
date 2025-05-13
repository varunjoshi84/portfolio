import { useQuery } from '@tanstack/react-query';
import ProjectCard from './ProjectCard';
import { Project } from '@shared/schema';
import { Skeleton } from './ui/skeleton';
import { useEffect, useRef, useState } from 'react';

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  
  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
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

  // Placeholder for loading state
  const LoadingSkeletons = () => (
    <>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-dark rounded-xl overflow-hidden border border-slate-800 p-6">
          <Skeleton className="w-full h-48 mb-4" />
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="flex gap-2 mb-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </>
  );

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="py-16 sm:py-20 md:py-24 bg-darker relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute -right-40 -top-40 w-60 sm:w-80 h-60 sm:h-80 bg-primary/5 rounded-full filter blur-3xl"></div>
      <div className="absolute -left-40 -bottom-40 w-60 sm:w-80 h-60 sm:h-80 bg-secondary/5 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`text-center mb-10 sm:mb-16 ${isVisible ? 'slide-up' : 'opacity-0'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">My <span className="gradient-text">Projects</span></h2>
          <p className="text-slate-300 max-w-2xl mx-auto px-2">
            A collection of my latest work showcasing my skills and creative approach to problem solving.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {isLoading ? (
            <LoadingSkeletons />
          ) : error ? (
            <div className="col-span-full text-center text-red-500">
              <p>Failed to load projects. Please try again later.</p>
            </div>
          ) : projects?.length === 0 ? (
            <div className="col-span-full text-center text-slate-400">
              <p>No projects found. Check back later!</p>
            </div>
          ) : (
            projects?.map((project, index) => (
              <div 
                key={project.id} 
                className={`${isVisible ? 'scale-in' : 'opacity-0'}`}
                style={{animationDelay: `${100 + (index * 100)}ms`}}
              >
                <ProjectCard project={project} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
