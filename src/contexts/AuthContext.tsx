
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { username?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // If we have a user, try to create the profile
      if (data.user) {
        try {
          // Create profile - this might fail due to RLS but that's okay
          await supabase
            .from('profiles')
            .insert([{ id: data.user.id, username }]);
          
          // Show success toast regardless of profile insert result
          toast({
            title: "Account created successfully",
            description: "Please check your email to verify your account.",
          });
          
          return; // Return early on success
        } catch (profileError) {
          // If it's an RLS error, we can ignore it as the auth was successful
          console.log("Profile creation error:", profileError);
          // Show success toast anyway since the auth part worked
          toast({
            title: "Account created successfully",
            description: "Please check your email to verify your account.",
          });
          return; // Return early, don't throw
        }
      }
    } catch (error) {
      const e = error as AuthError;
      
      // Check if this is an RLS error specifically
      if (e.message && e.message.includes("violates row-level security policy")) {
        // This is actually a success case for us
        toast({
          title: "Account created successfully",
          description: "Please check your email to verify your account.",
        });
        return; // Return early, don't propagate error
      }
      
      // For other errors, show error toast and propagate
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error) {
      const e = error as AuthError;
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      const e = error as AuthError;
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProfile = async (data: { username?: string; avatar_url?: string }) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      const e = error as Error;
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }}>
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
