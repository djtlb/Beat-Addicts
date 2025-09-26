import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
    urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined',
    keyValue: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined'
  });
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('supabase.co')) {
  console.error('❌ Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format. Expected: https://your-project.supabase.co');
}

console.log('🔧 Initializing Supabase client with enhanced configuration');
console.log('📍 Supabase URL:', supabaseUrl.substring(0, 30) + '...');

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
      'x-application-name': 'beat-addicts-studio',
      'x-client-info': 'beat-addicts@1.0.0'
    },
    fetch: (url, options = {}) => {
      console.log('🌐 Supabase fetch request:', {
        url: url.toString(),
        method: options.method || 'GET',
        headers: options.headers
      });
      
      return fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });
    }
  }
});

// Enhanced connection test with detailed diagnostics
export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    console.log('📡 Test 1: Basic auth connection');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session test failed:', sessionError);
      return false;
    }
    
    console.log('✅ Session test passed:', sessionData.session ? 'Authenticated' : 'Anonymous');
    
    // Test 2: Simple function call test
    console.log('📡 Test 2: Edge Function connectivity');
    try {
      const testResponse = await fetch(`${supabaseUrl}/functions/v1/generate-music`, {
        method: 'OPTIONS',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🔍 CORS preflight response:', {
        status: testResponse.status,
        statusText: testResponse.statusText,
        headers: Object.fromEntries(testResponse.headers.entries())
      });
      
      if (testResponse.status === 200 || testResponse.status === 204) {
        console.log('✅ Edge Functions are reachable');
        return true;
      } else {
        console.warn('⚠️ Edge Functions may not be deployed or accessible');
        return false;
      }
    } catch (fetchError) {
      console.error('❌ Direct Edge Function test failed:', fetchError);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
}

// Enhanced function invoker with comprehensive error handling and retries
export async function invokeFunction(functionName: string, options: any = {}) {
  console.log(`🚀 Invoking Supabase function: ${functionName}`);
  console.log('📤 Request options:', {
    body: options.body ? 'present' : 'none',
    headers: options.headers || 'default',
    bodySize: options.body ? JSON.stringify(options.body).length : 0
  });
  
  // Validate function name
  const validFunctions = ['generate-music', 'openai-enhance', 'stem-separation', 'ok-response', 'check-subscription'];
  if (!validFunctions.includes(functionName)) {
    console.warn(`⚠️ Unknown function: ${functionName}. Valid functions:`, validFunctions);
  }
  
  const maxRetries = 3;
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries} for ${functionName}`);
      
      // Prepare request with enhanced headers
      const requestOptions = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-client-info': 'beat-addicts-studio',
          'x-attempt': attempt.toString(),
          'x-function-name': functionName,
          ...options.headers
        }
      };
      
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Function ${functionName} timed out after 60 seconds`)), 60000);
      });
      
      const functionPromise = supabase.functions.invoke(functionName, requestOptions);
      
      const { data, error } = await Promise.race([functionPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error(`❌ Function ${functionName} error (attempt ${attempt}):`, {
          message: error.message,
          name: error.name,
          status: error.status,
          statusText: error.statusText,
          details: error.details || 'No details'
        });
        
        lastError = error;
        
        // Check if it's a retryable error
        const isRetryable = error.name === 'FunctionsFetchError' || 
                           error.status >= 500 || 
                           error.message?.includes('network') ||
                           error.message?.includes('timeout') ||
                           error.message?.includes('Failed to send');
        
        if (!isRetryable || attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retry with exponential backoff
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`⏳ Waiting ${backoffDelay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        continue;
      }
      
      console.log(`✅ Function ${functionName} completed successfully (attempt ${attempt})`);
      console.log('📥 Response received:', {
        dataPresent: !!data,
        dataType: typeof data,
        success: data?.success
      });
      
      return { data, error: null };
      
    } catch (err) {
      console.error(`💥 Function ${functionName} failed (attempt ${attempt}):`, {
        name: err.name,
        message: err.message,
        stack: err.stack?.split('\n').slice(0, 3)
      });
      
      lastError = err;
      
      // If it's the last attempt, throw the error
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retry
      const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`⏳ Retrying in ${backoffDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  // All retries failed
  console.error(`❌ Function ${functionName} failed after ${maxRetries} attempts`);
  return { data: null, error: lastError };
}

// Test function to verify Edge Functions are working
export async function testEdgeFunctions() {
  console.log('🧪 Testing Edge Functions availability...');
  
  const testResults = {};
  const functionsToTest = ['generate-music', 'openai-enhance', 'stem-separation'];
  
  for (const functionName of functionsToTest) {
    try {
      console.log(`🔍 Testing ${functionName}...`);
      
      // Send a simple test request
      const { data, error } = await invokeFunction(functionName, {
        body: { test: true, timestamp: Date.now() }
      });
      
      testResults[functionName] = {
        available: !error,
        error: error?.message || null,
        responseReceived: !!data
      };
      
      console.log(`${error ? '❌' : '✅'} ${functionName}: ${error ? error.message : 'OK'}`);
      
    } catch (err) {
      testResults[functionName] = {
        available: false,
        error: err.message,
        responseReceived: false
      };
      console.log(`❌ ${functionName}: ${err.message}`);
    }
  }
  
  console.log('🧪 Edge Functions test results:', testResults);
  return testResults;
}

// Run initial connection test
testSupabaseConnection().then(isConnected => {
  if (isConnected) {
    console.log('✅ Supabase fully operational');
  } else {
    console.warn('⚠️ Supabase connection issues detected');
  }
});