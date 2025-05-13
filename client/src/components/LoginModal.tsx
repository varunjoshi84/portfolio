import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" })
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginModal() {
  const { isLoginModalOpen, toggleLoginModal, login, loginError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    await login(data.username, data.password);
    setIsSubmitting(false);
  };
  
  return (
    <Dialog open={isLoginModalOpen} onOpenChange={toggleLoginModal}>
      <DialogContent className="bg-darker w-full max-w-md rounded-xl border border-primary/20 shadow-xl glow">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-white">Admin Login</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLoginModal} 
              className="text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <DialogDescription className="text-slate-400">
            Enter your credentials to access the admin dashboard
          </DialogDescription>
        </DialogHeader>
        
        {loginError && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-2 rounded-md text-sm mb-4">
            {loginError}
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="text-slate-300">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter username" 
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
              name="password"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="text-slate-300">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter password" 
                      className="w-full px-4 py-3 bg-dark border border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition outline-none text-white" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full px-5 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition shadow-lg shadow-primary/20"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
