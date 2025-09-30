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
  adminStatus: {
    isHardcodedAdmin: boolean;
    isProfileAdmin: boolean;
    isInAdminTable: boolean;
    hasStudioAccess: boolean;
    finalAdminStatus: boolean;
  };
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
  const [adminStatus, setAdminStatus] = useState({
    isHardcodedAdmin: false,
    isProfileAdmin: false,
    isInAdminTable: false,
    hasStudioAccess: false,
    finalAdminStatus: false
  });

  console.log('🔐 AuthProvider state:', { 
    userEmail: user?.email, 
    loading, 
    subscriptionTier: subscription?.subscription_tier,
    isAdminFlag: subscription?.is_admin,
    adminStatus,
    refreshCounter
  });

  // Admin emails with full access - hardcoded for reliability
  const adminEmails = ['sallykamari61@gmail.com'];

  const checkComprehensiveAdminStatus = async (userId: string, userEmail: string) => {
    console.log('👑 Performing comprehensive admin status check for:', userEmail);
    
    const status = {
      isHardcodedAdmin: false,
      isProfileAdmin: false,
      isInAdminTable: false,
      hasStudioAccess: false,
      finalAdminStatus: false
    };

    // 1. Check hardcoded admin list (highest priority)
    status.isHardcodedAdmin = adminEmails.includes(userEmail);
    console.log('🔍 Hardcoded admin check:', status.isHardcodedAdmin);

    // 2. Check profiles table for is_admin flag
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, role, subscription_tier')
        .eq('id', userId)
        .maybeSingle();

      if (!profileError && profileData) {
        status.isProfileAdmin = profileData.is_admin === true || profileData.role === 'admin';
        console.log('🔍 Profile admin check:', status.isProfileAdmin, profileData);
      } else {
        console.log('⚠️ Profile check error or no profile:', profileError);
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
        status.isInAdminTable = true;
        console.log('🔍 Admin table check:', status.isInAdminTable);
      }
    } catch (error) {
      console.log('⚠️ Error checking admin_users table:', error);
    }

    // 4. Check subscription level
    try {
      const { data: subData, error: subError } = await supabase
        .from('user_subscriptions')
        .select('subscription_tier, status')
        .eq('user_id', userId)
        .maybeSingle();

      if (!subError && subData) {
        status.hasStudioAccess = subData.subscription_tier === 'studio' && subData.status === 'active';
        console.log('🔍 Studio subscription check:', status.hasStudioAccess);
      }
    } catch (error) {
      console.log('⚠️ Error checking subscription:', error);
    }

    // Determine final admin status
    status.finalAdminStatus = status.isHardcodedAdmin || status.isProfileAdmin || status.isInAdminTable;
    
    console.log('📊 Final admin status determination:', status);
    return status;
  };

  const ensureAdminSetupComplete = async (userId: string, userEmail: string): Promise<void> => {
    console.log('🛡️ Ensuring complete admin setup for:', userEmail);
    
    try {
      // Always ensure profile exists and has admin flags
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: userEmail,
          is_admin: true,
          role: 'admin',
          subscription_tier: 'studio',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('❌ Profile setup error:', profileError);
      } else {
        console.log('✅ Admin profile setup complete');
      }

      // Ensure admin_users table entry
      const { error: adminUsersError } = await supabase
        .from('admin_users')
        .upsert({
          email: userEmail,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        });

      if (adminUsersError) {
        console.error('❌ Admin users table error:', adminUsersError);
      } else {
        console.log('✅ Admin users table setup complete');
      }

      // Ensure studio subscription
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          subscription_tier: 'studio',
          status: 'active',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (subscriptionError) {
        console.error('❌ Subscription setup error:', subscriptionError);
      } else {
        console.log('✅ Studio subscription setup complete');
      }

      console.log('🎉 Complete admin setup finished successfully');
    } catch (error) {
      console.error('💥 Error in admin setup:', error);
    }
  };

  const fetchUserSubscription = async (userId: string, userEmail: string): Promise<UserSubscription> => {
    try {
      console.log('📊 Fetching comprehensive subscription for:', userEmail);
      
      // Check admin status first and store it
      const adminStatusResult = await checkComprehensiveAdminStatus(userId, userEmail);
      setAdminStatus(adminStatusResult);
      
      if (adminStatusResult.finalAdminStatus) {
        console.log('👑 Admin user detected, ensuring complete setup...');
        await ensureAdminSetupComplete(userId, userEmail);
        
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
            setAdminStatus({
              isHardcodedAdmin: false,
              isProfileAdmin: false,
              isInAdminTable: false,
              hasStudioAccess: false,
              finalAdminStatus: false
            });
          }
        }
      } catch (error) {
        console.error('💥 Auth initialization error:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setSubscription(null);
          setAdminStatus({
            isHardcodedAdmin: false,
            isProfileAdmin: false,
            isInAdminTable: false,
            hasStudioAccess: false,
            finalAdminStatus: false
          });
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
          setAdminStatus({
            isHardcodedAdmin: false,
            isProfileAdmin: false,
            isInAdminTable: false,
            hasStudioAccess: false,
            finalAdminStatus: false
          });
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
              setAdminStatus({
                isHardcodedAdmin: isAdminUser,
                isProfileAdmin: false,
                isInAdminTable: false,
                hasStudioAccess: isAdminUser,
                finalAdminStatus: isAdminUser
              });
            }
          }
        } else {
          if (mounted) {
            setSubscription(null);
            setAdminStatus({
              isHardcodedAdmin: false,
              isProfileAdmin: false,
              isInAdminTable: false,
              hasStudioAccess: false,
              finalAdminStatus: false
            });
          }
        }
      }
    );

    return () => {
      mounted = false;
      authSubscription.unsubscribe();
    };
  }, [refreshCounter]);

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
    if (adminStatus.finalAdminStatus || subscription?.is_admin === true) {
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
      isAdmin: subscription.is_admin,
      adminStatus
    });

    return hasAccess;
  };

  const isAdmin = (): boolean => {
    // Primary check: comprehensive admin status
    if (adminStatus.finalAdminStatus) {
      console.log('👑 Admin confirmed by comprehensive check');
      return true;
    }

    // Fallback: subscription admin flag
    if (subscription?.is_admin === true) {
      console.log('👑 Admin confirmed by subscription flag');
      return true;
    }

    // Last resort: hardcoded admin emails
    if (user?.email && adminEmails.includes(user.email)) {
      console.log('👑 Admin confirmed by hardcoded list');
      return true;
    }

    console.log('❌ No admin status detected');
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
    forceRefresh,
    adminStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};