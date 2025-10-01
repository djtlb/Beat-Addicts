import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  role: string;
  subscription_tier: string;
  is_admin: boolean;
}

interface Subscription {
  id: string;
  user_id: string;
  subscription_tier: string;
  status: string;
  expires_at?: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  subscription: Subscription | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  hasAccess: (requiredTier?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    subscription: null,
    loading: true,
  });

  console.log('🔐 Auth Provider initialized');

  // Load user profile
  const loadUserProfile = async (userId: string) => {
    try {
      console.log('👤 Loading user profile for:', userId);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.log('Profile not found, creating new profile');
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            role: 'user',
            subscription_tier: 'free',
            is_admin: false
          })
          .select()
          .single();

        if (createError) {
          console.error('Failed to create profile:', createError);
          return null;
        }

        console.log('✅ Created new user profile');
        return newProfile;
      }

      console.log('✅ User profile loaded:', profile);
      return profile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  // Load user subscription
  const loadUserSubscription = async (userId: string) => {
    try {
      console.log('💳 Loading user subscription for:', userId);
      
      const { data: subscription, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading subscription:', error);
        return null;
      }

      if (!subscription) {
        console.log('No active subscription found, creating free tier');
        // Create free tier subscription
        const { data: newSubscription, error: createError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: userId,
            subscription_tier: 'free',
            status: 'active'
          })
          .select()
          .single();

        if (createError) {
          console.error('Failed to create subscription:', createError);
          return null;
        }

        console.log('✅ Created free tier subscription');
        return newSubscription;
      }

      console.log('✅ User subscription loaded:', subscription);
      return subscription;
    } catch (error) {
      console.error('Error loading user subscription:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setAuthState(prev => ({ ...prev, loading: false }));
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('👤 User session found:', session.user.email);
          
          // Load profile and subscription
          const [profile, subscription] = await Promise.all([
            loadUserProfile(session.user.id),
            loadUserSubscription(session.user.id)
          ]);

          setAuthState({
            user: session.user,
            session: session,
            profile,
            subscription,
            loading: false
          });
        } else {
          console.log('❌ No user session found');
          if (mounted) {
            setAuthState(prev => ({ ...prev, loading: false }));
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);

      if (session?.user && mounted) {
        const [profile, subscription] = await Promise.all([
          loadUserProfile(session.user.id),
          loadUserSubscription(session.user.id)
        ]);

        setAuthState({
          user: session.user,
          session: session,
          profile,
          subscription,
          loading: false
        });
      } else {
        if (mounted) {
          setAuthState({
            user: null,
            session: null,
            profile: null,
            subscription: null,
            loading: false
          });
        }
      }
    });

    return () => {
      mounted = false;
      authSubscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Signing in user:', email);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    console.log('✅ User signed in successfully');
  };

  const signUp = async (email: string, password: string) => {
    console.log('📝 Signing up user:', email);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }
    console.log('✅ User signed up successfully');
  };

  const signOut = async () => {
    console.log('🚪 Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    console.log('✅ User signed out successfully');
  };

  const isAdmin = (): boolean => {
    const adminStatus = authState.profile?.is_admin === true;
    console.log('🛡️ Admin check:', adminStatus, 'for user:', authState.user?.email);
    return adminStatus;
  };

  const hasAccess = (requiredTier: string = 'free'): boolean => {
    // Admin always has access
    if (isAdmin()) {
      console.log('👑 Admin access granted for tier:', requiredTier);
      return true;
    }

    const userTier = authState.subscription?.subscription_tier || authState.profile?.subscription_tier || 'free';
    console.log('🎟️ Access check:', { userTier, requiredTier });

    // Define tier hierarchy
    const tierLevels = {
      'free': 0,
      'pro': 1,
      'studio': 2
    };

    const userLevel = tierLevels[userTier as keyof typeof tierLevels] ?? 0;
    const requiredLevel = tierLevels[requiredTier as keyof typeof tierLevels] ?? 0;

    const hasAccess = userLevel >= requiredLevel;
    console.log('✅ Access result:', hasAccess);
    return hasAccess;
  };

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    isAdmin,
    hasAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};