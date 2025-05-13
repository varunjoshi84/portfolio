import { Project } from '@shared/schema';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';
import { ChevronRight } from 'lucide-react';
import { Link } from 'wouter';

interface ProjectCardProps {
  project: Project;
}

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

export default function ProjectCard({ project }: ProjectCardProps) {
  const { 
    title, 
    description, 
    category, 
    imageUrl, 
    technologies, 
    projectUrl,
    screenshots,
    detailedDescription,
    id
  } = project;

  return (
    <Card className="bg-dark rounded-xl overflow-hidden border border-slate-800 card-hover h-full flex flex-col">
      <div className="h-40 sm:h-48 overflow-hidden">
        <img 
          src={imageUrl || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&h=400"} 
          alt={`${title} project`} 
          loading="lazy"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      <CardContent className="p-4 sm:p-6 flex-grow flex flex-col">
        <Badge 
          variant="outline" 
          className={`rounded-full px-2 sm:px-3 py-1 text-xs font-semibold ${getCategoryColor(category)}`}
        >
          {category}
        </Badge>
        
        <h3 className="text-lg sm:text-xl font-bold mt-2 sm:mt-3 mb-1 sm:mb-2">{title}</h3>
        <p className="text-slate-400 text-sm sm:text-base mb-3 sm:mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4 mt-auto">
          {Array.isArray(technologies) ? (
            technologies.map((tech: string, index: number) => (
              <span key={index} className="text-xs bg-slate-800 px-2 py-1 rounded">
                {tech}
              </span>
            ))
          ) : typeof technologies === 'string' ? (
            // If technologies is a JSON string, parse it
            JSON.parse(technologies).map((tech: string, index: number) => (
              <span key={index} className="text-xs bg-slate-800 px-2 py-1 rounded">
                {tech}
              </span>
            ))
          ) : (
            <span className="text-xs bg-slate-800 px-2 py-1 rounded">
              No technologies specified
            </span>
          )}
        </div>
        
        <div className="flex gap-4">
          {projectUrl && (
            <a 
              href={projectUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-slate-300 hover:underline text-sm font-medium flex items-center`}
            >
              Live Demo
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          )}
          
          <Link 
            to={`/project/${project.id}`}
            className={`text-${category === '3D App' ? 'secondary' : category === 'Dashboard' ? 'accent' : 'primary'} hover:underline text-sm font-medium flex items-center`}
          >
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
