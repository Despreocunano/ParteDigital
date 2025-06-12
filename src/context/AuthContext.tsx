import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: Error | null }>;
  signUp: (email: string, password: string, groomName?: string, brideName?: string) => Promise<{ success: boolean; error: Error | null }>;
  signOut: () => Promise<void>;
  hasLandingPage: boolean;
  setHasLandingPage: (hasLandingPage: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasLandingPage, setHasLandingPage] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check active sessions and sets the user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Check if user has a landing page
        const { data: landingPageData, error: landingPageError } = await supabase
          .from('landing_pages')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (landingPageError && landingPageError.code !== 'PGRST116') {
          console.error('Error checking landing page on auth init:', landingPageError);
        }
        setHasLandingPage(!!landingPageData);
      }

      setLoading(false);
    };

    initializeAuth();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      // When auth state changes (e.g., sign in/out), re-check landing page status
      if (session?.user) {
        supabase.from('landing_pages').select('id').eq('user_id', session.user.id).single()
          .then(({ data: landingPageData, error: landingPageError }) => {
            if (landingPageError && landingPageError.code !== 'PGRST116') {
              console.error('Error re-checking landing page on auth state change:', landingPageError);
            }
            setHasLandingPage(!!landingPageData);
          });
      } else {
        setHasLandingPage(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error };
    }
  };

  const signUp = async (email: string, password: string, groomName?: string, brideName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            groom_name: groomName,
            bride_name: brideName,
          },
        },
      });
      if (error) {
        return { success: false, error };
      }
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setHasLandingPage(false);
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    hasLandingPage,
    setHasLandingPage
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