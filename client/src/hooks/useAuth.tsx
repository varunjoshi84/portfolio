import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  loginError: string | null;
  isLoginModalOpen: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  toggleLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/status', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoginError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        setLoginError(errorData.message || 'Invalid username or password');
        return false;
      }
      
      const userData = await response.json();
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
      return true;
    } catch (error) {
      setLoginError('Network error. Please try again.');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiRequest('POST', '/api/auth/logout', null);
      setIsAuthenticated(false);
      queryClient.invalidateQueries();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const toggleLoginModal = () => {
    setIsLoginModalOpen(!isLoginModalOpen);
    setLoginError(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isLoading, 
        loginError, 
        isLoginModalOpen, 
        login, 
        logout, 
        toggleLoginModal 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
