import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { InsertProject } from '@shared/schema';
import { Plus, Trash2 } from 'lucide-react';

// Extended schema for project form
const projectFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  imageUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  technologies: z.string().min(1, { message: "Technologies are required" }),
  projectUrl: z.string().url({ message: "Must be a valid URL" }).optional().or(z.literal('')),
  detailedDescription: z.string().optional().or(z.literal('')),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  onComplete?: () => void;
}

export default function ProjectForm({ onComplete }: ProjectFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>([]);
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      imageUrl: "",
      technologies: "",
      projectUrl: "",
      detailedDescription: "",
      screenshots: []
    }
  });
  
  const projectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      return await apiRequest('POST', '/api/projects', data);
    },
    onSuccess: () => {
      toast({
        title: "Project added successfully",
        description: "Your new project is now published",
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      form.reset();
      if (onComplete) onComplete();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to add project",
        description: error.message || "Please try again later",
        variant: "destructive",
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  });
  
  const onSubmit = (data: ProjectFormValues) => {
    setIsSubmitting(true);
    
    // Convert technologies string to array
    const technologies = data.technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech !== '');
    
    projectMutation.mutate({
      ...data,
      technologies
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Project Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter project title" 
                    className="w-full px-4 py-3 bg-darker border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-white" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full px-4 py-3 bg-darker border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-darker border border-slate-700">
                    <SelectItem value="Web App">Web App</SelectItem>
                    <SelectItem value="Mobile App">Mobile App</SelectItem>
                    <SelectItem value="3D App">3D App</SelectItem>
                    <SelectItem value="Dashboard">Dashboard</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="text-slate-300">Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter project description" 
                  className="w-full px-4 py-3 bg-darker border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-white resize-none"
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <FormField
            control={form.control}
            name="technologies"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Technologies Used</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. React, Node.js, Three.js" 
                    className="w-full px-4 py-3 bg-darker border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-white" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="projectUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Project URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com" 
                    className="w-full px-4 py-3 bg-darker border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-white" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Image URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/image.jpg" 
                    className="w-full px-4 py-3 bg-darker border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-white" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onComplete} 
            className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-dark mr-2"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg shadow-primary/20"
          >
            {isSubmitting ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
