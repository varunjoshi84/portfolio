import NavigationBar from './NavigationBar';
import Dashboard from './Dashboard';
import Footer from './Footer';
import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'wouter';

export default function AdminView() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-darker">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-dark">
      <NavigationBar isAdmin={true} />
      <Dashboard />
      <Footer />
    </div>
  );
}
