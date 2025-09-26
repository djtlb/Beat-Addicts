import { supabase } from './supabase';

export interface UserDiagnostics {
  userId: string;
  email: string;
  authMetadata: any;
  profileExists: boolean;
  profileData: any;
  isAdminInProfile: boolean;
  isAdminInAuthMetadata: boolean;
  recommendedAction: string;
  errors: string[];
}

export const diagnoseUserAdminStatus = async (userId: string): Promise<UserDiagnostics> => {
  console.log('🔍 Diagnosing admin status for user:', userId);
  
  const errors: string[] = [];

  // Get user from auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error('❌ Auth error:', authError);
    errors.push(`Auth error: ${authError.message}`);
  }

  // Check profile table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError && profileError.code !== 'PGRST116') {
    errors.push(`Profile error: ${profileError.message}`);
  }

  const diagnostics: UserDiagnostics = {
    userId,
    email: user?.email || 'Unknown',
    authMetadata: user?.user_metadata || {},
    profileExists: !profileError && !!profileData,
    profileData: profileData || null,
    isAdminInProfile: profileData?.is_admin === true,
    isAdminInAuthMetadata: user?.user_metadata?.is_admin === true,
    recommendedAction: 'none',
    errors
  };

  // Determine recommended action
  if (!diagnostics.profileExists) {
    diagnostics.recommendedAction = 'create_profile';
  } else if (!diagnostics.isAdminInProfile && !diagnostics.isAdminInAuthMetadata) {
    diagnostics.recommendedAction = 'set_admin_flag';
  } else if (diagnostics.isAdminInAuthMetadata && !diagnostics.isAdminInProfile) {
    diagnostics.recommendedAction = 'sync_profile_from_auth';
  } else if (!diagnostics.isAdminInAuthMetadata && diagnostics.isAdminInProfile) {
    diagnostics.recommendedAction = 'sync_auth_from_profile';
  }

  console.log('📊 Admin diagnostics:', diagnostics);
  return diagnostics;
};

export const createUserProfile = async (userId: string, email: string, isAdmin: boolean = false) => {
  console.log('👤 Creating user profile:', { userId, email, isAdmin });

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: email,
      is_admin: isAdmin,
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

    // Auto-fix based on diagnostics
    switch (diagnostics.recommendedAction) {
      case 'create_profile':
        console.log('🛠️ Creating missing profile with admin privileges...');
        await createUserProfile(user.id, user.email!, true);
        break;
        
      case 'set_admin_flag':
        console.log('🛠️ Setting admin flag for current user...');
        await setUserAdminStatus(user.id, true);
        break;
        
      case 'sync_profile_from_auth':
        console.log('🛠️ Syncing profile from auth metadata...');
        await setUserAdminStatus(user.id, diagnostics.isAdminInAuthMetadata);
        break;
        
      default:
        console.log('✅ No action needed, admin status is correct');
    }

    // Re-check after fixes
    const updatedDiagnostics = await diagnoseUserAdminStatus(user.id);
    console.log('📊 Updated diagnostics:', updatedDiagnostics);
    
    return updatedDiagnostics.isAdminInProfile;
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
    // Force create/update profile with admin privileges
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email!,
        is_admin: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (upsertError) {
      console.error('❌ Error in emergency admin grant:', upsertError);
      return false;
    }

    console.log('✅ Emergency admin access granted successfully');
    return true;
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
        email: email
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