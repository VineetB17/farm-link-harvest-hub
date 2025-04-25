import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

interface ProfileData {
  id: string;
  name?: string;
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
  user_metadata?: {
    name?: string;
    farm_name?: string;
    location?: string;
  };
}

interface AuthContextType {
  user: ProfileData | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, farmName?: string, location?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<ProfileData>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ProfileData | null>(null);
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const { toast } = useToast();

  const transformUserData = (supabaseUser: SupabaseUser | null): ProfileData | null => {
    if (!supabaseUser) return null;
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name,
      farmName: supabaseUser.user_metadata?.farm_name,
      location: supabaseUser.user_metadata?.location,
      user_metadata: supabaseUser.user_metadata
    };
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, supabaseSession) => {
        setSession(supabaseSession);
        setUser(transformUserData(supabaseSession?.user ?? null));
      }
    );

    supabase.auth.getSession().then(({ data: { session: supabaseSession } }) => {
      setSession(supabaseSession);
      setUser(transformUserData(supabaseSession?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login Successful",
        description: `Welcome back${data.user?.email ? `, ${data.user.email}` : ''}!`,
      });

    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, farmName?: string, location?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            farm_name: farmName,
            location,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Registration Successful",
        description: "Welcome to FarmLink! Please verify your email to continue.",
      });

    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUserProfile = async (userData: Partial<ProfileData>) => {
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

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });

    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!session, 
      login, 
      signup, 
      logout, 
      updateUserProfile 
    }}>
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
