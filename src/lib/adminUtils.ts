import { supabase } from './supabase';

export interface UserDiagnostics {
  userId: string;
  email: string;
  authMetadata: any;
  profileExists: boolean;
  profileData: any;
  isAdminInProfile: boolean;
  isAdminInAuthMetadata: boolean;
  isInAdminUsersTable: boolean;
  isHardcodedAdmin: boolean;
  hasStudioSubscription: boolean;
  recommendedAction: string;
  errors: string[];
}

// Hardcoded admin emails for reliability
const ADMIN_EMAILS = ['sallykamari61@gmail.com'];

export const diagnoseUserAdminStatus = async (userId: string): Promise<UserDiagnostics> => {
  console.log('🔍 Comprehensive admin diagnosis for user:', userId);
  
  const errors: string[] = [];
  let email = '';
  let authMetadata = {};
  let isHardcodedAdmin = false;

  // Get user from auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error('❌ Auth error:', authError);
    errors.push(`Auth error: ${authError.message}`);
  } else if (user) {
    email = user.email || '';
    authMetadata = user.user_metadata || {};
    isHardcodedAdmin = ADMIN_EMAILS.includes(email);
  }

  // Check profiles table
  let profileExists = false;
  let profileData = null;
  let isAdminInProfile = false;

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError && profileError.code !== 'PGRST116') {
      errors.push(`Profile error: ${profileError.message}`);
    } else if (profile) {
      profileExists = true;
      profileData = profile;
      isAdminInProfile = profile.is_admin === true || profile.role === 'admin';
    }
  } catch (error) {
    errors.push(`Profile table access error: ${error}`);
  }

  // Check admin_users table
  let isInAdminUsersTable = false;
  if (email) {
    try {
      const { data: adminUser, error: adminUserError } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (adminUserError && adminUserError.code !== 'PGRST116') {
        errors.push(`Admin users table error: ${adminUserError.message}`);
      } else if (adminUser) {
        isInAdminUsersTable = true;
      }
    } catch (error) {
      errors.push(`Admin users table access error: ${error}`);
    }
  }

  // Check subscription
  let hasStudioSubscription = false;
  try {
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('subscription_tier, status')
      .eq('user_id', userId)
      .maybeSingle();

    if (subError && subError.code !== 'PGRST116') {
      errors.push(`Subscription error: ${subError.message}`);
    } else if (subscription) {
      hasStudioSubscription = subscription.subscription_tier === 'studio' && subscription.status === 'active';
    }
  } catch (error) {
    errors.push(`Subscription table access error: ${error}`);
  }

  const isAdminInAuthMetadata = authMetadata?.is_admin === true;

  const diagnostics: UserDiagnostics = {
    userId,
    email,
    authMetadata,
    profileExists,
    profileData,
    isAdminInProfile,
    isAdminInAuthMetadata,
    isInAdminUsersTable,
    isHardcodedAdmin,
    hasStudioSubscription,
    recommendedAction: 'none',
    errors
  };

  // Determine recommended action
  const isAdminByAnyMethod = isHardcodedAdmin || isAdminInProfile || isAdminInAuthMetadata || isInAdminUsersTable;
  
  if (isHardcodedAdmin && (!profileExists || !isAdminInProfile || !isInAdminUsersTable || !hasStudioSubscription)) {
    diagnostics.recommendedAction = 'setup_full_admin';
  } else if (!profileExists) {
    diagnostics.recommendedAction = 'create_profile';
  } else if (isAdminByAnyMethod && !isAdminInProfile) {
    diagnostics.recommendedAction = 'set_admin_in_profile';
  } else if (isAdminByAnyMethod && !isInAdminUsersTable) {
    diagnostics.recommendedAction = 'add_to_admin_table';
  } else if (isAdminByAnyMethod && !hasStudioSubscription) {
    diagnostics.recommendedAction = 'ensure_studio_subscription';
  }

  console.log('📊 Comprehensive admin diagnostics:', diagnostics);
  return diagnostics;
};

export const setupFullAdminAccess = async (userId: string, email: string): Promise<boolean> => {
  console.log('🛡️ Setting up full admin access for:', email);

  try {
    // 1. Ensure profile with admin privileges
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: email,
        is_admin: true,
        role: 'admin',
        subscription_tier: 'studio',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('❌ Error setting up profile:', profileError);
      return false;
    }
    console.log('✅ Profile admin setup complete');

    // 2. Ensure admin_users table entry
    const { error: adminUsersError } = await supabase
      .from('admin_users')
      .upsert({
        email: email,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      });

    if (adminUsersError) {
      console.error('❌ Error setting up admin_users:', adminUsersError);
      return false;
    }
    console.log('✅ admin_users table setup complete');

    // 3. Ensure studio subscription
    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        subscription_tier: 'studio',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (subscriptionError) {
      console.error('❌ Error setting up subscription:', subscriptionError);
      return false;
    }
    console.log('✅ Studio subscription setup complete');

    console.log('🎉 Full admin access setup successful');
    return true;
  } catch (error) {
    console.error('💥 Error in full admin setup:', error);
    return false;
  }
};

export const createUserProfile = async (userId: string, email: string, isAdmin: boolean = false) => {
  console.log('👤 Creating user profile:', { userId, email, isAdmin });

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: email,
      is_admin: isAdmin,
      role: isAdmin ? 'admin' : 'user',
      subscription_tier: isAdmin ? 'studio' : 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'id'
    });

  if (error) {
    console.error('❌ Error creating profile:', error);
    throw error;
  }

  console.log('✅ Profile created/updated successfully');
  return data;
};

export const setUserAdminStatus = async (userId: string, isAdmin: boolean) => {
  console.log('🛡️ Setting admin status:', { userId, isAdmin });

  // Update profile table
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      is_admin: isAdmin,
      role: isAdmin ? 'admin' : 'user',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (profileError) {
    console.error('❌ Error updating profile admin status:', profileError);
    throw profileError;
  }

  console.log('✅ Admin status updated in profile table');
  return true;
};

export const checkAndFixCurrentUserAdmin = async (): Promise<boolean> => {
  console.log('🔧 Checking and fixing current user admin status...');

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('❌ No authenticated user found');
    return false;
  }

  try {
    const diagnostics = await diagnoseUserAdminStatus(user.id);
    console.log('📋 Current diagnostics:', diagnostics);

    // Check if user should be admin (hardcoded list)
    const shouldBeAdmin = ADMIN_EMAILS.includes(user.email || '');
    
    if (shouldBeAdmin) {
      console.log('🛠️ User should be admin, setting up full access...');
      const success = await setupFullAdminAccess(user.id, user.email!);
      return success;
    }

    // Auto-fix based on diagnostics for other cases
    switch (diagnostics.recommendedAction) {
      case 'setup_full_admin':
        console.log('🛠️ Setting up full admin access...');
        return await setupFullAdminAccess(user.id, user.email!);
        
      case 'create_profile':
        console.log('🛠️ Creating missing profile...');
        await createUserProfile(user.id, user.email!, shouldBeAdmin);
        break;
        
      case 'set_admin_in_profile':
        console.log('🛠️ Setting admin flag in profile...');
        await setUserAdminStatus(user.id, true);
        break;
        
      default:
        console.log('✅ No action needed');
    }

    // Re-check after fixes
    const updatedDiagnostics = await diagnoseUserAdminStatus(user.id);
    console.log('📊 Updated diagnostics:', updatedDiagnostics);
    
    return updatedDiagnostics.isAdminInProfile || updatedDiagnostics.isHardcodedAdmin;
  } catch (error) {
    console.error('❌ Error in admin status check/fix:', error);
    return false;
  }
};

// Emergency admin restore function - grants admin to current user
export const emergencyGrantAdminAccess = async (): Promise<boolean> => {
  console.log('🚨 EMERGENCY: Granting admin access to current user...');

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error('❌ No authenticated user found');
    return false;
  }

  try {
    // Force setup full admin access regardless of current state
    const success = await setupFullAdminAccess(user.id, user.email!);
    
    if (success) {
      console.log('✅ Emergency admin access granted successfully');
      return true;
    } else {
      console.error('❌ Emergency admin access failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Emergency admin grant failed:', error);
    return false;
  }
};

// Check if user is in admin_users table
export const checkAdminUsersTable = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error checking admin_users table:', error);
      return false;
    }

    const isInAdminTable = !!data;
    console.log('📋 Admin users table check:', { email, isInAdminTable });
    
    return isInAdminTable;
  } catch (error) {
    console.error('❌ Error in admin users table check:', error);
    return false;
  }
};

// Add user to admin_users table
export const addToAdminUsersTable = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_users')
      .upsert({
        email: email,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      });

    if (error) {
      console.error('❌ Error adding to admin_users table:', error);
      return false;
    }

    console.log('✅ User added to admin_users table:', email);
    return true;
  } catch (error) {
    console.error('❌ Error in admin users table addition:', error);
    return false;
  }
};

// Check if user is hardcoded admin
export const isHardcodedAdmin = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email);
};