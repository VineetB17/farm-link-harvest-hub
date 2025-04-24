
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user'; // Import our extended User type

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, farmName?: string, location?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Type cast to our extended User type
      setUser(session?.user as User || null);
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }

    toast({
      title: 'Login Successful',
      description: `Welcome back, ${data.user?.email}!`,
    });
  };

  const signup = async (name: string, email: string, password: string, farmName?: string, location?: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          farmName,
          location
        }
      }
    });

    if (error) {
      toast({
        title: 'Signup Failed',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }

    toast({
      title: 'Account Created',
      description: `Welcome to FarmLink, ${name}!`,
    });
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }

    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) return;

    const { error } = await supabase.auth.updateUser({
      data: userData
    });

    if (error) {
      toast({
        title: 'Profile Update Failed',
        description: error.message,
        variant: 'destructive'
      });
      throw error;
    }

    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been successfully updated',
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
