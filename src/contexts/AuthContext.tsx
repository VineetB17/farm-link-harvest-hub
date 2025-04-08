
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  farmName?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('farmlink_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    }
  }, []);

  const login = (email: string, password: string) => {
    // In a real app, this would call an API to validate credentials
    // For demo purposes, we'll accept any email/password combination
    // or use a hardcoded demo account
    
    let userData: User;
    
    if (email === 'demo@farmlink.com' && password === 'password123') {
      userData = {
        id: 'demo-user-1',
        name: 'Demo User',
        email: 'demo@farmlink.com',
        farmName: 'Demo Farm',
        location: 'Portland, OR'
      };
    } else {
      // Generate a user based on the provided email
      userData = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
      };
    }
    
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('farmlink_user', JSON.stringify(userData));
  };

  const signup = (name: string, email: string, password: string) => {
    // In a real app, this would call an API to create a user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
    };
    
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('farmlink_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('farmlink_user');
    
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
