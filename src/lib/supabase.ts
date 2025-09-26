import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Environment check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'undefined',
  keyPreview: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 30)}...` : 'undefined'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure your .env file contains:');
  console.error('VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('VITE_SUPABASE_ANON_KEY=your-anon-key');
  throw new Error('Missing required Supabase environment variables');
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('supabase.co')) {
  console.error('❌ Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format. Expected: https://your-project.supabase.co');
}

console.log('✅ Supabase environment variables found');
console.log('🔧 Initializing Supabase client...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
  }
});

// Enhanced connection test
export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test basic auth connection
    const { data: sessionData, error: sessionError } = await supabaseAuth.getSession();
    
    if (sessionError) {
      console.error('❌ Session test failed:', sessionError);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
    
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
}

// Create a separate auth client to avoid circular references
export const supabaseAuth = supabase.auth;

// Enhanced function invoker with proper error handling
export async function invokeFunction(functionName: string, options: any = {}) {
  console.log(`🚀 Invoking function: ${functionName}`);
  
  try {
    // Ensure we have a valid session for authenticated requests
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers = {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${session?.access_token || supabaseAnonKey}`,
      ...options.headers
    };
    
    console.log('📤 Request headers configured:', {
      hasApiKey: !!headers.apikey,
      hasAuth: !!headers.Authorization,
      sessionExists: !!session
    });
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      ...options,
      headers
    });
    
    if (error) {
      console.error(`❌ Function ${functionName} error:`, error);
      return { data: null, error };
    }
    
    console.log(`✅ Function ${functionName} completed successfully`);
    return { data, error: null };
    
  } catch (err) {
    console.error(`💥 Function ${functionName} exception:`, err);
    return { data: null, error: err };
  }
}

// Initialize connection test
console.log('🚀 Initializing Supabase client...');
testSupabaseConnection().then(isConnected => {
  if (isConnected) {
    console.log('✅ Supabase initialization complete');
  } else {
    console.warn('⚠️ Supabase connection issues detected');
  }
});