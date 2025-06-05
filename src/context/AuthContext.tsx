import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  signUp: (email: string, password: string, groomName: string, brideName: string) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return {
        success: !error,
        error,
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
      };
    }
  };

  const signUp = async (email: string, password: string, groomName: string, brideName: string) => {
    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError || !user) {
        return {
          success: false,
          error: signUpError,
        };
      }

      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            groom_name: groomName,
            bride_name: brideName,
          },
        ]);

      if (profileError) {
        return {
          success: false,
          error: profileError,
        };
      }

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}