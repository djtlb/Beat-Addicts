import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserSubscription {
  subscription_tier: 'free' | 'pro' | 'studio';
  status: 'active' | 'inactive' | 'cancelled';
  expires_at?: string;
  is_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  subscription: UserSubscription | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasAccess: (requiredTier: 'free' | 'pro' | 'studio') => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('🔐 AuthProvider state:', { 
    userEmail: user?.email, 
    loading, 
    subscriptionTier: subscription?.subscription_tier 
  });

  // Admin emails with full access
  const adminEmails = ['sallykamari61@gmail.com'];

  const fetchUserSubscription = async (userId: string, userEmail: string): Promise<UserSubscription> => {
    try {
      console.log('📊 Fetching subscription for:', userEmail);
      
      // Check if user is admin
      const isAdminUser = adminEmails.includes(userEmail);
      
      if (isAdminUser) {
        console.log('👑 Admin user detected:', userEmail);
        
        try {
          // Try to fetch existing subscription
          const { data: existingSub, error: fetchError } = await supabase
            .from('user_subscriptions')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (fetchError) {
            console.log('⚠️ Error fetching admin subscription (will create):', fetchError.message);
          }

          // Create or update admin subscription
          if (!existingSub) {
            const { error: insertError } = await supabase
              .from('user_subscriptions')
              .insert({
                user_id: userId,
                subscription_tier: 'studio',
                status: 'active'
              });

            if (insertError) {
              console.error('❌ Error creating admin subscription:', insertError.message);
            } else {
              console.log('✅ Created studio subscription for admin');
            }
          } else if (existingSub.subscription_tier !== 'studio') {
            const { error: updateError } = await supabase
              .from('user_subscriptions')
              .update({ 
                subscription_tier: 'studio',
                status: 'active'
              })
              .eq('user_id', userId);

            if (updateError) {
              console.error('❌ Error updating admin subscription:', updateError.message);
            } else {
              console.log('✅ Updated admin to studio subscription');
            }
          }
        } catch (dbError) {
          console.warn('⚠️ Database error for admin user, using fallback:', dbError);
        }

        return {
          subscription_tier: 'studio',
          status: 'active',
          is_admin: true
        };
      }
      
      // For non-admin users, fetch their subscription
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('subscription_tier, status, expires_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching subscription:', error.message);
        return { subscription_tier: 'free', status: 'active', is_admin: false };
      }

      if (!data) {
        console.log('📝 Creating default subscription for:', userEmail);
        
        const { data: newSub, error: insertError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: userId,
            subscription_tier: 'free',
            status: 'active'
          })
          .select('subscription_tier, status, expires_at')
          .single();

        if (insertError) {
          console.error('❌ Error creating subscription:', insertError.message);
          return { subscription_tier: 'free', status: 'active', is_admin: false };
        }
        
        console.log('✅ Created subscription:', newSub);
        return { ...newSub, is_admin: false };
      }

      console.log('✅ Fetched subscription:', data);
      return { ...data, is_admin: false };
      
    } catch (error) {
      console.error('💥 Error in fetchUserSubscription:', error);
      const isAdminUser = adminEmails.includes(userEmail);
      return { 
        subscription_tier: isAdminUser ? 'studio' : 'free', 
        status: 'active',
        is_admin: isAdminUser
      };
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing authentication...');
        
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Session error:', error.message);
          // Continue anyway, don't throw
        }

        if (!mounted) return;

        console.log('📱 Session loaded:', session?.user?.email || 'No user');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userSub = await fetchUserSubscription(session.user.id, session.user.email || '');
          if (mounted) {
            setSubscription(userSub);
            console.log('✅ Subscription set:', userSub.subscription_tier);
          }
        } else {
          if (mounted) {
            setSubscription(null);
          }
        }
      } catch (error) {
        console.error('💥 Auth initialization error:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setSubscription(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('✅ Auth initialization complete');
        }
      }
    };

    initializeAuth();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
        
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setSubscription(null);
          return;
        }
        
        if (event === 'TOKEN_REFRESHED' && session) {
          console.log('🔄 Token refreshed');
          setSession(session);
          setUser(session.user);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const userSub = await fetchUserSubscription(session.user.id, session.user.email || '');
            if (mounted) {
              setSubscription(userSub);
              console.log('✅ Subscription updated:', userSub.subscription_tier);
            }
          } catch (error) {
            console.error('❌ Subscription update error:', error);
            if (mounted) {
              const isAdminUser = adminEmails.includes(session.user.email || '');
              setSubscription({ 
                subscription_tier: isAdminUser ? 'studio' : 'free', 
                status: 'active',
                is_admin: isAdminUser
              });
            }
          }
        } else {
          if (mounted) {
            setSubscription(null);
          }
        }
      }
    );

    return () => {
      mounted = false;
      authSubscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      console.log('📝 Signing up user:', email);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) {
        console.error('❌ Sign up error:', error.message);
        throw error;
      }
      console.log('✅ Sign up successful');
    } catch (error) {
      console.error('💥 Sign up exception:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Signing in user:', email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('❌ Sign in error:', error.message);
        throw error;
      }
      console.log('✅ Sign in successful');
    } catch (error) {
      console.error('💥 Sign in exception:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign out error:', error.message);
        throw error;
      }
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('💥 Sign out exception:', error);
      throw error;
    }
  };

  const hasAccess = (requiredTier: 'free' | 'pro' | 'studio'): boolean => {
    if (subscription?.is_admin) {
      console.log('👑 Admin access granted for tier:', requiredTier);
      return true;
    }
    
    if (!subscription || subscription.status !== 'active') {
      return requiredTier === 'free';
    }

    const tierHierarchy = { free: 0, pro: 1, studio: 2 };
    const userTierLevel = tierHierarchy[subscription.subscription_tier];
    const requiredTierLevel = tierHierarchy[requiredTier];
    
    const hasAccess = userTierLevel >= requiredTierLevel;
    console.log('🔍 Access check:', {
      userTier: subscription.subscription_tier,
      requiredTier,
      hasAccess,
      isAdmin: subscription.is_admin
    });

    return hasAccess;
  };

  const isAdmin = (): boolean => {
    return subscription?.is_admin === true;
  };

  const value: AuthContextType = {
    user,
    session,
    subscription,
    loading,
    signIn,
    signUp,
    signOut,
    hasAccess,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};