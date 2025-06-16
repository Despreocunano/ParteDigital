import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { getWelcomeTemplate, getSignatureTemplate } from '../templates/emailTemplates';

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
  resetPassword: (email: string) => Promise<{
    success: boolean;
    error: Error | null;
  }>;
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

      // Enviar correo de bienvenida
      try {
        const { data: landingPage, error: landingError } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!landingError) {
          const landingUrl = landingPage?.slug 
            ? `https://tuparte.digital/invitacion/${landingPage.slug}`
            : 'https://panel.tuparte.digital';

          const signature = getSignatureTemplate(groomName, brideName);
          const message = getWelcomeTemplate({ 
            attendee: { 
              id: user.id,
              first_name: groomName,
              last_name: null,
              email: email,
              phone: null,
              user_id: user.id,
              rsvp_status: 'pending',
              table_id: null,
              dietary_restrictions: null,
              needs_accommodation: false,
              accommodation_notes: null,
              has_plus_one: false,
              plus_one_name: null,
              plus_one_dietary_restrictions: null,
              plus_one_rsvp_status: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, 
            landingUrl, 
            signature 
          });

          await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.id}`,
            },
            body: JSON.stringify({
              attendeeId: user.id,
              subject: '¡Bienvenido/a a Tu Parte Digital!',
              message,
            }),
          });
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // No retornamos error aquí para no interrumpir el flujo de registro
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

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `https://panel.tuparte.digital/auth?showLogin=true&resetPassword=true`,
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

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
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