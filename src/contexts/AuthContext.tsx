import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  farmName?: string;
  location?: string;
  phone?: string;
  joinDate?: string;
  profileImage?: string;
  farmType?: string;
  farmSize?: string;
  employeeCount?: string;
  mainCrops?: string;
  certifications?: string;
  yearEstablished?: string;
  website?: string;
  bioDescription?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string, farmName?: string, location?: string) => void;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

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
    let userData: User;
    
    if (email === 'demo@farmlink.com' && password === 'password123') {
      userData = {
        id: 'demo-user-1',
        name: 'Demo User',
        email: 'demo@farmlink.com',
        farmName: 'Demo Farm',
        location: 'Delhi, India',
        phone: '+91 7303231776',
        joinDate: 'April 2023',
        farmType: 'Organic Farm',
        farmSize: '25 acres',
        employeeCount: '12',
        mainCrops: 'Wheat, Rice, Vegetables',
        certifications: 'Organic, Fair Trade',
        yearEstablished: '2010',
        website: 'www.demofarm.com',
        bioDescription: 'A sustainable farm focusing on organic produce and fair trade practices.'
      };
    } else if (email === 'ritesh77@gmail.com' && password === 'password123') {
      userData = {
        id: 'user-ritesh',
        name: 'Ritesh Kumar',
        email: 'ritesh77@gmail.com',
        farmName: 'Green Valley Farms',
        location: 'Amritsar, Punjab',
        phone: '+91 7303231776',
        joinDate: 'January 2023',
        farmType: 'Mixed Farm',
        farmSize: '40 acres',
        employeeCount: '15',
        mainCrops: 'Wheat, Corn, Vegetables',
        certifications: 'Organic',
        yearEstablished: '2008',
        website: 'www.greenvalleyfarms.com',
        bioDescription: 'Family-owned farm focusing on sustainable farming practices.'
      };
    } else {
      userData = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        phone: '+91 7303231776',
        joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      };
    }
    
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('farmlink_user', JSON.stringify(userData));
    
    toast({
      title: 'Login Successful',
      description: `Welcome back, ${userData.name}!`,
    });
  };

  const signup = (name: string, email: string, password: string, farmName?: string, location?: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      farmName,
      location,
      phone: '+91 7303231776',
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    };
    
    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('farmlink_user', JSON.stringify(newUser));
    
    toast({
      title: 'Account Created',
      description: `Welcome to FarmLink, ${name}!`,
    });
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...userData
    };
    
    setUser(updatedUser);
    localStorage.setItem('farmlink_user', JSON.stringify(updatedUser));
    
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been successfully updated',
    });
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
    <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout, updateUserProfile }}>
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
