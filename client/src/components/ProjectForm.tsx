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
      detailedDescription: ""
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
  
  // Handle adding and removing screenshots
  const addScreenshot = () => {
    if (newScreenshotUrl && newScreenshotUrl.trim() !== '') {
      // Validate URL format
      try {
        new URL(newScreenshotUrl);
        setScreenshotUrls([...screenshotUrls, newScreenshotUrl]);
        setNewScreenshotUrl('');
      } catch (e) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid URL for the screenshot",
          variant: "destructive",
        });
      }
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshotUrls(screenshotUrls.filter((_, i) => i !== index));
  };
  
  const onSubmit = (data: ProjectFormValues) => {
    setIsSubmitting(true);
    
    // Convert technologies string to array
    const technologies = data.technologies
      .split(',')
      .map(tech => tech.trim())
      .filter(tech => tech !== '');
    
    projectMutation.mutate({
      ...data,
      technologies,
      screenshots: screenshotUrls
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
                    className="w-full px-4 py-3 bg-white text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none" 
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
                    <SelectTrigger className="w-full px-4 py-3 bg-white text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white border border-slate-300">
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
              <FormLabel className="text-slate-300">Short Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a brief project description (shown in project cards)" 
                  className="w-full px-4 py-3 bg-white text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none resize-none"
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="detailedDescription"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel className="text-slate-300">Detailed Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a comprehensive project description (shown on project detail page)" 
                  className="w-full px-4 py-3 bg-white text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none resize-none"
                  rows={6}
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
        
        {/* Screenshots manager */}
        <div className="mb-6 p-6 bg-slate-800 border border-slate-700 rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">Project Screenshots</h3>
          
          <div className="flex items-end gap-4 mb-4">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Add Screenshot URL
              </label>
              <input
                type="url"
                value={newScreenshotUrl}
                onChange={(e) => setNewScreenshotUrl(e.target.value)}
                placeholder="https://example.com/screenshot.jpg"
                className="w-full px-4 py-3 bg-white text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none"
              />
            </div>
            <Button
              type="button"
              onClick={addScreenshot}
              className="bg-secondary hover:bg-secondary/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          
          {screenshotUrls.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-300 mb-2">Current Screenshots:</p>
              {screenshotUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded overflow-hidden bg-slate-600 mr-3">
                      <img src={url} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm text-slate-300 truncate max-w-[300px]">{url}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeScreenshot(index)}
                    className="text-red-400 hover:text-red-500 hover:bg-transparent p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No screenshots added yet</p>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onComplete} 
            className="px-4 py-2 border border-slate-300 text-slate-300 rounded-lg hover:bg-slate-800 mr-2"
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
