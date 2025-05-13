import { useQuery } from '@tanstack/react-query';
import ProjectCard from './ProjectCard';
import { Project } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectsSection() {
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

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
    <section id="projects" className="py-24 bg-darker relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">My <span className="gradient-text">Projects</span></h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            A collection of my latest work showcasing my skills and creative approach to problem solving.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            projects?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
