import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';
import { InsertMessage, Project } from '@shared/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Get projects for the dropdown
  const { data: projects } = useQuery<Project[]>({
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
    <section 
      id="contact" 
      ref={sectionRef}
      className="py-16 sm:py-20 md:py-24 bg-dark relative overflow-hidden"
    >
      {/* Background elements with animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-darker to-dark z-0">
        <div className="absolute top-1/3 right-1/5 w-32 sm:w-40 h-32 sm:h-40 bg-primary/10 rounded-full filter blur-3xl pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/5 w-48 sm:w-60 h-48 sm:h-60 bg-secondary/10 rounded-full filter blur-3xl pulse-slow"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-10 md:mb-16 ${isVisible ? 'slide-up' : 'opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get In <span className="gradient-text">Touch</span></h2>
            <p className="text-slate-300 max-w-2xl mx-auto px-2">
              Have a project in mind or want to collaborate? Send me a message and I'll get back to you as soon as possible.
            </p>
          </div>
          
          <div className={`${isVisible ? 'scale-in delay-200' : 'opacity-0'}`}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="bg-darker p-4 sm:p-6 md:p-8 rounded-xl border border-primary/20 shadow-xl glow hover:shadow-primary/30 transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your name" 
                            className="bg-white text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none" 
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
                            className="bg-white text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none" 
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
                          <SelectTrigger className="bg-white text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none">
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border border-slate-300 text-black">
                          <SelectItem value="none" className="text-black hover:bg-slate-100">None</SelectItem>
                          {projects && projects.map((project: Project) => (
                            <SelectItem key={project.id} value={project.title} className="text-black hover:bg-slate-100">
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
                          className="bg-white text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none resize-none"
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
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-95 flex items-center justify-center"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  {!isSubmitting && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
