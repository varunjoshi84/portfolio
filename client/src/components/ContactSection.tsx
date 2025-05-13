import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { InsertMessage, Project } from '@shared/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  projectInterest: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get projects for the dropdown
  const { data: projects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  
  // Form definition
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      projectInterest: "",
      message: ""
    }
  });
  
  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async (data: InsertMessage) => {
      return await apiRequest('POST', '/api/messages', data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "We'll contact you soon.",
        duration: 5000,
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later",
        variant: "destructive",
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  });
  
  // Form submission handler
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    submitMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-24 bg-dark relative">
      <div className="absolute inset-0 bg-gradient-to-b from-darker to-dark z-0"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get In <span className="gradient-text">Touch</span></h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? Send me a message and I'll get back to you as soon as possible.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="bg-darker p-8 rounded-xl border border-primary/20 shadow-xl glow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name" 
                          className="w-full px-4 py-3 bg-dark border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your email" 
                          type="email"
                          className="w-full px-4 py-3 bg-dark border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="projectInterest"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-slate-300">Interested in a project? (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-3 bg-dark border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-white">
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-dark border border-slate-700">
                        <SelectItem value="none">None</SelectItem>
                        {projects && projects.map((project: Project) => (
                          <SelectItem key={project.id} value={project.title}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-slate-300">Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Your message" 
                        className="w-full px-4 py-3 bg-dark border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-white resize-none"
                        rows={5}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-white rounded-lg transition shadow-lg shadow-primary/20 flex items-center justify-center"
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                {!isSubmitting && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
