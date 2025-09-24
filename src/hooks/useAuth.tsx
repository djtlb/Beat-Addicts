import { Session, User } from '@supabase/supabase-js';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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

  console.log('AuthProvider rendered, user:', user?.email, 'loading:', loading, 'subscription:', subscription);

  // Admin emails that get full access
  const adminEmails = useMemo(() => ['sallykamari61@gmail.com'], []);

  const fetchUserSubscription = useCallback(async (userId: string, userEmail: string) => {
    try {
      console.log('Fetching subscription for user:', userEmail, userId);

      // Check if user is admin first
      const isAdminUser = adminEmails.includes(userEmail);

      if (isAdminUser) {
        console.log('Admin user detected:', userEmail);
        // For admin users, ensure they have studio subscription in database
        const { data: existingSub, error: fetchError } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching admin subscription:', fetchError);
        }

        // Create or update admin subscription to studio tier
        if (!existingSub) {
          const { error: insertError } = await supabase
            .from('user_subscriptions')
            .insert({
              user_id: userId,
              subscription_tier: 'studio',
              status: 'active'
            });

          if (insertError) {
            console.error('Error creating admin subscription:', insertError);
          } else {
            console.log('Created studio subscription for admin');
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
            console.error('Error updating admin subscription:', updateError);
          } else {
            console.log('Updated admin to studio subscription');
          }
        }

        return {
          subscription_tier: 'studio',
          status: 'active',
          is_admin: true
        } as UserSubscription;
      }

      // For non-admin users, fetch their actual subscription
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('subscription_tier, status, expires_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return { subscription_tier: 'free', status: 'active', is_admin: false } as UserSubscription;
      }

      if (!data) {
        console.log('No subscription found, creating default subscription for:', userEmail);

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
          console.error('Error creating subscription:', insertError);
          return { subscription_tier: 'free', status: 'active', is_admin: false } as UserSubscription;
        }

        console.log('Created subscription:', newSub);
        return { ...newSub, is_admin: false };
      }

      console.log('Fetched subscription data:', data);
      return { ...data, is_admin: false };
    } catch (error) {
      console.error('Error in fetchUserSubscription:', error);
      const isAdminUser = adminEmails.includes(userEmail);
      return {
        subscription_tier: isAdminUser ? 'studio' : 'free',
        status: 'active',
        is_admin: isAdminUser
      } as UserSubscription;
    }
  }, [adminEmails]);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('Initializing authentication...');

        // Clear any existing timeout
        if (timeoutId) clearTimeout(timeoutId);

        // Set a reasonable timeout for session retrieval
        const sessionPromise = supabase.auth.getSession();

        timeoutId = setTimeout(() => {
          console.warn('Session retrieval taking longer than expected, continuing with initialization...');
        }, 3000);

        const { data: { session }, error } = await sessionPromise;
        clearTimeout(timeoutId);

        if (error) {
          console.error('Session error:', error);
          // Don't throw on session errors, just continue
        }

        if (!mounted) return;

        console.log('Initial session loaded:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            const userSub = await fetchUserSubscription(session.user.id, session.user.email || '');
            if (mounted) {
              setSubscription(userSub);
              console.log('User subscription set:', userSub);
            }
          } catch (subError) {
            console.error('Subscription fetch error:', subError);
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
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          // Set default state instead of throwing
          setSession(null);
          setUser(null);
          setSubscription(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('Auth initialization complete');
        }
      }
    };

    // Add a fallback timeout to ensure loading doesn't get stuck
    const fallbackTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout - setting loading to false');
        setLoading(false);
        setSession(null);
        setUser(null);
        setSubscription(null);
      }
    }, 10000); // 10 second fallback

    initializeAuth();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);

        // Handle different auth events
        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setSubscription(null);
          return;
        }

        if (event === 'TOKEN_REFRESHED' && session) {
          console.log('Token refreshed successfully');
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
              console.log('Subscription updated on auth change:', userSub);
            }
          } catch (error) {
            console.error('Subscription update error:', error);
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
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(fallbackTimeout);
      authSubscription.unsubscribe();
    };
  }, [adminEmails, fetchUserSubscription]);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const hasAccess = (requiredTier: 'free' | 'pro' | 'studio'): boolean => {
    // Admin users always have full access
    if (subscription?.is_admin) {
      console.log('Admin access granted for tier:', requiredTier);
      return true;
    }

    if (!subscription || subscription.status !== 'active') {
      return requiredTier === 'free';
    }

    const tierHierarchy = { free: 0, pro: 1, studio: 2 };
    const userTierLevel = tierHierarchy[subscription.subscription_tier];
    const requiredTierLevel = tierHierarchy[requiredTier];

    const hasAccess = userTierLevel >= requiredTierLevel;
    console.log('Access check:', {
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
