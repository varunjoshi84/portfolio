import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { Project } from '@shared/schema';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Skeleton } from './ui/skeleton';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import ProjectForm from './ProjectForm';

export default function ProjectList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/projects/${id}`, null);
    },
    onSuccess: () => {
      toast({
        title: "Project deleted",
        description: "The project has been removed from your portfolio",
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setProjectToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete project: " + error.message,
        variant: "destructive",
        duration: 5000,
      });
    }
  });
  
  const confirmDelete = (id: number) => {
    setProjectToDelete(id);
  };
  
  const deleteProject = () => {
    if (projectToDelete) {
      deleteProjectMutation.mutate(projectToDelete);
    }
  };
  
  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Projects</h2>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-dark p-4 rounded-lg flex items-center">
              <Skeleton className="h-10 w-10 rounded mr-4" />
              <div className="flex-grow">
                <Skeleton className="h-6 w-1/4 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-8 w-16 ml-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Failed to load projects. Please try again later.</p>
        <p className="text-sm mt-2">{String(error)}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Projects</h2>
      </div>

      {projects?.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p>No projects found. Click the 'Add New Project' button to create your first project.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-dark">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date Added</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Technologies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-darker divide-y divide-slate-800">
              {projects?.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-slate-800">
                        <img 
                          src={project.imageUrl || "https://via.placeholder.com/100"} 
                          alt={`${project.title} thumbnail`} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{project.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{project.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {format(new Date(project.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="inline-flex text-xs leading-5 font-semibold rounded bg-slate-800 px-2 py-1 text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      className="text-primary hover:text-primary/80 mr-3"
                      disabled={true} // Would implement edit functionality in a real app
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="text-accent hover:text-accent/80"
                      onClick={() => confirmDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <DialogContent className="bg-darker border border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-white">Are you sure you want to delete this project? This action cannot be undone.</p>
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setProjectToDelete(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={deleteProject} 
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
