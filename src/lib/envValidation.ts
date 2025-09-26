interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  OPENAI_API_KEY?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnvironment(): ValidationResult {
  console.log('🔍 Validating environment configuration...');
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required Supabase variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    errors.push('VITE_SUPABASE_URL is missing from environment variables');
  } else if (!supabaseUrl.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must start with https://');
  } else if (!supabaseUrl.includes('supabase.co')) {
    errors.push('VITE_SUPABASE_URL must be a valid Supabase URL (*.supabase.co)');
  }
  
  if (!supabaseAnonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is missing from environment variables');
  } else if (supabaseAnonKey.length < 100) {
    warnings.push('VITE_SUPABASE_ANON_KEY appears to be too short (expected ~110+ characters)');
  }
  
  // Check optional OpenAI key
  const openaiKey = import.meta.env.OPENAI_API_KEY;
  if (!openaiKey) {
    warnings.push('OPENAI_API_KEY is missing - OpenAI features will be disabled');
  } else if (!openaiKey.startsWith('sk-')) {
    warnings.push('OPENAI_API_KEY should start with "sk-"');
  }
  
  // Log validation results
  console.log('📊 Environment validation results:', {
    supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'missing',
    supabaseKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'missing',
    openaiKey: openaiKey ? 'present' : 'missing',
    errors: errors.length,
    warnings: warnings.length
  });
  
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:', errors);
  } else {
    console.log('✅ Environment validation passed');
  }
  
  if (warnings.length > 0) {
    console.warn('⚠️ Environment warnings:', warnings);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function getEnvironmentInfo(): EnvConfig {
  return {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    OPENAI_API_KEY: import.meta.env.OPENAI_API_KEY || ''
  };
}

// Auto-validate on module load
const validation = validateEnvironment();
if (!validation.isValid) {
  console.error('🚨 Critical environment configuration errors detected!');
  console.error('Please check your .env file and ensure all required variables are set.');
}

export { validation as environmentValidation };