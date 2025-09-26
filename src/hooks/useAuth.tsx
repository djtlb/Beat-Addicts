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
  refreshUserData: () => Promise<void>;
  forceRefresh: () => void;
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
  const [refreshCounter, setRefreshCounter] = useState(0);

  console.log('🔐 AuthProvider state:', { 
    userEmail: user?.email, 
    loading, 
    subscriptionTier: subscription?.subscription_tier,
    isAdminFlag: subscription?.is_admin,
    refreshCounter
  });

  // Admin emails with full access - hardcoded for reliability
  const adminEmails = ['sallykamari61@gmail.com'];

  const checkAdminStatus = async (userId: string, userEmail: string): Promise<boolean> => {
    console.log('👑 Checking comprehensive admin status for:', userEmail);
    
    // 1. Check hardcoded admin list (highest priority)
    if (adminEmails.includes(userEmail)) {
      console.log('✅ User is in hardcoded admin list');
      return true;
    }

    // 2. Check profiles table for is_admin flag
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, role')
        .eq('id', userId)
        .maybeSingle();

      if (!profileError && profileData) {
        if (profileData.is_admin === true) {
          console.log('✅ User has is_admin=true in profiles');
          return true;
        }
        if (profileData.role === 'admin') {
          console.log('✅ User has role=admin in profiles');
          return true;
        }
      }
    } catch (error) {
      console.log('⚠️ Error checking profiles table:', error);
    }

    // 3. Check admin_users table
    try {
      const { data: adminUserData, error: adminUserError } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', userEmail)
        .maybeSingle();

      if (!adminUserError && adminUserData) {
        console.log('✅ User found in admin_users table');
        return true;
      }
    } catch (error) {
      console.log('⚠️ Error checking admin_users table:', error);
    }

    // 4. Check auth metadata
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser?.user_metadata?.is_admin === true) {
        console.log('✅ User has is_admin=true in auth metadata');
        return true;
      }
    } catch (error) {
      console.log('⚠️ Error checking auth metadata:', error);
    }

    console.log('❌ User is not admin by any method');
    return false;
  };

  const ensureAdminSetup = async (userId: string, userEmail: string): Promise<void> => {
    const isAdmin = await checkAdminStatus(userId, userEmail);
    
    if (isAdmin) {
      console.log('🛡️ Setting up admin user in all systems...');
      
      // Ensure profile exists with admin flag
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: userEmail,
            is_admin: true,
            role: 'admin',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (profileError) {
          console.error('❌ Error updating profile:', profileError);
        } else {
          console.log('✅ Profile updated with admin privileges');
        }
      } catch (error) {
        console.log('⚠️ Could not update profile (table might not exist)');
      }

      // Ensure admin_users table entry
      try {
        const { error: adminUsersError } = await supabase
          .from('admin_users')
          .upsert({
            email: userEmail
          }, {
            onConflict: 'email'
          });

        if (adminUsersError) {
          console.error('❌ Error updating admin_users:', adminUsersError);
        } else {
          console.log('✅ admin_users table updated');
        }
      } catch (error) {
        console.log('⚠️ Could not update admin_users (table might not exist)');
      }

      // Ensure studio subscription
      try {
        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            subscription_tier: 'studio',
            status: 'active'
          }, {
            onConflict: 'user_id'
          });

        if (subscriptionError) {
          console.error('❌ Error updating subscription:', subscriptionError);
        } else {
          console.log('✅ Studio subscription ensured');
        }
      } catch (error) {
        console.log('⚠️ Could not update subscription (table might not exist)');
      }
    }
  };

  const fetchUserSubscription = async (userId: string, userEmail: string): Promise<UserSubscription> => {
    try {
      console.log('📊 Fetching comprehensive subscription for:', userEmail);
      
      // Check admin status first
      const isAdminUser = await checkAdminStatus(userId, userEmail);
      
      if (isAdminUser) {
        console.log('👑 Admin user detected, ensuring full setup...');
        await ensureAdminSetup(userId, userEmail);
        
        return {
          subscription_tier: 'studio',
          status: 'active',
          is_admin: true
        };
      }
      
      // For non-admin users, fetch their subscription normally
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
        
        return { ...newSub, is_admin: false };
      }

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

  const refreshUserData = async () => {
    if (!user) return;
    
    console.log('🔄 Refreshing user data...');
    try {
      const userSub = await fetchUserSubscription(user.id, user.email || '');
      setSubscription(userSub);
      console.log('✅ User data refreshed:', userSub);
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
    }
  };

  const forceRefresh = () => {
    console.log('🔄 Force refreshing auth context...');
    setRefreshCounter(prev => prev + 1);
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing authentication... (refresh:', refreshCounter, ')');
        
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('❌ Session error:', error.message);
        }

        if (!mounted) return;

        console.log('📱 Session loaded:', session?.user?.email || 'No user');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userSub = await fetchUserSubscription(session.user.id, session.user.email || '');
          if (mounted) {
            setSubscription(userSub);
            console.log('✅ Subscription set:', userSub);
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
              console.log('✅ Subscription updated:', userSub);
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
  }, [refreshCounter]); // Add refreshCounter as dependency

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
    // Admin always has access to everything
    if (subscription?.is_admin === true) {
      console.log('👑 Admin access granted for tier:', requiredTier);
      return true;
    }

    // Check hardcoded admin emails as fallback
    if (user?.email && adminEmails.includes(user.email)) {
      console.log('👑 Hardcoded admin access granted for tier:', requiredTier);
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
    // Check subscription admin flag first
    if (subscription?.is_admin === true) {
      return true;
    }

    // Fallback to hardcoded admin emails
    if (user?.email && adminEmails.includes(user.email)) {
      return true;
    }

    return false;
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
    isAdmin,
    refreshUserData,
    forceRefresh
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};